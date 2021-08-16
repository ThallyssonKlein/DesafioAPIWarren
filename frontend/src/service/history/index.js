/* eslint-disable import/prefer-default-export */
import { GetHistory as GetRepository } from '../../repository/history';
import { loadAccessToken } from '../cookies';

export async function GetHistory() {
  try {
    const repositoryResponse = await GetRepository(loadAccessToken());

    return repositoryResponse.data.history;
  } catch (err) {
    return false;
  }
}
