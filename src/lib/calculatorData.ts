export type ServiceType = "netflix" | "spotify" | "chatgpt" | "disney" | "office";
export type PlanType = "basic" | "standard" | "premium";
export type MembersType = 2 | 3 | 4 | 5;
export type DurationType = 1 | 6 | 12;

type ServicePrices = {
  [key in ServiceType]: {
    [key in PlanType]: number;
  };
};

export const servicePrices: ServicePrices = {
  netflix: {
    basic: 9900,
    standard: 13500,
    premium: 17000
  },
  spotify: {
    basic: 10900,
    standard: 10900,
    premium: 16900
  },
  chatgpt: {
    basic: 20000,
    standard: 20000,
    premium: 20000
  },
  disney: {
    basic: 9900,
    standard: 9900,
    premium: 13900
  },
  office: {
    basic: 11900,
    standard: 16900,
    premium: 22900
  }
};
