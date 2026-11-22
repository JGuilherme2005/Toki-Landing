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
                for page in ('', 'features/', 'android/', 'faq/', 'privacy/'):
                    for width in (375, 1440):
                        await cmd('Emulation.setDeviceMetricsOverride', {'width': width, 'height': 812, 'deviceScaleFactor': 1, 'mobile': width == 375})
                        await cmd('Page.navigate', {'url': f'http://127.0.0.1:4174/Toki-Landing/{page}'})
                        await asyncio.sleep(.7)
                        result = await cmd('Runtime.evaluate', {'expression': 'document.documentElement.scrollWidth - innerWidth', 'returnByValue': True})
                        overflow = result['result']['value']
                        print(f'{page or "home"} {width}: horizontal overflow {overflow}px')
                        if overflow > 0: raise AssertionError('Horizontal overflow')
                await cmd('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'reduce'}]})
                await cmd('Page.navigate', {'url': 'http://127.0.0.1:4174/Toki-Landing/android/'})
                await asyncio.sleep(.7)
                result = await cmd('Runtime.evaluate', {'expression': "({sources:document.querySelector('[data-animated-phone] video').querySelectorAll('source').length,timer:getComputedStyle(document.querySelector('.phone-timer')).display})", 'returnByValue': True})
                print('Reduced motion:', result['result']['value'])
                assert result['result']['value'] == {'sources': 0, 'timer': 'none'}
        finally:
            process.terminate()
            process.wait(timeout=5)


asyncio.run(main())
