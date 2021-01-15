import mongoose, { Schema } from 'mongoose';

const What2WatchSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model('What2Watch', What2WatchSchema);
