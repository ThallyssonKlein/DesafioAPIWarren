const DAY_MS_FACTOR = 1000 * 60 * 60 * 24;

function calculateBalanceBasedOnTax(actualBalance, taxRate, lastTaxUpdate) {
  const currentDay = Math.floor(Date.now() / DAY_MS_FACTOR);
  const lastUpdateDay = Math.floor(lastTaxUpdate / DAY_MS_FACTOR);

  const timeDifference = currentDay - lastUpdateDay;
  let newBalance = actualBalance;

  if (timeDifference == 0) {
    return actualBalance;
  } else {
    for (let i = 0; i < timeDifference; i++) {
      newBalance += newBalance * taxRate;
    }

    return newBalance;
  }
}

export default {
  calculateBalanceBasedOnTax,
};
