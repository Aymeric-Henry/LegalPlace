import { DRUG_TYPES } from "./drug.constants";
import { Fervex } from "./fervex.class";
import { BaseDrug } from "./base-drug.class";
import { Drug } from "../pharmacy";

export class DrugFactory {
  static createDrug(name, expiresIn, benefit) {
    switch (name) {
      case DRUG_TYPES.DAFALGAN:
      case DRUG_TYPES.HERBAL_TEA:
      case DRUG_TYPES.MAGIC_PILL:
        return new Drug(name, expiresIn, benefit);
      case DRUG_TYPES.FERVEX:
        return new Fervex(name, expiresIn, benefit);
      default:
        return new BaseDrug(name, expiresIn, benefit);
    }
  }
}
