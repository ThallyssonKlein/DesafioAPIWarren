/* eslint-disable import/prefer-default-export */
import ApiObj from '../ApiObj';

export async function PostDeposit(amount, token) {
  const apiResponse = await ApiObj.post('/users/deposit', {
    amount,
  }, {
    headers: {
      'x-access-token': token,
    },
  });

  return apiResponse;
}
