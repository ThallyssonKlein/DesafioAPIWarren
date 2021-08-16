/* eslint-disable import/prefer-default-export */
import { PostPay as PostRepository } from '../../repository/pay';
import { loadAccessToken } from '../cookies';
import { validateAmount, isEmpty } from '../../utils';

export async function PostPay(amount, receiver) {
  try {
    if (!validateAmount(amount) && !isEmpty(receiver)) {
      return false;
    }

    const repositoryResponse = await PostRepository(amount, receiver, loadAccessToken());

    return repositoryResponse.ok;
  } catch (err) {
    return false;
  }
}
