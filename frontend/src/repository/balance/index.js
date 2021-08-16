/* eslint-disable import/prefer-default-export */
import ApiObj from '../ApiObj';

export async function GetBalance(token) {
  const apiResponse = await ApiObj.get('/users/balance', null, {
    headers: {
      'x-access-token': token,
    },
  });

  return apiResponse;
}
