import dotenv from 'dotenv';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

// Import the controllers
import userController from './controllers/user.controller.js';
import authController from './controllers/auth.controller.js';

// Import external services
import mariadb from './services/mariadb.js';
import mongodb from './services/mongodb.js';

// If on development load environment variables using dotenv
if (process.env.NODE_ENV == 'development') dotenv.config();

const USERS_PROTOBUF_FILE = new String(process.env.PROTOBUF_SRCDIR).concat(
  '/user.proto'
);

const AUTH_PROTOBUF_FILE = new String(process.env.PROTOBUF_SRCDIR).concat(
  '/auth.proto'
);

// Connect to external services
mariadb.mariadbConnect(
  process.env.MARIADB_HOST,
  process.env.MARIADB_PORT,
  process.env.MARIADB_USERNAME,
  process.env.MARIADB_PWD
);

mongodb.mongodbConnect(process.env.MONGODB_URI);

// Create the gRPC server
const server = new grpc.Server();

// Get the package definition
const usrPkgDefinition = protoLoader.loadSync(USERS_PROTOBUF_FILE, {
  keepCase: true,
  longs: String,
  enum: String,
  defaults: true,
  oneofs: true,
});

const authPkgDefinition = protoLoader.loadSync(AUTH_PROTOBUF_FILE, {
  keepCase: true,
  longs: String,
  enum: String,
  defaults: true,
  oneofs: true,
});

// Get the services objects
const userService =
  grpc.loadPackageDefinition(usrPkgDefinition).me.thallysson.grpc.user.Users
    .service;

const authService =
  grpc.loadPackageDefinition(authPkgDefinition).me.thallysson.grpc.auth.Auth
    .service;

// Add services to the server
server.addService(userService, {
  Create: userController.createUser,
  Delete: userController.deleteUser,
  Get: userController.getUser,
  DecodeToken: userController.decodeToken,
});

server.addService(authService, {
  Login: authController.loginUser,
});

// Start this server
server.bindAsync(
  process.env.USER_SERVICE_URI,
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
