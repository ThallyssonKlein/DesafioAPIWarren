import mariadb from 'mariadb';

export let client = undefined;

function mariadbConnect(
  mariadbHost,
  mariadbPort,
  mariadbUsername,
  mariadbPassword
) {
  client = mariadb.createPool({
    host: mariadbHost,
    port: mariadbPort,
    user: mariadbUsername,
    password: mariadbPassword,
    connectionLimit: 16,
  });
}

export default {
  mariadbConnect,
};
