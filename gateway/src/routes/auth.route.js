import { Router } from 'express';

import { client } from '../grpc/auth.grpc.js';

const router = Router();

router.post('/login', (req, res) => {
  const loginData = req.body;

  if (
    loginData == undefined ||
    loginData.email == undefined ||
    loginData.password == undefined
  ) {
    return res.status(400).json({
      message: 'Invalid request body,',
    });
  }

  client.Login(loginData, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }

    if (Object.keys(result).includes('error')) {
      return res.status(500).json({
        error: result.error,
      });
    } else {
      res.setHeader('x-access-token', result.token.data).json({
        message: 'Logged in!',
      });
    }
  });
});

export default router;
