const getMiddlePrice = (priceArr: number[]) => {
  const trimRate = 0.1;

  const start = Math.floor(priceArr.length * trimRate);
  const end = Math.ceil(priceArr.length * (1 - trimRate));
  const trimmed = priceArr.slice(start, end);

  // 중앙값 적용
  const mid = Math.floor(trimmed.length / 2);
  const price =
    trimmed.length % 2 === 1
      ? trimmed[mid]
      : (trimmed[mid - 1] + trimmed[mid]) / 2;

  return price;
};

export default getMiddlePrice;
