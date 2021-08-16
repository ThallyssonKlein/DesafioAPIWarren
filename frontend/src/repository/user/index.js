/* eslint-disable import/prefer-default-export */
import ApiObj from '../ApiObj';

export async function PostUser(name, email, cpf, password) {
  const apiResponse = await ApiObj.post('/users', {
    name,
    email,
    cpf,
    password,
  });

  return apiResponse;
}
