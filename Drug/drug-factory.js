import { DRUG_TYPES } from "./drug.constants";
import { Fervex } from "./fervex.class";
import { BaseDrug } from "./base-drug.class";

export class DrugFactory {
  static createDrug(name, expiresIn, benefit) {
    switch (name) {
      case DRUG_TYPES.FERVEX:
        return new Fervex(name, expiresIn, benefit);
      default:
        return new BaseDrug(name, expiresIn, benefit);
    }
  }
}
