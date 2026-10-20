import { BaseDrug } from "./base-drug.class";
import { updateOnce, updateDays } from "../pharmacy.test";

describe("normal BaseDrug", () => {
  it.each`
    case                                     | expiresIn | benefit | expectedExpiresIn | expectedBenefit
    ${"decreases both values by 1"}          | ${10}     | ${20}   | ${9}              | ${19}
    ${"decreases by 1 on the last day"}      | ${1}      | ${20}   | ${0}              | ${19}
    ${"degrades twice as fast once expired"} | ${0}      | ${20}   | ${-1}             | ${18}
    ${"keeps degrading twice as fast"}       | ${-5}     | ${20}   | ${-6}             | ${18}
    ${"never goes below 0"}                  | ${5}      | ${0}    | ${4}              | ${0}
    ${"never goes below 0 once expired"}     | ${0}      | ${1}    | ${-1}             | ${0}
    ${"stays at 0 once expired"}             | ${-1}     | ${0}    | ${-2}             | ${0}
  `(
    "$case (expiresIn $expiresIn, benefit $benefit)",
    ({ expiresIn, benefit, expectedExpiresIn, expectedBenefit }) => {
      expect(updateOnce("Doliprane", expiresIn, benefit)).toEqual(
        new BaseDrug("Doliprane", expectedExpiresIn, expectedBenefit),
      );
    },
  );

  it.each`
    case                                     | expiresIn | benefit | expectedExpiresIn | expectedBenefit
    ${"decreases both values by 1"}          | ${10}     | ${20}   | ${9}              | ${19}
    ${"decreases by 1 on the last day"}      | ${1}      | ${20}   | ${0}              | ${19}
    ${"degrades twice as fast once expired"} | ${0}      | ${20}   | ${-1}             | ${18}
    ${"keeps degrading twice as fast"}       | ${-5}     | ${20}   | ${-6}             | ${18}
    ${"never goes below 0"}                  | ${5}      | ${0}    | ${4}              | ${0}
    ${"never goes below 0 once expired"}     | ${0}      | ${1}    | ${-1}             | ${0}
    ${"stays at 0 once expired"}             | ${-1}     | ${0}    | ${-2}             | ${0}
  `(
    "$case (expiresIn $expiresIn, benefit $benefit)",
    ({ expiresIn, benefit, expectedExpiresIn, expectedBenefit }) => {
      expect(updateOnce("Doliprane", expiresIn, benefit)).toEqual(
        new BaseDrug("Doliprane", expectedExpiresIn, expectedBenefit),
      );
    },
  );

  it("applies to any BaseDrug without a special rule", () => {
    expect(updateOnce("Unknown BaseDrug", 0, 10)).toEqual(
      new BaseDrug("Unknown BaseDrug", -1, 8),
    );
  });

  it("matches special names case-sensitively", () => {
    expect(updateOnce("herbal tea", 10, 20)).toEqual(
      new BaseDrug("herbal tea", 9, 19),
    );
  });

  it("follows the expected course over several days", () => {
    expect(updateDays(new BaseDrug("Doliprane", 2, 10), 7)).toEqual([
      [1, 9],
      [0, 8],
      [-1, 6],
      [-2, 4],
      [-3, 2],
      [-4, 0],
      [-5, 0],
    ]);
  });
});
