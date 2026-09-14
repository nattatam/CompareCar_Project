import { describe, expect, it } from "vitest";
import { badgeLabel, formatPrice, type Powertrain } from "@/lib/types";

describe("badgeLabel", () => {
  it("returns ICE for ICE vehicles", () => {
    const powertrain: Powertrain = { type: "ICE" };
    expect(badgeLabel(powertrain)).toBe("ICE");
  });

  it("returns EV for EV/BEV vehicles", () => {
    const powertrain: Powertrain = { type: "EV", subtype: "BEV" };
    expect(badgeLabel(powertrain)).toBe("EV");
  });

  it("returns EV even when no subtype is set", () => {
    const powertrain: Powertrain = { type: "EV" };
    expect(badgeLabel(powertrain)).toBe("EV");
  });

  it("prioritizes subtype labels for HEV vehicles", () => {
    expect(badgeLabel({ type: "HEV", subtype: "MHEV" })).toBe("MHEV");
    expect(badgeLabel({ type: "HEV", subtype: "HEV" })).toBe("HEV");
    expect(badgeLabel({ type: "HEV", subtype: "PHEV" })).toBe("PHEV");
    expect(badgeLabel({ type: "HEV", subtype: "REEV/EREV" })).toBe("REEV/EREV");
  });

  it("falls back to HEV when an HEV vehicle has no subtype", () => {
    const powertrain: Powertrain = { type: "HEV" };
    expect(badgeLabel(powertrain)).toBe("HEV");
  });
});

describe("formatPrice", () => {
  it("formats a plain number price with commas", () => {
    expect(formatPrice(1_999_000)).toBe("฿1,999,000");
  });

  it("formats small prices without commas", () => {
    expect(formatPrice(999)).toBe("฿999");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("฿0");
  });
});