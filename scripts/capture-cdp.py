"""Capture scrolled, full-page browser evidence with installed Chrome and stdlib/websockets."""
import argparse
import asyncio
import base64
import json
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path

import websockets


async def capture(ws, url, width, height, out, full, feature):
    seq = 0

    async def cmd(method, params=None):
        nonlocal seq
        seq += 1
        await ws.send(json.dumps({"id": seq, "method": method, "params": params or {}}))
        while True:
            message = json.loads(await ws.recv())
            if message.get("id") == seq:
                if "error" in message:
                    raise RuntimeError(message["error"])
                return message.get("result", {})

    await cmd("Page.enable")
    await cmd("Runtime.enable")
    await cmd("Emulation.setDeviceMetricsOverride", {"width": width, "height": height, "deviceScaleFactor": 1, "mobile": width < 600})
    await cmd("Page.navigate", {"url": url})
    await asyncio.sleep(4)
    if feature:
        await cmd("Runtime.evaluate", {"expression": "document.querySelector('main h2, h2')?.scrollIntoView({behavior:'instant',block:'start'})"})
        await asyncio.sleep(1)
    if full:
        result = await cmd("Runtime.evaluate", {"expression": "Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)", "returnByValue": True})
        page_height = min(int(result["result"]["value"]), 30000)
        for y in range(0, page_height, max(height - 100, 300)):
            await cmd("Runtime.evaluate", {"expression": f"window.scrollTo({{top:{y},behavior:'instant'}})"})
            await asyncio.sleep(0.35)
        await cmd("Runtime.evaluate", {"expression": "window.scrollTo({top:0,behavior:'instant'})"})
        await asyncio.sleep(0.7)
        result = await cmd("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": True, "clip": {"x": 0, "y": 0, "width": width, "height": page_height, "scale": 1}})
    else:
        result = await cmd("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(base64.b64decode(result["data"]))
    print(f"{out}: {len(result['data']) * 3 // 4} bytes")


async def main(args):
    chrome = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as profile:
        process = subprocess.Popen([str(chrome), "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--remote-debugging-port=9337", f"--user-data-dir={profile}"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            for _ in range(50):
                try:
                    pages = json.load(urllib.request.urlopen("http://127.0.0.1:9337/json"))[0]
                    break
                except Exception:
                    time.sleep(0.1)
            else:
                raise RuntimeError("Chrome debugging port did not open")
            async with websockets.connect(pages["webSocketDebuggerUrl"], max_size=100_000_000) as ws:
                await capture(ws, args.url, args.width, args.height, Path(args.output), args.full, args.feature)
        finally:
            process.terminate()
            process.wait(timeout=5)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("url")
    parser.add_argument("output")
    parser.add_argument("--width", type=int, default=1440)
    parser.add_argument("--height", type=int, default=900)
    parser.add_argument("--full", action="store_true")
    parser.add_argument("--feature", action="store_true")
    asyncio.run(main(parser.parse_args()))
