export const formatCycle = (cycle: string): string => {
  switch (cycle) {
    case "MONTHLY":
      return "Monthly";
    case "YEARLY":
      return "Annually";
    case "QUARTERLY":
      return "Quarterly";
    case "WEEKLY":
      return "Weekly";
    default:
      return cycle;
  }
}; 