/* eslint-disable import/prefer-default-export */
import ApiObj from '../ApiObj';

export async function Login(email, password) {
  const apiResponse = await ApiObj.post('/auth/login', {
    email,
    password,
  });

  return apiResponse;
}
