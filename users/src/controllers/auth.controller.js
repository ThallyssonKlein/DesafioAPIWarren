import bcrypt from 'bcrypt';
import jwt from '../util/jwt.util.js';

import { client } from '../services/mariadb.js';

async function loginUser(req, cb) {
  const loginData = req.request;
  let conn;

  try {
    conn = await client.getConnection();

    // Try selecting the user by the provided email
    const result = await conn.query(
      `SELECT \`id\`,\`password\` FROM \`warren_bank\`.\`users\` WHERE email='${loginData.email}';`
    );

    // If the result item 0 is undefined then no matches were found
    if (result[0] == undefined) {
      return cb(null, {
        token: { data: '' },
        error: {
          message: 'Invalid login information!',
        },
      });
    }

    // Check if the password matches
    let pwdMatches = bcrypt.compareSync(loginData.password, result[0].password);

    if (pwdMatches) {
      // Return the token to the caller
      return cb(null, {
        token: {
          data: jwt.createToken({ id: result[0].id }),
        },
      });
    } else {
      return cb(null, {
        token: { data: '' },
        error: {
          message: 'Invalid login information!',
        },
      });
    }
  } catch (err) {
    return cb(null, {
      token: { data: '' },
      error: {
        message: err.text,
      },
    });
  } finally {
    if (conn) conn.end();
  }
}

export default {
  loginUser,
};
