/* eslint-disable import/prefer-default-export */
import { Login as LoginRepository } from '../../repository/auth';
import { saveAccessToken } from '../cookies';
import { isEmpty, validateEmail } from '../../utils';

export async function Login(email, password) {
  if (isEmpty(email) || isEmpty(password)) {
    if (!validateEmail(email)) {
      alert('Formato de email inválido');
    } else {
      alert('Email ou senha não podem ser nulos');
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
