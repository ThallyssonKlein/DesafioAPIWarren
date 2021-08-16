import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import mongodb from './services/mongodb.js';

import userGrpc from './grpc/user.grpc.js';

import bankingController from './controllers/banking.controller.js';

// If on development load environment variables using dotenv
if (process.env.NODE_ENV == 'development') dotenv.config();

const BANKING_PROTOBUF_FILE = new String(process.env.PROTOBUF_SRCDIR).concat(
  '/banking.proto'
);

const USERS_PROTOBUF_FILE = new String(process.env.PROTOBUF_SRCDIR).concat(
  '/user.proto'
);

// Connect to external services
userGrpc.loadService(USERS_PROTOBUF_FILE);

// Connect to the database
mongodb.mongodbConnect(process.env.MONGODB_URI);

// Create the gRPC server
const server = new grpc.Server();

// Get the package definition
const bankingPkgDefinition = protoLoader.loadSync(BANKING_PROTOBUF_FILE, {
  keepCase: true,
  longs: String,
  enum: String,
  defaults: true,
  oneofs: true,
});

// Get the services objects
const bankingService =
  grpc.loadPackageDefinition(bankingPkgDefinition).me.thallysson.grpc.banking
    .Banking.service;

// Add services to the server
server.addService(bankingService, {
  Deposit: bankingController.deposit,
  GetBalance: bankingController.getBalance,
  Withdraw: bankingController.withdraw,
  Pay: bankingController.pay,
  GetHistory: bankingController.getHistory,
});

// Start this server
server.bindAsync(
  process.env.BANKING_SERVICE_URI,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error({ err });
      return;
    }

    console.log(`gRPC Service started at port: ${port}.`);
    server.start();
  }
);
