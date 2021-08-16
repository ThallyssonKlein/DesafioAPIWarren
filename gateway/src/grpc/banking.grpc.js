import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

export let bankingClient;

function loadService(protoFile) {
  const pkgDefinition = protoLoader.loadSync(protoFile, {
    keepCase: true,
    longs: String,
    enum: String,
    defaults: true,
    oneofs: true,
  });

  // Get the service definition
  const bankingService =
    grpc.loadPackageDefinition(pkgDefinition).me.thallysson.grpc.banking
      .Banking;

  //! Set a SSL credential
  bankingClient = new bankingService(
    process.env.BANKING_SERVICE_URI,
    grpc.credentials.createInsecure()
  );
}

export default {
  loadService,
};
