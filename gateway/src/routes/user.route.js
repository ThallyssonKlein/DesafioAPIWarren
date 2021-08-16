import { Router } from 'express';

import { client } from '../grpc/user.grpc.js';
import { bankingClient } from '../grpc/banking.grpc.js';

const router = Router();

router.post('/', (req, res) => {
  const userData = req.body;

  // Do integrity checks
  if (
    userData == undefined ||
    userData.name == undefined ||
    userData.email == undefined ||
    userData.cpf == undefined ||
    userData.password == undefined
  ) {
    return res.status(400).json({
      message: 'Invalid request body.',
    });
  }

  // Call the gRPC service
  client.Create(userData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (Object.keys(result).includes('error')) {
      return res.status(500).json({ error: result.error });
    } else {
      return res.status(201).json(result);
    }
  });
});

router.delete('/', (req, res) => {
  if (
    req.headers['x-access-token'] == undefined ||
    typeof req.headers['x-access-token'] != 'string'
  ) {
    return res.status(400).json({
      error: {
        message: 'Invalid access token.',
      },
    });
  }

  // Call the gRPC service
  client.Delete(
    {
      token: {
        data: req.headers['x-access-token'],
      },
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (Object.keys(result).includes('error')) {
        return res.status(500).json({ error: result.error });
      } else {
        return res.json(result);
      }
    }
  );
});

router.get('/', (req, res) => {
  if (
    req.headers['x-access-token'] == undefined ||
    typeof req.headers['x-access-token'] != 'string'
  ) {
    return res.status(400).json({
      error: {
        message: 'Invalid access token.',
      },
    });
  }

  client.Get(
    {
      token: {
        data: req.headers['x-access-token'],
      },
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (Object.keys(result).includes('error')) {
        return res.status(500).json({ error: result.error });
      } else {
        return res.json(result);
      }
    }
  );
});

///? Banking Section

router.get('/balance', (req, res) => {
  // Check if the authentication token is present
  if (
    req.headers['x-access-token'] == undefined ||
    typeof req.headers['x-access-token'] != 'string'
  ) {
    return res.status(400).json({
      error: {
        message: 'Invalid access token.',
      },
    });
  }

  bankingClient.GetBalance(
    {
      token: req.headers['x-access-token'],
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      if (Object.keys(result).includes('error')) {
        return res.status(500).json({ error: result.error });
      } else {
        return res.json(result);
      }
    }
  );
});

router.get('/history', (req, res) => {
  // Check if the authentication token is present
  if (
    req.headers['x-access-token'] == undefined ||
    typeof req.headers['x-access-token'] != 'string'
  ) {
    return res.status(400).json({
      error: {
        message: 'Invalid access token.',
      },
    });
  }

  bankingClient.GetHistory(
    {
      token: req.headers['x-access-token'],
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      if (Object.keys(result).includes('error')) {
        return res.status(500).json({ error: result.error });
      } else {
        return res.json({
          history: JSON.parse(result.history),
        });
      }
    }
  );
});

router.post('/deposit', (req, res) => {
  // Check if the authentication token is present
  if (
    req.headers['x-access-token'] == undefined ||
    typeof req.headers['x-access-token'] != 'string'
  ) {
    return res.status(400).json({
      error: {
        message: 'Invalid access token.',
      },
    });
  }

  // Check if the deposit value was provided in the request body
  if (req.body.amount == undefined || req.body.amount == 0) {
    return res.status(400).json({
      error: {
        message: "Invalid 'amount' of deposit!",
      },
    });
  }

  // Make the service call
  bankingClient.Deposit(
    {
      token: req.headers['x-access-token'],
      amount: req.body.amount,
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      if (Object.keys(result).includes('error')) {
        return res.status(500).json({ error: result.error });
      } else {
        return res.json(result);
      }
    }
  );
});

router.post('/withdraw', (req, res) => {
  // Check if the authentication token is present
  if (
    req.headers['x-access-token'] == undefined ||
    typeof req.headers['x-access-token'] != 'string'
  ) {
    return res.status(400).json({
      error: {
        message: 'Invalid access token.',
      },
    });
  }

  // Check if the withdraw value was provided in the request body
  if (req.body.amount == undefined || req.body.amount == 0) {
    return res.status(400).json({
      error: {
        message: "Invalid 'amount' of withdraw!",
      },
    });
  }

  bankingClient.Withdraw(
    {
      token: req.headers['x-access-token'],
      amount: req.body.amount,
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      if (Object.keys(result).includes('error')) {
        return res.status(500).json({ error: result.error });
      } else {
        return res.json(result);
      }
    }
  );
});

router.post('/pay', (req, res) => {
  // Check if the authentication token is present
  if (
    req.headers['x-access-token'] == undefined ||
    typeof req.headers['x-access-token'] != 'string'
  ) {
    return res.status(400).json({
      error: {
        message: 'Invalid access token.',
      },
    });
  }

  // Check if the withdraw value was provided in the request body
  if (req.body.amount == undefined || req.body.amount == 0) {
    return res.status(400).json({
      error: {
        message: "Invalid 'amount' of withdraw!",
      },
    });
  }

  // Check if the receiver field is not null
  if (req.body.receiver == undefined) {
    return res.status(400).json({
      error: {
        message: "Invalid 'receiver'!",
      },
    });
  }

  // Call the service
  bankingClient.Pay(
    {
      token: req.headers['x-access-token'],
      receiver: req.body.receiver,
      amount: req.body.amount,
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      if (Object.keys(result).includes('error')) {
        return res.status(500).json({ error: result.error });
      } else {
        return res.json(result);
      }
    }
  );
});

export default router;
