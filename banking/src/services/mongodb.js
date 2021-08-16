import mongoose from 'mongoose';

let client = undefined;

function mongodbConnect(mongodbURI) {
  mongoose.connect(mongodbURI, {
    useCreateIndex: true,
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });

  client = mongoose.connection;

  client.on('error', console.error.bind(console, 'MongoDB ERR >>'));
  client.once('open', () => {
    console.log(`MongoDB Connection successful.`);
  });
}

export default {
  mongodbConnect,
  client,
};
