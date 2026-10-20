import { MAX_BENEFIT, MIN_BENEFIT } from "./drug.constants";

export class BaseDrug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  update() {
    this.updateBenefitValue();
    this.updateExpiresIn();
  }

  updateBenefitValue() {
    if (this.benefit > MAX_BENEFIT) return;
    if (this.expiresIn > 0) {
      this.benefit -= 1;
    }
    if (this.expiresIn <= 0) {
      this.benefit -= 2;
    }
    this.benefit = Math.min(Math.max(MIN_BENEFIT, this.benefit), MAX_BENEFIT);
  }

  updateExpiresIn() {
    // Weird behavior same as the original but need clarification can be problematic for long stale drugs
    // if (this.expiresIn <= 0) return;
    this.expiresIn -= 1;
  }
}
