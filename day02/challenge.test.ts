import fs from "fs";

const rows = fs
.readFileSync(`${__dirname}/input.txt`, 'utf-8')
  .split("\n")
  .filter((l) => l);

describe("day02", () => {
  test("answer1", () => {
    const limits: Record<string, number> = { red: 12, green: 13, blue: 14 };

    const answer = rows
      .map((l) => {
        const [game, ...games] = l.split(/[:;]/);
        const gameNumber = parseInt(game.replace("Game ", ""));
        const valid = games.every((g) => {
          const colours = g
            .trim()
            .split(",")
            .map((type) => type.trim().split(" "));
          return colours.every(([n, c]) => parseInt(n) <= limits[c]);
        });

        return valid ? gameNumber : 0;
      })
      .reduce((acc, i) => acc + i);

    expect(answer).toBe(2771);
  });

  test("answer2", () => {
    const answer = rows
      .map((l) => {
        const [, ...hands] = l.split(/[:;]/);
        const limits: Record<string, number> = { red: 0, green: 0, blue: 0 };

        hands.forEach((hand) => {
          hand
            .trim()
            .split(",")
            .map((type) => type.trim().split(" "))
            .forEach(([n, c]) => {
              limits[c] = Math.max(limits[c], parseInt(n));
            });
        });

        return Object.values(limits).reduce((acc, i) => acc * i, 1);
      })
      .reduce((acc, i) => acc + i);

    expect(answer).toBe(70924);
  });
});
