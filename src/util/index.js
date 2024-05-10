export function formatDecimal(number, decimals) {
  const moneyFormatter = new Intl.NumberFormat('sl-SI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals
  });
  return moneyFormatter.format(number);
}