import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAppCallbackUrl, getCallbackState } from '../src/auth-callback.js';

test('recognizes successful email confirmation and keeps its callback payload for Sylviae', () => {
  const search = '?token_hash=a%2Fb%2Bc&type=email';
  const state = getCallbackState(search);

  assert.deepEqual(state, { kind: 'confirmed', canOpenApp: true });
  assert.equal(buildAppCallbackUrl(search), `toki://auth-callback${search}`);
});

test('recognizes a password recovery link', () => {
  assert.deepEqual(getCallbackState('?token_hash=opaque&type=recovery'), {
    kind: 'recovery',
    canOpenApp: true
  });
});

test('recognizes a verified PKCE recovery redirect without claiming the password changed', () => {
  assert.deepEqual(getCallbackState('?flow=recovery&code=one-time-code'), {
    kind: 'recovery',
    canOpenApp: true
  });
  assert.deepEqual(getCallbackState('?flow=recovery'), { kind: 'error', canOpenApp: false });
  assert.deepEqual(getCallbackState('?flow=recovery&error_code=otp_expired'), { kind: 'expired', canOpenApp: false });
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
