import fs from "fs";

const score = (a: number): number => (a < 2 ? a : Math.pow(2, a - 1));
type Card = { gameNumber: number; winners: number[]; numbers: number[] };

const cards: Card[] = fs
  .readFileSync(`${__dirname}/input.txt`)
  .toString()
  .split("\n")
  .filter((l) => l)
  .map((line) => {
    const [gameName, numberBit] = line.split(":");
    const gameNumber = parseInt(gameName.split(/\s+/)[1].trim());
    const [winners, numbers] = numberBit
      .trim()
      .split("|")
      .map((c) =>
        c
          .trim()
          .split(/\s+/)
          .map((h) => parseInt(h))
      );
    return { gameNumber, winners, numbers };
  });

describe("day04", () => {
  test("answer1", () => {
    const part1 = cards
      .map(({ winners, numbers }) => {
        const matches = numbers.filter((c) => winners.includes(c));
        return score(matches.length);
      })
      .reduce((acc, i) => acc + i);

    expect(part1).toStrictEqual(19135);
  });

  test("answer2", () => {
    const cardToScore = new Map<number, number>(
      cards.map(({ gameNumber, winners, numbers }) => {
        const matches = numbers.filter((c) => winners.includes(c)).length;
        return [gameNumber, matches];
      })
    );

    const cardsToNewCards = Array.from(cardToScore.keys()).map(
      (card): [card: number, spawn: number[]] => {
        const nextCardScore = cardToScore.get(card);
        const newCards = Array.from(
          { length: nextCardScore },
          (v, k) => k + card + 1
        ).filter((card) => cardToScore.has(card));
        return [card, newCards];
      }
    );

    const cache: Map<number, number> = new Map();

    for (let index = 0; index < 100; index++) {
      for (const [thisCard, newCards] of cardsToNewCards) {
        const canAdd =
          cache.get(thisCard) === undefined &&
          newCards.every((n) => cache.get(n) !== undefined);
        if (canAdd) {
          const score = newCards
            .map((c) => cache.get(c))
            .reduce((acc, i) => acc + i, 1);
          cache.set(thisCard, score);
        }
      }
    }

    const result = cardsToNewCards
      .map(([card]) => cache.get(card))
      .reduce((acc, i) => acc + i);

    expect(result).toStrictEqual(5704953);
  });
});
