export const FISH_TYPES = {
  草鱼: [50],
  巴沙鱼: [20],
  鲤鱼: [10],
};

export type FISH_NAME = keyof typeof FISH_TYPES;

function amIAirForce(points: number): boolean {
  return Math.random() < 0.3;
}

/**
 * 生成一条鱼
 * @param points 范围 0~100 ；1~50 时，分数越高，获得鱼的种类越高，50+ 时，获得高级鱼的概率越高
 */
export function randomizeOneFish(points: number): FISH_NAME | undefined {
  if (amIAirForce(points)) {
    return undefined;
  }

  const actualTotalValue = Object.values(FISH_TYPES)
    .map((val) => val[0])
    .reduce((a, b) => a + b, 0);

  const lo = points - 60,
    hi = points;
  const ran = Math.random() * (hi - lo) + lo;
  const actualRan = (actualTotalValue * ran) / 100;

  let cur = 0;
  for (let entry of Object.entries(FISH_TYPES)) {
    const [name, val] = entry;
    const fishPoint = val[0];
    cur += fishPoint;
    if (actualRan <= fishPoint) {
      return name as FISH_NAME;
    }
  }

  return undefined;
}
