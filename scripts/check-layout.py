"""Browser smoke check for horizontal overflow and reduced-motion phone behavior."""
import asyncio
import json
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path
import websockets


async def main():
    chrome = Path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as profile:
        process = subprocess.Popen([str(chrome), '--headless=new', '--no-first-run', '--remote-debugging-port=9339', f'--user-data-dir={profile}'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            for _ in range(50):
                try:
                    tab = json.load(urllib.request.urlopen('http://127.0.0.1:9339/json'))[0]
                    break
                except Exception:
                    time.sleep(.1)
            else:
                raise RuntimeError('Chrome debugging port did not open')
            async with websockets.connect(tab['webSocketDebuggerUrl']) as ws:
                seq = 0
                async def cmd(method, params=None):
                    nonlocal seq
                    seq += 1
                    await ws.send(json.dumps({'id': seq, 'method': method, 'params': params or {}}))
                    while True:
                        response = json.loads(await ws.recv())
                        if response.get('id') == seq:
                            if 'error' in response: raise RuntimeError(response['error'])
                            return response.get('result', {})
                await cmd('Page.enable')
                for page in ('', 'features/', 'android/', 'faq/', 'privacy/', 'auth/callback/'):
                    for width in (375, 1440):
                        await cmd('Emulation.setDeviceMetricsOverride', {'width': width, 'height': 812, 'deviceScaleFactor': 1, 'mobile': width == 375})
                        await cmd('Page.navigate', {'url': f'http://127.0.0.1:4174/Toki-Landing/{page}'})
                        await asyncio.sleep(.7)
                        result = await cmd('Runtime.evaluate', {'expression': '({title: document.title, overflow: document.documentElement.scrollWidth - innerWidth})', 'returnByValue': True})
                        info = result['result']['value']
                        print(f'{page or "home"} {width}: title={info["title"]!r} horizontal overflow {info["overflow"]}px')
                        if 'Sylviae' not in info['title']: raise AssertionError(f'Page failed to load: {info}')
                        if info['overflow'] > 0: raise AssertionError('Horizontal overflow')
                await cmd('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'reduce'}]})
                await cmd('Page.navigate', {'url': 'http://127.0.0.1:4174/Toki-Landing/android/'})
                await asyncio.sleep(.7)
                result = await cmd('Runtime.evaluate', {'expression': "(() => { const v = document.querySelector('[data-animated-phone] video'); const t = document.querySelector('.phone-timer'); return { sources: v ? v.querySelectorAll('source').length : -1, timer: t ? getComputedStyle(t).display : 'missing' }; })()", 'returnByValue': True})
                val = result.get('result', {}).get('value')
                print('Reduced motion:', val)
                assert val == {'sources': 0, 'timer': 'none'}, f'Unexpected reduced-motion state: {result}'
        finally:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)


asyncio.run(main())
