/* eslint-disable import/prefer-default-export */
import ApiObj from '../ApiObj';

export async function PostWidhdraw(amount, token) {
  const apiResponse = await ApiObj.post('/users/withdraw', {
    amount,
  }, {
    headers: {
      'x-access-token': token,
    },
  });

  return apiResponse;
}
