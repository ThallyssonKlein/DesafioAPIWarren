import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

export let client;

function loadService(protoFile) {
  console.log(protoFile);
  const pkgDefinition = protoLoader.loadSync(protoFile, {
    keepCase: true,
    longs: String,
    enum: String,
    defaults: true,
    oneofs: true,
  });

  // Get the service definition
  const userService =
    grpc.loadPackageDefinition(pkgDefinition).me.thallysson.grpc.user.Users;

  //! Set a SSL credential
  client = new userService(
    process.env.USER_SERVICE_URI,
    grpc.credentials.createInsecure()
  );
}

export default {
  loadService,
};
