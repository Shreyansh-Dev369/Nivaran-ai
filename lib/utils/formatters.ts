/**
 * Currency and Financial Formatters for Indian Equities & INR
 */

// Format numbers in Indian numbering format: e.g., 1,50,000 or 1,25,00,000
export function formatINR(
  amount: number,
  options?: {
    showPaise?: boolean;
    compact?: boolean;
    signDisplay?: boolean;
  }
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0";
  }

  const { showPaise = false, compact = false, signDisplay = false } = options || {};

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : signDisplay && amount > 0 ? "+" : "";

  if (compact) {
    if (absAmount >= 10000000) {
      // Crores
      return `${sign}₹${(absAmount / 10000000).toFixed(2)} Cr`;
    }
    if (absAmount >= 100000) {
      // Lakhs
      return `${sign}₹${(absAmount / 100000).toFixed(2)} L`;
    }
    // For values under 1 Lakh, use clean Indian number grouping (e.g. ₹25,000) rather than American 'k'
  }

  const parts = absAmount.toFixed(showPaise ? 2 : 0).split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : "";

  // Indian numbering: last 3 digits, then groups of 2
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }

  return `${sign}₹${integerPart}${decimalPart}`;
}

export function formatPercent(
  value: number,
  options?: { includeSign?: boolean; decimals?: number }
): string {
  const { includeSign = true, decimals = 2 } = options || {};
  if (isNaN(value)) return "0.00%";
  const sign = includeSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatMarketCapCr(crores: number): string {
  if (isNaN(crores) || crores === null || crores === undefined) return "₹0 Cr";
  if (crores >= 100000) {
    return `₹${(crores / 100000).toFixed(2)} L Cr`;
  }
  return `₹${crores.toLocaleString("en-IN")} Cr`;
}

export function formatDate(dateStr: string, options?: { showTime?: boolean }): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    if (options?.showTime) {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
    }

    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

// Decimal-safe paise utilities
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function fromPaise(paise: number): number {
  return paise / 100;
}
