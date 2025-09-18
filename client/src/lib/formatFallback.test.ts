import { describe, it, expect } from "vitest";
import {
  formatFallback,
  formatPercentage,
  formatWeight,
  formatCount,
  formatCurrency,
  isDataAvailable,
  formatDateFallback,
} from "./formatFallback";

describe("formatFallback", () => {
  describe("basic functionality", () => {
    it("should return 'N/A' for null values", () => {
      expect(formatFallback(null)).toBe("N/A");
    });

    it("should return 'N/A' for undefined values", () => {
      expect(formatFallback(undefined)).toBe("N/A");
    });

    it("should return 'N/A' for empty string", () => {
      expect(formatFallback("")).toBe("N/A");
    });

    it("should return custom fallback text when provided", () => {
      expect(formatFallback(null, undefined, { fallbackText: "No data available" })).toBe("No data available");
    });
  });

  describe("numeric values", () => {
    it("should format integer values correctly", () => {
      expect(formatFallback(42)).toBe("42");
    });

    it("should format decimal values with precision", () => {
      expect(formatFallback(3.14159)).toBe("3.14");
      expect(formatFallback(3.14159, undefined, { precision: 3 })).toBe("3.142");
    });

    it("should append unit when provided", () => {
      expect(formatFallback(100, "kg")).toBe("100 kg");
      expect(formatFallback(25.5, "%")).toBe("25.50 %");
    });

    it("should handle zero values based on isZeroValid option", () => {
      expect(formatFallback(0)).toBe("0");
      expect(formatFallback(0, undefined, { isZeroValid: false })).toBe("N/A");
    });

    it("should return 'N/A' for NaN values", () => {
      expect(formatFallback(NaN)).toBe("N/A");
    });

    it("should handle string numbers", () => {
      expect(formatFallback("42")).toBe("42");
      expect(formatFallback("3.14", "kg")).toBe("3.14 kg");
    });
  });

  describe("non-numeric values", () => {
    it("should return string representation for truthy non-numeric values", () => {
      expect(formatFallback("Hello")).toBe("Hello");
      expect(formatFallback(true)).toBe("true");
      expect(formatFallback(false)).toBe("false");
    });

    it("should handle objects and arrays", () => {
      expect(formatFallback({})).toBe("[object Object]");
      expect(formatFallback([])).toBe("N/A"); // Empty array is falsy for our purposes
      expect(formatFallback([1, 2])).toBe("1,2");
    });
  });
});

describe("formatPercentage", () => {
  it("should format percentage values correctly", () => {
    expect(formatPercentage(75.5)).toBe("75.5 %");
    expect(formatPercentage(100)).toBe("100 %");
    expect(formatPercentage(33.333, 2)).toBe("33.33 %");
  });

  it("should return 'N/A' for null/undefined", () => {
    expect(formatPercentage(null)).toBe("N/A");
    expect(formatPercentage(undefined)).toBe("N/A");
  });
});

describe("formatWeight", () => {
  it("should format weight values with kg unit", () => {
    expect(formatWeight(150.5)).toBe("150.50 kg");
    expect(formatWeight(200)).toBe("200 kg");
    expect(formatWeight(75.123, 1)).toBe("75.1 kg");
  });

  it("should return 'N/A' for null/undefined", () => {
    expect(formatWeight(null)).toBe("N/A");
    expect(formatWeight(undefined)).toBe("N/A");
  });
});

describe("formatCount", () => {
  it("should format count values without decimals", () => {
    expect(formatCount(100)).toBe("100");
    expect(formatCount(100.7)).toBe("101"); // Rounds to integer
    expect(formatCount(50.2)).toBe("50");
  });

  it("should append unit when provided", () => {
    expect(formatCount(100, "fish")).toBe("100 fish");
    expect(formatCount(5, "containers")).toBe("5 containers");
  });

  it("should return 'N/A' for null/undefined", () => {
    expect(formatCount(null)).toBe("N/A");
    expect(formatCount(undefined)).toBe("N/A");
  });
});

describe("formatCurrency", () => {
  it("should format currency values with $ sign", () => {
    expect(formatCurrency(100)).toBe("$100.00");
    expect(formatCurrency(99.99)).toBe("$99.99");
    expect(formatCurrency(1234.567, 1)).toBe("$1234.6");
  });

  it("should return 'N/A' for null/undefined", () => {
    expect(formatCurrency(null)).toBe("N/A");
    expect(formatCurrency(undefined)).toBe("N/A");
  });

  it("should handle zero values", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("isDataAvailable", () => {
  it("should return false for null, undefined, and empty string", () => {
    expect(isDataAvailable(null)).toBe(false);
    expect(isDataAvailable(undefined)).toBe(false);
    expect(isDataAvailable("")).toBe(false);
  });

  it("should return true for valid values", () => {
    expect(isDataAvailable(0)).toBe(true);
    expect(isDataAvailable(false)).toBe(true);
    expect(isDataAvailable("text")).toBe(true);
    expect(isDataAvailable([])).toBe(true);
    expect(isDataAvailable({})).toBe(true);
  });
});

describe("formatDateFallback", () => {
  it("should format valid date values", () => {
    const date = new Date("2024-01-15");
    expect(formatDateFallback(date)).toContain("1");
    expect(formatDateFallback(date)).toContain("15");
    expect(formatDateFallback(date)).toContain("2024");
  });

  it("should handle date strings", () => {
    expect(formatDateFallback("2024-01-15")).toContain("2024");
  });

  it("should handle timestamps", () => {
    const timestamp = new Date("2024-01-15").getTime();
    expect(formatDateFallback(timestamp)).toContain("2024");
  });

  it("should return 'N/A' for invalid dates", () => {
    expect(formatDateFallback(null)).toBe("N/A");
    expect(formatDateFallback(undefined)).toBe("N/A");
    expect(formatDateFallback("")).toBe("N/A");
    expect(formatDateFallback("invalid-date")).toBe("N/A");
  });
});
