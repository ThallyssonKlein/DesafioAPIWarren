/* eslint-disable import/prefer-default-export */
import { Login as LoginRepository } from '../../repository/auth';
import { saveAccessToken } from '../cookies';
import { isEmpty, validateEmail } from '../../utils';

export async function Login(email, password) {
  if (isEmpty(email) || isEmpty(password)) {
    if (!validateEmail(email)) {
      alert('Invalid email format');
    } else {
      alert('Email or password cannot be empty');
    }
    return false;
  }

  const repositoryResponse = await LoginRepository(email, password);

  try {
    if (repositoryResponse.ok && repositoryResponse.headers['x-access-token']) {
      saveAccessToken(repositoryResponse.headers['x-access-token']);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
