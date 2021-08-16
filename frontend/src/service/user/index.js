/* eslint-disable import/prefer-default-export */
import { PostUser as PostRepository } from '../../repository/user';
import { validateUserInformation } from '../../utils';

export async function PostUser(name, email, cpf, password) {
  try {
    if (!validateUserInformation(name, email, `${cpf}`, password)) {
      return false;
    }

    const repositoryResponse = await PostRepository(name, email, `${cpf}`, password);

    return repositoryResponse.ok;
  } catch (err) {
    return false;
  }
}
