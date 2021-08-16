import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import spdy from 'spdy';
import cors from 'cors';

import fs from 'fs';

// Import gRPC services
import usersGRPC from './grpc/user.grpc.js';
import authGRPC from './grpc/auth.grpc.js';
import bankingGrpc from './grpc/banking.grpc.js';

// Import routes
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';

// Load environment variables if on development
if (process.env.NODE_ENV == 'development') dotenv.config();

const USERS_PROTOBUF_FILE = new String(process.env.PROTOBUF_SRCDIR).concat(
  '/user.proto'
);

const AUTH_PROTOBUF_FILE = new String(process.env.PROTOBUF_SRCDIR).concat(
  '/auth.proto'
);

const BANKING_PROTOBUF_FILE = new String(process.env.PROTOBUF_SRCDIR).concat(
  '/banking.proto'
);

// Load gRPC services
usersGRPC.loadService(USERS_PROTOBUF_FILE);
authGRPC.loadService(AUTH_PROTOBUF_FILE);
bankingGrpc.loadService(BANKING_PROTOBUF_FILE);

// Configure Express
const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    exposedHeaders: ['x-access-token'],
  })
);

// Set up the routes
app.use('/users', userRoute);
app.use('/auth', authRoute);

// Status route
app.get('/status', (req, res) => {
  return res.json({ req: req.headers });
});

// Configure SPDY
const spdyOptions = {
  key: fs.readFileSync(`${process.env.DATA_DIR}/tls.key`),
  cert: fs.readFileSync(`${process.env.DATA_DIR}/tls.crt`),
  spdy: {
    protocols: ['h2'],
  },
};

// Initialize SPDY server
// if (process.env.NODE_ENV == 'development') {
//   app.listen(
//     process.env.GATEWAY_SERVICE_PORT,
//     process.env.GATEWAY_SERVICE_HOST,
//     10000,
//     () => {
//       console.log(
//         `Started the Gateway Service at port and host ${process.env.GATEWAY_SERVICE_HOST}:${process.env.GATEWAY_SERVICE_PORT}!`
//       );
//     }
//   );
// } else {
//   spdy
//     .createServer(spdyOptions, app)
//     .listen(
//       process.env.GATEWAY_SERVICE_PORT,
//       process.env.GATEWAY_SERVICE_HOST,
//       10000,
//       () => {
//         console.log(
//           `Started the Gateway Service at port and host ${process.env.GATEWAY_SERVICE_HOST}:${process.env.GATEWAY_SERVICE_PORT}!`
//         );
//       }
//     );
// }

app.listen(
  process.env.GATEWAY_SERVICE_PORT,
  process.env.GATEWAY_SERVICE_HOST,
  10000,
  () => {
    console.log(
      `Started the Gateway Service at port and host ${process.env.GATEWAY_SERVICE_HOST}:${process.env.GATEWAY_SERVICE_PORT}!`
    );
  }
);
