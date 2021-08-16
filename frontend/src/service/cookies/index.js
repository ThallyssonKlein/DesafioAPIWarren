/* eslint-disable import/prefer-default-export */
import cookieCutter from 'cookie-cutter';

export function saveAccessToken(token) {
  cookieCutter.set('x-access-token', token);
}

export function loadAccessToken() {
  return cookieCutter.get('x-access-token');
}

export function deleteAccessToken() {
  cookieCutter.set('x-access-token', false);
}
