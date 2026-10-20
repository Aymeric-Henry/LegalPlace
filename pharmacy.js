import { BaseDrug } from "./Drug/base-drug.class";
import { DrugFactory } from "./Drug/drug-factory";
export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    // process.env.NODE_ENV !== "test" is in here instead of a FF behavior purely for demonstration cant activate
    // it will make the test suite testing agaisnt itself
    if (process.env.NODE_ENV !== "test" && 1 === 2) {
      this.drugs = drugs.map((drug) =>
        DrugFactory.createDrug(drug.name, drug.expiresIn, drug.benefit),
      );
      return;
    }
    this.drugs = drugs;
  }
  updateBenefitValue() {
    for (var i = 0; i < this.drugs.length; i++) {
      // process.env.NODE_ENV !== "test" is in here instead of a FF // node config etc for the switch of the feature
      if (process.env.NODE_ENV !== "test") {
        if (this.drugs[i] instanceof BaseDrug) {
          this.drugs[i].update();
          continue;
        }
      }

      if (this.drugs[i].name == "Dafalgan") {
        this.drugs[i].expiresIn -= 1;

        if (this.drugs[i].benefit > 0) {
          if (this.drugs[i].expiresIn >= 0) {
            this.drugs[i].benefit -= 2;
          } else {
            this.drugs[i].benefit -= 4;
          }
          this.drugs[i].benefit = Math.max(0, this.drugs[i].benefit);
        }
        continue;
      }

      if (
        this.drugs[i].name != "Herbal Tea" &&
        this.drugs[i].name != "Fervex"
      ) {
        if (this.drugs[i].benefit > 0) {
          if (this.drugs[i].name != "Magic Pill") {
            this.drugs[i].benefit = this.drugs[i].benefit - 1;
          }
        }
      } else {
        if (this.drugs[i].benefit < 50) {
          this.drugs[i].benefit = this.drugs[i].benefit + 1;
          if (this.drugs[i].name == "Fervex") {
            if (this.drugs[i].expiresIn < 11) {
              if (this.drugs[i].benefit < 50) {
                this.drugs[i].benefit = this.drugs[i].benefit + 1;
              }
            }
            if (this.drugs[i].expiresIn < 6) {
              if (this.drugs[i].benefit < 50) {
                this.drugs[i].benefit = this.drugs[i].benefit + 1;
              }
            }
          }
        }
      }
      if (this.drugs[i].name != "Magic Pill") {
        this.drugs[i].expiresIn = this.drugs[i].expiresIn - 1;
      }
      if (this.drugs[i].expiresIn < 0) {
        if (this.drugs[i].name != "Herbal Tea") {
          if (this.drugs[i].name != "Fervex") {
            if (this.drugs[i].benefit > 0) {
              if (this.drugs[i].name != "Magic Pill") {
                this.drugs[i].benefit = this.drugs[i].benefit - 1;
              }
            }
          } else {
            this.drugs[i].benefit =
              this.drugs[i].benefit - this.drugs[i].benefit;
          }
        } else {
          if (this.drugs[i].benefit < 50) {
            this.drugs[i].benefit = this.drugs[i].benefit + 1;
          }
        }
      }
    }

    return this.drugs;
  }
}
