export type PlanId = "free" | "pro" | "business";

export const planPricesInRupees: Record<PlanId, number> = {
  free: 0,
  pro: 299,
  business: 599,
};

export function getPlanSelectionAction(plan: PlanId): "save" | "show_payment" {
  return plan === "free" ? "save" : "show_payment";
}

const LOCAL_PLAN_KEY = "yt-content-lab-selected-plan";

export function getLocalPlan(): PlanId {
  const stored = localStorage.getItem(LOCAL_PLAN_KEY);
  return stored === "free" || stored === "pro" || stored === "business" ? stored : "free";
}

export function saveLocalPlan(plan: PlanId): void {
  localStorage.setItem(LOCAL_PLAN_KEY, plan);
}