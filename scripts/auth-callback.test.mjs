import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAppCallbackUrl, getCallbackState, shouldAutoOpenApp } from '../src/auth-callback.js';

test('recognizes a verified signup return and keeps its callback payload for Sylviae', () => {
  const search = '?flow=signup&code=a%2Fb%2Bc';
  const state = getCallbackState(search);

  assert.deepEqual(state, { kind: 'confirmed', canOpenApp: true });
  assert.equal(buildAppCallbackUrl(search), `toki://auth-callback${search}`);
});

test('does not say confirmed for an unverified email token', () => {
  assert.deepEqual(getCallbackState('?token_hash=opaque&type=email'), {
    kind: 'ready',
    canOpenApp: true
  });
});

test('does not say confirmed when a signup verification fails', () => {
  assert.deepEqual(getCallbackState('?flow=signup&error_code=otp_expired'), {
    kind: 'expired',
    canOpenApp: false
  });
  assert.deepEqual(getCallbackState('?flow=signup'), {
    kind: 'error',
    canOpenApp: false
  });
});

test('recognizes a password recovery link', () => {
  assert.deepEqual(getCallbackState('?token_hash=opaque&type=recovery'), {
    kind: 'recovery',
    canOpenApp: true
  });
});

test('recognizes expired links without exposing the provider error', () => {
  assert.deepEqual(getCallbackState('?error=access_denied&error_code=otp_expired&error_description=Link+expired'), {
    kind: 'expired',
    canOpenApp: false
  });
});

test('shows a generic error for other callback errors and offers no app link', () => {
  assert.deepEqual(getCallbackState('?error=server_error&error_description=Sensitive+provider+detail'), {
    kind: 'error',
    canOpenApp: false
  });
});

test('preserves the callback query and fragment verbatim in the app link', () => {
  const search = '?code=a%2Fb&state=x+y';
  const hash = '#access_token=one%2Ftwo&refresh_token=three';
  assert.equal(buildAppCallbackUrl(search, hash), `toki://auth-callback${search}${hash}`);
  assert.deepEqual(getCallbackState(search, hash), { kind: 'ready', canOpenApp: true });
});

test('only the untyped Google PKCE callback attempts to open Sylviae automatically', () => {
  assert.equal(shouldAutoOpenApp('?code=opaque'), true);
  assert.equal(shouldAutoOpenApp('', '#code=opaque'), true);
  assert.equal(shouldAutoOpenApp('?code=opaque&type=recovery'), false);
  assert.equal(shouldAutoOpenApp('?code=opaque&type=email'), false);
  assert.equal(shouldAutoOpenApp('?token_hash=opaque&type=recovery'), false);
  assert.equal(shouldAutoOpenApp('?error=access_denied&code=opaque'), false);
  assert.equal(shouldAutoOpenApp('?access_token=one&refresh_token=two'), false);
});

test('attempts the Google app handoff while keeping its manual button available', async () => {
  const elements = Object.fromEntries(['title', 'message', 'open-app', 'hint'].map((id) => [id, {}]));
  const opened = [];
  globalThis.window = {
    location: {
      search: '?code=opaque',
      hash: '',
      assign(url) { opened.push(url); }
    }
  };
  globalThis.document = { getElementById(id) { return elements[id]; } };

  try {
    await import('../src/auth-callback.js?google-handoff');
    assert.deepEqual(opened, ['toki://auth-callback?code=opaque']);
    assert.equal(elements['open-app'].href, opened[0]);
    assert.equal(elements['open-app'].hidden, false);
  } finally {
    delete globalThis.window;
    delete globalThis.document;
  }
});
