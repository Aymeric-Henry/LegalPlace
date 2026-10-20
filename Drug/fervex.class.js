import { MAX_BENEFIT, MIN_BENEFIT } from "./drug.constants";
import { BaseDrug } from "./base-drug.class";

export class Fervex extends BaseDrug {
  updateBenefitValue() {
    if (this.benefit > MAX_BENEFIT) return;

    if (this.expiresIn > 10) {
      this.benefit += 1;
    } else if (this.expiresIn > 5) {
      this.benefit += 2;
    } else if (this.expiresIn > 0) {
      this.benefit += 3;
    } else {
      this.benefit = 0;
    }

    this.benefit = Math.min(Math.max(MIN_BENEFIT, this.benefit), MAX_BENEFIT);
  }
}
