import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { client } from '../services/mariadb.js';

import user from '../models/user.model.js';

import jwt from '../util/jwt.util.js';

async function createUser(req, cb) {
  const request = req.request;
  let conn;
  let docID;

  try {
    conn = await client.getConnection();

    // Generate a new random document id
    docID = new mongoose.Types.ObjectId();

    // Hash the password with bcrypt
    let password = bcrypt.hashSync(request.password, 10);

    // Try insert new entry on MariaDB
    await conn.query(
      'INSERT INTO `warren_bank`.`users` (`id`, `name`, `email`, `cpf`, `password`) VALUES (?,?,?,?,?);',
      [docID.toHexString(), request.name, request.email, request.cpf, password]
    );

    // If the code reach here then we are safe to create a mongo document too
    await user.userModel.create({ _id: docID, last_tax_update: Date.now() });

    // Then return the user id to the caller
    cb(null, {
      id: docID,
    });
  } catch (err) {
    cb(null, {
      id: '',
      error: {
        message: err.text,
      },
    });
  } finally {
    if (conn) conn.end();
  }
}

async function deleteUser(req, cb) {
  const token = jwt.unmarshal(req.request.token.data);
  let conn;

  try {
    conn = await client.getConnection();

    // Try delete the user from the main database
    const result = await conn.query(
      `DELETE FROM \`warren_bank\`.\`users\` WHERE id='${token.id}';`
    );

    // If the row was affected then delete the mongodb document too
    if (result.affectedRows == 1) {
      user.userModel.findByIdAndDelete(token.id, (err) => {
        if (err) {
          return cb(null, {
            message: '',
            error: {
              message: err,
            },
          });
        }

        return cb(null, {
          message: 'Object deleted!',
        });
      });
    } else {
      cb(null, {
        message: '',
        error: {
          message: 'Unable to delete this object.',
        },
      });
    }
  } catch (err) {
    cb(null, {
      message: '',
      error: {
        message: err.text,
      },
    });
  } finally {
    if (conn) conn.end();
  }
}

async function getUser(req, cb) {
  const token = jwt.unmarshal(req.request.token.data);
  if (token == undefined) {
    return cb(null, {
      user: {
        name: '',
        email: '',
        password: '',
      },
      error: {
        message: 'Invalid session token!',
      },
    });
  }
  let conn;

  try {
    conn = await client.getConnection();

    const result = await conn.query(
      `SELECT \`name\`,\`email\`,\`cpf\` FROM \`warren_bank\`.\`users\` WHERE id='${token.id}';`
    );

    const user = result[0];
    if (user == undefined) {
      return cb(null, {
        user: {
          name: '',
          email: '',
          password: '',
        },
        error: {
          message: 'Invalid user ID!',
        },
      });
    }

    return cb(null, {
      user,
    });
  } catch (err) {
    return cb(null, {
      user: {
        name: '',
        email: '',
        password: '',
      },
      error: {
        message: err.text,
      },
    });
  } finally {
    if (conn) conn.end();
  }
}

function decodeToken(req, cb) {
  const token = req.request.token;

  try {
    const decodedToken = jwt.unmarshal(token);

    if (decodedToken == undefined) {
      return cb(null, {
        id: '',
        error: {
          message: 'Invalid or expired token!',
        },
      });
    } else {
      return cb(null, {
        id: decodedToken.id,
      });
    }
  } catch (err) {
    return cb(null, {
      id: '',
      error: {
        message: 'Unmarshling error!',
        cause: err,
      },
    });
  }
}

export default {
  createUser,
  deleteUser,
  getUser,
  decodeToken,
};
