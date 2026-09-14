import { describe, expect, it } from "vitest";
import { formatPriceCompact } from "@/lib/utils";

describe("formatPriceCompact", () => {
  it("formats values under 1,000 with the baht symbol", () => {
    expect(formatPriceCompact(0)).toBe("฿0");
    expect(formatPriceCompact(500)).toBe("฿500");
    expect(formatPriceCompact(999)).toBe("฿999");
  });

  it("formats thousands as K", () => {
    expect(formatPriceCompact(1_000)).toBe("฿1K");
    expect(formatPriceCompact(1_500)).toBe("฿2K");
    expect(formatPriceCompact(999_000)).toBe("฿999K");
  });

  it("formats millions as M", () => {
    expect(formatPriceCompact(1_000_000)).toBe("฿1M");
    expect(formatPriceCompact(2_500_000)).toBe("฿2.5M");
    expect(formatPriceCompact(1_200_000)).toBe("฿1.2M");
  });

  it("rounds non-integer millions to one decimal", () => {
    expect(formatPriceCompact(1_250_000)).toBe("฿1.3M");
  });

  it("handles the boundary between K and M", () => {
    expect(formatPriceCompact(1_000_000 - 1)).toBe("฿1000K");
  });
});