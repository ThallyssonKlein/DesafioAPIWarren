import user from '../models/user.model.js';
import { client } from '../grpc/user.grpc.js';

import taxUtil from '../util/tax.util.js';

function getBalance(req, cb) {
  client.DecodeToken(
    {
      token: req.request.token,
    },
    (err, result) => {
      if (err) {
        return cb(null, {
          balance: 0,
          error: err,
        });
      }

      if (Object.keys(result).includes('error')) {
        return cb(null, {
          message: '',
          error: result.error,
        });
      } else {
        // Check the token
        if (
          req.request.token == undefined ||
          req.request.token == 'undefined'
        ) {
          return cb(null, {
            message: '',
            error: {
              message: 'Invalid authentication token!',
            },
          });
        }

        user.userModel.findById(result.id, (err, doc) => {
          if (err) {
            return cb(null, {
              balance: 0,
              error: err,
            });
          }

          // Calculate the new tax first
          doc.balance = taxUtil.calculateBalanceBasedOnTax(
            doc.balance,
            doc.contracted_tax,
            doc.last_tax_update
          );

          // Update the last tax updat
          doc.last_tax_update = Date.now();

          // Then return the balance to the user after saving.
          doc
            .save()
            .then((_) => {
              return cb(null, {
                balance: doc.balance,
              });
            })
            .catch((err) => {
              return cb(null, {
                message: '',
                error: {
                  message: JSON.stringify(err),
                },
              });
            });
        });
      }
    }
  );
}

function deposit(req, cb) {
  client.DecodeToken(
    {
      token: req.request.token,
    },
    (err, result) => {
      if (err) {
        return cb(null, {
          message: '',
          error: err,
        });
      }

      if (Object.keys(result).includes('error')) {
        return cb(null, {
          message: '',
          error: result.error,
        });
      } else {
        // Check the token
        if (
          req.request.token == undefined ||
          req.request.token == 'undefined'
        ) {
          return cb(null, {
            message: '',
            error: {
              message: 'Invalid authentication token!',
            },
          });
        }

        const userID = result.id;

        // Search the user to update it's tax first
        user.userModel.findById(userID, (err, doc) => {
          if (err) {
            return cb(null, {
              message: '',
              error: {
                message: err,
              },
            });
          }

          // Calculate the new tax first
          doc.balance = taxUtil.calculateBalanceBasedOnTax(
            doc.balance,
            doc.contracted_tax,
            doc.last_tax_update
          );

          // Then add the deposit and update the last tax update
          doc.balance += Number.parseFloat(req.request.amount);
          doc.last_tax_update = Date.now();

          // Add this operation to the banking history
          doc.banking_history.push({
            operation: 'deposit',
            date: Date.now(),
            amount: req.request.amount,
          });

          // Then save the document
          doc
            .save()
            .then((_) => {
              return cb(null, {
                message: 'Success!',
              });
            })
            .catch((err) => {
              return cb(null, {
                message: '',
                error: {
                  message: JSON.stringify(err),
                },
              });
            });
        });
      }
    }
  );
}

function withdraw(req, cb) {
  client.DecodeToken(
    {
      token: req.request.token,
    },
    (err, result) => {
      if (err) {
        console.log({ err });
        return cb(null, {
          message: '',
          error: err,
        });
      }

      if (Object.keys(result).includes('error')) {
        return cb(null, {
          message: '',
          error: result.error,
        });
      } else {
        user.userModel.findById(result.id, (err, doc) => {
          if (err) {
            return cb(null, {
              balance: 0,
              error: err,
            });
          }

          // Calculate the new tax first
          doc.balance = taxUtil.calculateBalanceBasedOnTax(
            doc.balance,
            doc.contracted_tax,
            doc.last_tax_update
          );

          // Update the last tax update
          doc.last_tax_update = Date.now();

          let resultingBalance = doc.balance - req.request.amount;
          if (resultingBalance < 0) {
            return cb(null, {
              message: '',
              error: {
                message: 'Not enough balance for this operation!',
              },
            });
          }

          // Set the balance of the account
          doc.balance = resultingBalance;

          // Add this operation to the banking history
          doc.banking_history.push({
            operation: 'withdraw',
            date: Date.now(),
            amount: req.request.amount,
          });

          // Then return after saving.
          doc
            .save()
            .then((_) => {
              return cb(null, {
                message: 'Success!',
              });
            })
            .catch((err) => {
              return cb(null, {
                message: '',
                error: {
                  message: JSON.stringify(err),
                },
              });
            });
        });
      }
    }
  );
}

function pay(req, cb) {
  client.DecodeToken(
    {
      token: req.request.token,
    },
    (err, result) => {
      if (err) {
        return cb(null, {
          message: '',
          error: {
            message: err,
          },
        });
      }

      if (Object.keys(result).includes('error')) {
        return cb(null, {
          message: '',
          error: result.error,
        });
      } else {
        // Check the token
        if (
          req.request.token == undefined ||
          req.request.token == 'undefined'
        ) {
          return cb(null, {
            message: '',
            error: {
              message: 'Invalid authentication token!',
            },
          });
        }

        user.userModel.findById(result.id, (err, doc) => {
          if (err) {
            return cb(null, {
              message: '',
              error: {
                message: err,
              },
            });
          }

          // Calculate the new tax first
          doc.balance = taxUtil.calculateBalanceBasedOnTax(
            doc.balance,
            doc.contracted_tax,
            doc.last_tax_update
          );

          // Update the last tax update
          doc.last_tax_update = Date.now();

          let resultingBalance = doc.balance - req.request.amount;
          if (resultingBalance < 0) {
            return cb(null, {
              message: '',
              error: {
                message: 'Not enough balance for this operation!',
              },
            });
          }

          // Set the balance of the account
          doc.balance = resultingBalance;

          console.log(doc.balance);
          console.log(resultingBalance);
          console.log(req.request.amount);

          // Add this operation to the banking history
          doc.banking_history.push({
            operation: 'payment',
            date: Date.now(),
            receiver: req.request.receiver,
            amount: req.request.amount,
          });

          // Then return after saving.
          doc
            .save()
            .then((_) => {
              return cb(null, {
                message: 'Success!',
              });
            })
            .catch((err) => {
              return cb(null, {
                message: '',
                error: {
                  message: JSON.stringify(err),
                },
              });
            });
        });
      }
    }
  );
}

function getHistory(req, cb) {
  client.DecodeToken(
    {
      token: req.request.token,
    },
    (err, result) => {
      if (err) {
        return cb(null, {
          message: '',
          error: {
            message: err,
          },
        });
      }

      if (Object.keys(result).includes('error')) {
        return cb(null, {
          message: '',
          error: result.error,
        });
      } else {
        // Check the token
        if (
          req.request.token == undefined ||
          req.request.token == 'undefined'
        ) {
          return cb(null, {
            message: '',
            error: {
              message: 'Invalid authentication token!',
            },
          });
        }

        if (Object.keys(result).includes('error')) {
          return cb(null, {
            message: '',
            error: result.error,
          });
        } else {
          user.userModel.findById(result.id, (err, doc) => {
            if (err) {
              return cb(null, {
                history: '',
                error: err,
              });
            }

            return cb(null, {
              history: JSON.stringify(doc.banking_history),
            });
          });
        }
      }
    }
  );
}

export default {
  getBalance,
  deposit,
  withdraw,
  pay,
  getHistory,
};
