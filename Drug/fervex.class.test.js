import { Fervex } from "./fervex.class";

const updateOnce = (expiresIn, benefit) => {
  const drug = new Fervex("Fervex", expiresIn, benefit);
  drug.update();
  return drug;
};

const updateDays = (drug, days) => {
  const history = [];
  for (let day = 0; day < days; day++) {
    drug.update();
    history.push([drug.expiresIn, drug.benefit]);
  }
  return history;
};

describe("Fervex", () => {
  it.each`
    case                                       | expiresIn | benefit | expectedExpiresIn | expectedBenefit
    ${"increases by 1 with more than 10 days"} | ${15}     | ${20}   | ${14}             | ${21}
    ${"increases by 1 with 11 days"}           | ${11}     | ${20}   | ${10}             | ${21}
    ${"increases by 2 with 10 days"}           | ${10}     | ${20}   | ${9}              | ${22}
    ${"increases by 2 with 6 days"}            | ${6}      | ${20}   | ${5}              | ${22}
    ${"increases by 3 with 5 days"}            | ${5}      | ${20}   | ${4}              | ${23}
    ${"increases by 3 on the last day"}        | ${1}      | ${20}   | ${0}              | ${23}
    ${"increases from a benefit of 0"}         | ${10}     | ${0}    | ${9}              | ${2}
    ${"drops to 0 once expired"}               | ${0}      | ${20}   | ${-1}             | ${0}
    ${"drops to 0 from 50 once expired"}       | ${0}      | ${50}   | ${-1}             | ${0}
    ${"stays at 0 when already expired"}       | ${-1}     | ${20}   | ${-2}             | ${0}
    ${"never goes above 50"}                   | ${15}     | ${50}   | ${14}             | ${50}
    ${"caps a +2 increase at 50"}              | ${10}     | ${49}   | ${9}              | ${50}
    ${"caps a +3 increase at 50 (from 48)"}    | ${5}      | ${48}   | ${4}              | ${50}
    ${"caps a +3 increase at 50 (from 49)"}    | ${5}      | ${49}   | ${4}              | ${50}
  `(
    "$case (expiresIn $expiresIn, benefit $benefit)",
    ({ expiresIn, benefit, expectedExpiresIn, expectedBenefit }) => {
      expect(updateOnce(expiresIn, benefit)).toStrictEqual(
        new Fervex("Fervex", expectedExpiresIn, expectedBenefit),
      );
    },
  );

  it("keeps a benefit above 50 unchanged (original behaviour)", () => {
    expect(updateOnce(5, 55)).toStrictEqual(new Fervex("Fervex", 4, 55));
  });

  it("follows the expected course over several days", () => {
    expect(updateDays(new Fervex("Fervex", 12, 30), 14)).toEqual([
      [11, 31],
      [10, 32],
      [9, 34],
      [8, 36],
      [7, 38],
      [6, 40],
      [5, 42],
      [4, 45],
      [3, 48],
      [2, 50],
      [1, 50],
      [0, 50],
      [-1, 0],
      [-2, 0],
    ]);
  });
});
