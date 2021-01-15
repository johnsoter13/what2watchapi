import mongoose from 'mongoose';

export default () => {
  mongoose.Promise = global.Promise;
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.connect('mongodb://localhost/what2watchapi');

  mongoose.connection
    .once('open', () => console.log('Mongodb running'))
    .on('error', (err) => console.log(err));
};
