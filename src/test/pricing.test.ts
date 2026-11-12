import { beforeEach, describe, expect, it } from "vitest";
import { getLocalPlan, planPricesInRupees, saveLocalPlan } from "@/lib/pricing";

describe("local pricing plans", () => {
  beforeEach(() => localStorage.clear());

  it("shows Starter as free, Creator Pro as ₹299, and Studio as ₹599", () => {
    expect(planPricesInRupees).toEqual({ free: 0, pro: 299, business: 599 });
  });

  it("defaults to Starter and saves a selected plan locally", () => {
    expect(getLocalPlan()).toBe("free");
    saveLocalPlan("pro");
    expect(getLocalPlan()).toBe("pro");
  });
});