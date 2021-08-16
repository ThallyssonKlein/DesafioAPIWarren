/* eslint-disable import/prefer-default-export */
import ApiObj from '../ApiObj';

export async function PostPay(amount, receiver, token) {
  const apiResponse = await ApiObj.post('/users/pay', {
    amount,
    receiver,
  }, {
    headers: {
      'x-access-token': token,
    },
  });

  return apiResponse;
}
