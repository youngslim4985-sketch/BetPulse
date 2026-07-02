import type { Confidence, Recommendation } from "../types/market";

export function confidenceClass(confidence: Confidence) {
  if (confidence === "HIGH") return "badge badge-high";
  if (confidence === "MEDIUM") return "badge badge-medium";
  return "badge badge-low";
}

export function recommendationClass(recommendation: Recommendation) {
  if (recommendation === "STRONG_SIGNAL") return "badge badge-strong";
  if (recommendation === "LEAN") return "badge badge-lean";
  if (recommendation === "NO_PLAY") return "badge badge-danger";
  return "badge badge-watch";
}
