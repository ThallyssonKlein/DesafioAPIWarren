import jwt from 'jsonwebtoken';

function createToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, {
    algorithm: 'HS512',
    expiresIn: '1h',
  });
}

function unmarshal(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS512'],
    });

    return payload;
  } catch (err) {
    console.error({ err });
    return undefined;
  }
}

export default {
  createToken,
  unmarshal,
};
