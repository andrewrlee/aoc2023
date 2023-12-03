import fs from "fs";

type Cell = { x: number; y: number; c: string };
type Coord = [x: number, y: number];

const grid: Cell[][] = fs
.readFileSync(`${__dirname}/input.txt`, 'utf-8')
  .split("\n")
  .filter((l) => l)
  .map((row, y) => [...row].map((c, x) => ({ x, y, c })));

const extractNumbers = (row: Cell[]): Cell[][] => {
  const result: Cell[][] = [];
  let current: Cell[] = [];
  row.forEach((cell: Cell) => {
    if (Number.isInteger(parseInt(cell.c))) {
      current.push(cell);
    } else if (current.length > 0) {
      if (current.length > 0) result.push(current);
      current = [];
    }
  });
  if (current.length > 0) result.push(current);
  return result;
};

const numbers = grid.flatMap((rows) => extractNumbers(rows));

const surrounding = ({ x, y }: Cell): Coord[] => {
  return [
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x, y - 1],
  ];
};

const isSymbol = (c: string) => {
  return c !== undefined && isNaN(parseInt(c)) && "." !== c;
};

const isCloseToSymbol = (number: Cell[]): Boolean => {
  return number.some((cell) => {
    return surrounding(cell).some(([x, y]) => isSymbol(grid[y]?.[x]?.c));
  });
};

const toNumber = (number: Cell[]): number => {
  return parseInt(number.map((cell) => cell.c).join(""));
};

const getGearRatio = (possGear: Cell): number => {
  const surrounds = surrounding(possGear);
  const closeNumbers = numbers.filter((cells) =>
    cells.some(({ x: x1, y: y1 }) =>
      surrounds.some(([x, y]) => x1 == x && y1 == y)
    )
  );
  if (closeNumbers.length == 2) {
    return toNumber(closeNumbers[0]) * toNumber(closeNumbers[1]);
  }
  return 0;
};

describe("day03", () => {
  test("answer1", () => {
    const answer = numbers
      .filter((number) => isCloseToSymbol(number))
      .map((number) => toNumber(number))
      .reduce((acc, i) => acc + i);

    expect(answer).toStrictEqual(550064);
  });

  test("answer2", () => {
    const answer = grid
      .flatMap((row) => row.filter((c) => c.c == "*"))
      .map((gear) => getGearRatio(gear))
      .reduce((acc, i) => acc + i);

    expect(answer).toBe(85010461);
  });
});
