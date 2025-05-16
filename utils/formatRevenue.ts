export default function formatRevenue(amount: number| undefined): string {
  if(amount === 0 || amount === undefined) {
    return "N/A"
  } 
  else if (amount >= 1_000_000) {
    return `$${Math.round(amount / 1_000_000)} million`;
  } 
  else {
    return `$${amount}`;
  }
}
