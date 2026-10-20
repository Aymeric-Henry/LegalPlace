import { Drug, Pharmacy } from "./pharmacy";

export const updateOnce = (name, expiresIn, benefit) =>
  new Pharmacy([new Drug(name, expiresIn, benefit)]).updateBenefitValue()[0];

export const updateDays = (drug, days) => {
  const pharmacy = new Pharmacy([drug]);
  const history = [];
  for (let day = 0; day < days; day++) {
    const [updated] = pharmacy.updateBenefitValue();
    history.push([updated.expiresIn, updated.benefit]);
  }
  return history;
};

describe("Drug", () => {
  it("stores name, expiresIn and benefit", () => {
    const drug = new Drug("Doliprane", 20, 30);

    expect(drug.name).toBe("Doliprane");
    expect(drug.expiresIn).toBe(20);
    expect(drug.benefit).toBe(30);
  });
});

describe("Pharmacy", () => {
  describe("constructor", () => {
    it("defaults to an empty list of drugs", () => {
      expect(new Pharmacy().drugs).toEqual([]);
    });

    it("keeps the given drugs", () => {
      const drugs = [new Drug("Doliprane", 20, 30)];

      expect(new Pharmacy(drugs).drugs).toBe(drugs);
    });
  });

  describe("updateBenefitValue", () => {
    it("returns an empty list when there are no drugs", () => {
      expect(new Pharmacy().updateBenefitValue()).toEqual([]);
    });

    it("updates the drugs in place and returns the same array", () => {
      const drug = new Drug("Doliprane", 20, 30);
      const drugs = [drug];

      const result = new Pharmacy(drugs).updateBenefitValue();

      expect(result).toBe(drugs);
      expect(result[0]).toBe(drug);
      expect(drug).toEqual(new Drug("Doliprane", 19, 29));
    });

    it("updates every drug independently and keeps their order", () => {
      const result = new Pharmacy([
        new Drug("Doliprane", 20, 30),
        new Drug("Herbal Tea", 10, 5),
        new Drug("Fervex", 5, 35),
        new Drug("Magic Pill", 15, 40),
      ]).updateBenefitValue();

      expect(result).toEqual([
        new Drug("Doliprane", 19, 29),
        new Drug("Herbal Tea", 9, 6),
        new Drug("Fervex", 4, 38),
        new Drug("Magic Pill", 15, 40),
      ]);
    });

    describe("normal drug", () => {
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
            new Drug("Doliprane", expectedExpiresIn, expectedBenefit),
          );
        },
      );

      it("applies to any drug without a special rule", () => {
        expect(updateOnce("Unknown drug", 0, 10)).toEqual(
          new Drug("Unknown drug", -1, 8),
        );
      });

      it("matches special names case-sensitively", () => {
        expect(updateOnce("herbal tea", 10, 20)).toEqual(
          new Drug("herbal tea", 9, 19),
        );
      });

      it("follows the expected course over several days", () => {
        expect(updateDays(new Drug("Doliprane", 2, 10), 7)).toEqual([
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

    describe("Herbal Tea", () => {
      it.each`
        case                                      | expiresIn | benefit | expectedExpiresIn | expectedBenefit
        ${"increases benefit by 1"}               | ${10}     | ${5}    | ${9}              | ${6}
        ${"increases by 1 on the last day"}       | ${1}      | ${5}    | ${0}              | ${6}
        ${"increases twice as fast once expired"} | ${0}      | ${5}    | ${-1}             | ${7}
        ${"keeps increasing twice as fast"}       | ${-3}     | ${5}    | ${-4}             | ${7}
        ${"never goes above 50"}                  | ${5}      | ${50}   | ${4}              | ${50}
        ${"reaches exactly 50"}                   | ${5}      | ${49}   | ${4}              | ${50}
        ${"caps at 50 once expired (from 49)"}    | ${0}      | ${49}   | ${-1}             | ${50}
        ${"caps at 50 once expired (from 48)"}    | ${0}      | ${48}   | ${-1}             | ${50}
        ${"stays at 50 once expired"}             | ${0}      | ${50}   | ${-1}             | ${50}
      `(
        "$case (expiresIn $expiresIn, benefit $benefit)",
        ({ expiresIn, benefit, expectedExpiresIn, expectedBenefit }) => {
          expect(updateOnce("Herbal Tea", expiresIn, benefit)).toEqual(
            new Drug("Herbal Tea", expectedExpiresIn, expectedBenefit),
          );
        },
      );

      it("follows the expected course over several days", () => {
        expect(updateDays(new Drug("Herbal Tea", 1, 46), 4)).toEqual([
          [0, 47],
          [-1, 49],
          [-2, 50],
          [-3, 50],
        ]);
      });
    });

    describe("Magic Pill", () => {
      it.each`
        case                                 | expiresIn | benefit
        ${"never changes"}                   | ${10}     | ${40}
        ${"never expires on day 0"}          | ${0}      | ${40}
        ${"stays unchanged if already past"} | ${-1}     | ${40}
        ${"keeps a benefit of 0"}            | ${10}     | ${0}
        ${"keeps a benefit of 50"}           | ${10}     | ${50}
      `(
        "$case (expiresIn $expiresIn, benefit $benefit)",
        ({ expiresIn, benefit }) => {
          expect(updateOnce("Magic Pill", expiresIn, benefit)).toEqual(
            new Drug("Magic Pill", expiresIn, benefit),
          );
        },
      );

      it("stays unchanged over many days", () => {
        const drug = new Drug("Magic Pill", 15, 40);

        updateDays(drug, 100);

        expect(drug).toEqual(new Drug("Magic Pill", 15, 40));
      });
    });

    describe("Fervex", () => {
      it.each`
        case                                       | expiresIn | benefit | expectedExpiresIn | expectedBenefit
        ${"increases by 1 with more than 10 days"} | ${15}     | ${20}   | ${14}             | ${21}
        ${"increases by 1 with 11 days"}           | ${11}     | ${20}   | ${10}             | ${21}
        ${"increases by 2 with 10 days"}           | ${10}     | ${20}   | ${9}              | ${22}
        ${"increases by 2 with 6 days"}            | ${6}      | ${20}   | ${5}              | ${22}
        ${"increases by 3 with 5 days"}            | ${5}      | ${20}   | ${4}              | ${23}
        ${"increases by 3 on the last day"}        | ${1}      | ${20}   | ${0}              | ${23}
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
          expect(updateOnce("Fervex", expiresIn, benefit)).toEqual(
            new Drug("Fervex", expectedExpiresIn, expectedBenefit),
          );
        },
      );

      it("follows the expected course over several days", () => {
        expect(updateDays(new Drug("Fervex", 12, 30), 14)).toEqual([
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

    // Current behaviour for values outside the 0..50 range. The spec does not
    // cover these inputs; the tests pin them down so a refactor changes them
    // only on purpose.
    describe("out-of-range input (current behaviour)", () => {
      it.each`
        name            | expiresIn | benefit | expectedExpiresIn | expectedBenefit
        ${"Doliprane"}  | ${5}      | ${60}   | ${4}              | ${59}
        ${"Doliprane"}  | ${5}      | ${-3}   | ${4}              | ${-3}
        ${"Herbal Tea"} | ${5}      | ${55}   | ${4}              | ${55}
        ${"Fervex"}     | ${5}      | ${55}   | ${4}              | ${55}
        ${"Magic Pill"} | ${5}      | ${80}   | ${5}              | ${80}
      `(
        "$name with benefit $benefit becomes $expectedBenefit",
        ({ name, expiresIn, benefit, expectedExpiresIn, expectedBenefit }) => {
          expect(updateOnce(name, expiresIn, benefit)).toEqual(
            new Drug(name, expectedExpiresIn, expectedBenefit),
          );
        },
      );
    });

    // Dafalgan degrades twice as fast as a normal drug: -2 per day before
    // expiry, -4 per day once expired (see DECISIONS.md, 003).
    describe("Dafalgan", () => {
      it.each`
        case                                 | expiresIn | benefit | expectedExpiresIn | expectedBenefit
        ${"decreases benefit by 2"}          | ${10}     | ${20}   | ${9}              | ${18}
        ${"decreases by 2 on the last day"}  | ${1}      | ${20}   | ${0}              | ${18}
        ${"decreases by 4 once expired"}     | ${0}      | ${20}   | ${-1}             | ${16}
        ${"keeps decreasing by 4"}           | ${-5}     | ${20}   | ${-6}             | ${16}
        ${"never goes below 0 (from 1)"}     | ${5}      | ${1}    | ${4}              | ${0}
        ${"stays at 0"}                      | ${5}      | ${0}    | ${4}              | ${0}
        ${"never goes below 0 once expired"} | ${0}      | ${3}    | ${-1}             | ${0}
        ${"stays at 0 once expired"}         | ${-1}     | ${0}    | ${-2}             | ${0}
      `(
        "$case (expiresIn $expiresIn, benefit $benefit)",
        ({ expiresIn, benefit, expectedExpiresIn, expectedBenefit }) => {
          expect(updateOnce("Dafalgan", expiresIn, benefit)).toEqual(
            new Drug("Dafalgan", expectedExpiresIn, expectedBenefit),
          );
        },
      );

      it("degrades twice as fast as a normal drug", () => {
        const [doliprane, dafalgan] = new Pharmacy([
          new Drug("Doliprane", 10, 30),
          new Drug("Dafalgan", 10, 30),
        ]).updateBenefitValue();

        expect(30 - dafalgan.benefit).toBe(2 * (30 - doliprane.benefit));
        expect(dafalgan.expiresIn).toBe(doliprane.expiresIn);
      });

      it("follows the expected course over several days", () => {
        expect(updateDays(new Drug("Dafalgan", 2, 12), 5)).toEqual([
          [1, 10],
          [0, 8],
          [-1, 4],
          [-2, 0],
          [-3, 0],
        ]);
      });
    });
  });
});
