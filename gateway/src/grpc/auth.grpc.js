import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

export let client;

function loadService(protoFile) {
  const pkgDefinition = protoLoader.loadSync(protoFile, {
    keepCase: true,
    longs: String,
    enum: String,
    defaults: true,
    oneofs: true,
  });

  // Get the service definition
  const authService =
    grpc.loadPackageDefinition(pkgDefinition).me.thallysson.grpc.auth.Auth;

  //! Set a SSL credential
  client = new authService(
    process.env.AUTH_SERVICE_URI,
    grpc.credentials.createInsecure()
  );
}

export default {
  loadService,
};
