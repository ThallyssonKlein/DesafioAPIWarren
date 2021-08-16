/* eslint-disable import/prefer-default-export */
import { PostDeposit as PostRepository } from '../../repository/deposit';
import { loadAccessToken } from '../cookies';
import { validateAmount } from '../../utils';

export async function PostDeposit(amount) {
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
