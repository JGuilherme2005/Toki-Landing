const expiredPattern = /expired|invalid|already been used|used otp/i;

function readCallbackParams(search = '', hash = '') {
  const query = new URLSearchParams(search);
  const fragment = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  return { query, fragment };
}

function getParam(params, key) {
  return params.get(key);
}

function hasParam(params, key) {
  return params.has(key) && Boolean(params.get(key));
}

export function getCallbackState(search = '', hash = '') {
  const { query, fragment } = readCallbackParams(search, hash);
  const params = [query, fragment];
  const get = (key) => params.map((part) => getParam(part, key)).find(Boolean) ?? '';
  const has = (key) => params.some((part) => hasParam(part, key));
  const error = [get('error'), get('error_code'), get('error_description')].filter(Boolean).join(' ');

  if (error) {
    if (expiredPattern.test(error) || get('error_code').toLowerCase() === 'otp_expired') {
      return { kind: 'expired', canOpenApp: false };
    }
    return { kind: 'error', canOpenApp: false };
  }

  const type = get('type').toLowerCase();
  const validCode = has('code');
  const validTokenHash = has('token_hash') && ['email', 'signup', 'recovery', 'magiclink', 'email_change'].includes(type);
  const validTokenPair = has('access_token') && has('refresh_token');
  const canOpenApp = validCode || validTokenHash || validTokenPair;

  if (!canOpenApp) return { kind: 'error', canOpenApp: false };
  if (type === 'recovery') return { kind: 'recovery', canOpenApp: true };
  if (['email', 'signup', 'email_change'].includes(type)) return { kind: 'confirmed', canOpenApp: true };
  if (validCode) return { kind: 'ready', canOpenApp: true };
  return { kind: 'error', canOpenApp: false };
}

export function buildAppCallbackUrl(search = '', hash = '') {
  return `toki://auth-callback${search}${hash}`;
}

const copy = {
  confirmed: ['Your email is confirmed.', 'Your link is ready. Continue in Sylviae to finish.'],
  recovery: ['Password reset link ready.', 'Open Sylviae to continue resetting your password.'],
  ready: ['Your Sylviae link is ready.', 'Open Sylviae to finish this step.'],
  expired: ['This link has expired.', 'Request a new one in Sylviae, then open the fresh link from your email.'],
  error: ['We couldn’t complete this link.', 'Return to Sylviae and request a fresh link. If the problem continues, try opening the newest email.']
};

if (typeof window !== 'undefined') {
  const state = getCallbackState(window.location.search, window.location.hash);
  const [title, message] = copy[state.kind];
  document.getElementById('title').textContent = title;
  document.getElementById('message').textContent = message;

  const openApp = document.getElementById('open-app');
  if (state.canOpenApp) {
    openApp.href = buildAppCallbackUrl(window.location.search, window.location.hash);
    openApp.hidden = false;
  }

  if (state.kind === 'expired' || state.kind === 'error') {
    document.getElementById('hint').textContent = 'If Sylviae is unavailable or the link doesn’t open it, return to the app and request a fresh link.';
  }
}
