import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  balance: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
  last_tax_update: {
    type: mongoose.SchemaTypes.Number,
  },
  contracted_tax: {
    type: mongoose.SchemaTypes.Number,
    default: 0.5,
  },
  banking_history: {
    type: [mongoose.SchemaTypes.Map],
    default: [],
  },
});

const userModel = mongoose.model('User', userSchema);

export default {
  userSchema,
  userModel,
};
