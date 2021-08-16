/* eslint-disable import/prefer-default-export */
import ApiObj from '../ApiObj';

export async function GetHistory(token) {
  const apiResponse = await ApiObj.get('/users/history', null, {
    headers: {
      'x-access-token': token,
    },
  });

  return apiResponse;
}
