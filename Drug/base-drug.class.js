import { MAX_BENEFIT, MIN_BENEFIT } from "./drug.constants";

export class BaseDrug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  update() {
    this.updateExpiresIn();
    this.updateBenefitValue();
  }

  updateBenefitValue() {
    if (this.benefit > MAX_BENEFIT || this.benefit === MIN_BENEFIT) return;
    if (this.expiresIn >= 0) {
      this.benefit -= 1;
    }
    if (this.expiresIn < 0) {
      this.benefit -= 2;
    }
    this.benefit = Math.max(MIN_BENEFIT, this.benefit);
  }

  updateExpiresIn() {
    // Weird behavior same as the original but need clarification can be problematic for long stale drugs
    // if (this.expiresIn <= 0) return;
    this.expiresIn -= 1;
  }
}
