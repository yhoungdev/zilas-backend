import { ENUM_RANKS } from "../enums";

const RANKS = ENUM_RANKS;
const checkUserAndReturnProfit = (rank: ENUM_RANKS) => {
  switch (rank) {
    case RANKS.VIP1:
      return 0.5;
    case RANKS.VIP2:
      return 1;
    case RANKS.VIP3:
      return 1.5;
    case RANKS.VIP4:
      return 2;
    default:
      return 0;
  }
};

interface IProfit {
  rank: any;
  price: number;
}

export const calculateProfit = ({ rank, price }: IProfit) => {
  const percentageValue = checkUserAndReturnProfit(rank);
  const profit = (percentageValue / 100) * price;
  return profit;
};
