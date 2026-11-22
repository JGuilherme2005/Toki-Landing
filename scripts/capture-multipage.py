"""Capture mobile and desktop pages in one Chrome session for visual review."""
import asyncio
import json
import importlib.util
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

import websockets

spec = importlib.util.spec_from_file_location('capture_cdp', Path(__file__).with_name('capture-cdp.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
capture = module.capture


async def main(round_name):
    chrome = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
    root = Path(__file__).resolve().parents[1]
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as profile:
        process = subprocess.Popen([str(chrome), '--headless=new', '--hide-scrollbars', '--no-first-run', '--remote-debugging-port=9338', f'--user-data-dir={profile}'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            for _ in range(50):
                try:
                    tab = json.load(urllib.request.urlopen('http://127.0.0.1:9338/json'))[0]
                    break
                except Exception:
                    time.sleep(.1)
            else:
                raise RuntimeError('Chrome debugging port did not open')
            async with websockets.connect(tab['webSocketDebuggerUrl'], max_size=100_000_000) as ws:
                for page in ('home', 'features', 'android', 'faq', 'privacy'):
                    suffix = '' if page == 'home' else f'{page}/'
                    for width, height in ((375, 812), (1440, 900)):
                        out = root / 'docs' / 'screenshots' / 'multipage' / round_name / f'{page}-{width}.png'
                        await capture(ws, f'http://127.0.0.1:4174/Toki-Landing/{suffix}', width, height, out, True, False)
        finally:
            process.terminate()
            process.wait(timeout=5)


asyncio.run(main(sys.argv[1]))
