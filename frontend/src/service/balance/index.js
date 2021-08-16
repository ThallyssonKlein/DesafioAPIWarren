/* eslint-disable import/prefer-default-export */
import { GetBalance as GetRepository } from '../../repository/balance';
import { loadAccessToken } from '../cookies';

export async function GetBalance() {
  try {
    const repositoryResponse = await GetRepository(loadAccessToken());

    return repositoryResponse.data;
  } catch (err) {
    return false;
  }
}
