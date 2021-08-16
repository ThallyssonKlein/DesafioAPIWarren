/* eslint-disable import/prefer-default-export */
import { PostWidhdraw as PostRepository } from '../../repository/withdraw';
import { loadAccessToken } from '../cookies';
import { validateAmount } from '../../utils';

export async function PostWidhdraw(amount) {
  try {
    if (!validateAmount(amount)) {
      return false;
    }

    const repositoryResponse = await PostRepository(amount, loadAccessToken());

    return repositoryResponse.ok;
  } catch (err) {
    return false;
  }
}
