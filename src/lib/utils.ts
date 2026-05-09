export const CONVERSION_RATES = {
  USD: 1,
  PKR: 280,
  CAD: 1.35,
  GBP: 0.79,
};

export const COUNTRY_TO_CURRENCY: Record<string, { symbol: string, rate: number }> = {
  "Pakistan": { symbol: "Rs.", rate: 280 },
  "US": { symbol: "$", rate: 1 },
  "CA": { symbol: "C$", rate: 1.35 },
  "UK": { symbol: "£", rate: 0.79 },
};

export function formatPrice(price: number, country: string = "US") {
  const config = COUNTRY_TO_CURRENCY[country] || COUNTRY_TO_CURRENCY["US"];
  const formatted = (price * config.rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${config.symbol} ${formatted}`;
}
