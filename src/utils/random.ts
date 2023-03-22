export const pickOne = (ary: number[]): number => {
  const total = ary.reduce((a, b) => a + b, 0);
  const res = Math.random() * total;
  let cur = 0;
  for (let i = 0; i < ary.length; i++) {
    cur += ary[i];
    if (cur >= res) {
      return i;
    }
  }

  return 0;
};

export const pickFromHundred = (per: number): boolean => {
  return Math.random() * 100 <= per;
};
