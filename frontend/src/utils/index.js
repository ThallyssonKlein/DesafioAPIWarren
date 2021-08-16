export function validateAmount(amount) {
  return Number.isInteger(Number(amount)) && amount > 0;
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isEmpty(value) {
  return value === '';
}

export function validateUserInformation(name, email, cpf, password) {
  if ((!name || name === '') || (!cpf || cpf === '') || (!password || password === '')) {
    return false;
  }

  if (!validateEmail(email)) {
    return false;
  }

  return true;
}
