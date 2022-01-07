export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.substr(0, 4)}...${address.substr(-4)}`;
};
