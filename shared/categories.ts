/**
 * CATEGORY CONSTANTS - Single Source of Truth
 *
 * These are the ONLY valid category values allowed in the application.
 * All category usage across frontend and backend MUST reference this file.
 */

// The 8 approved category values (exactly as specified)
export const CATEGORIES = {
  ROADS_TRANSPORT: "Roads & Transport",
  WATER_DRAINAGE: "Water Supply & Drainage",
  SANITATION_WASTE: "Sanitation & Waste Management",
  ELECTRICITY_LIGHTING: "Electricity & Lighting",
  PUBLIC_SAFETY: "Public Safety & Hazards",
  BUILDINGS_INFRASTRUCTURE: "Buildings & Infrastructure",
  ENVIRONMENT_POLLUTION: "Environment & Pollution",
  MISCELLANEOUS: "Miscellaneous",
} as const;

// Array of all valid categories for validation and UI dropdowns
export const CATEGORY_LIST = Object.values(CATEGORIES);

// Type for category values
export type CategoryType = (typeof CATEGORIES)[keyof typeof CATEGORIES];

// Category colors for UI badges/pills
export const CATEGORY_COLORS: Record<
  CategoryType,
  { bg: string; text: string; border: string }
> = {
  [CATEGORIES.ROADS_TRANSPORT]: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  [CATEGORIES.WATER_DRAINAGE]: {
    bg: "bg-cyan-100",
    text: "text-cyan-800",
    border: "border-cyan-200",
  },
  [CATEGORIES.SANITATION_WASTE]: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  [CATEGORIES.ELECTRICITY_LIGHTING]: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  [CATEGORIES.PUBLIC_SAFETY]: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
  [CATEGORIES.BUILDINGS_INFRASTRUCTURE]: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  [CATEGORIES.ENVIRONMENT_POLLUTION]: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  [CATEGORIES.MISCELLANEOUS]: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  },
};

/**
 * Maps AI-generated domain strings to approved categories.
 * This function handles various AI outputs and normalizes them.
 *
 * @param domain - The AI-generated domain string
 * @returns A valid category from CATEGORIES
 */
export function mapDomainToCategory(domain: string): CategoryType {
  const d = domain.toLowerCase();

  // Roads & Transport
  if (
    d.includes("road") ||
    d.includes("pothole") ||
    d.includes("transport") ||
    d.includes("highway") ||
    d.includes("street") ||
    d.includes("pavement") ||
    d.includes("traffic") ||
    d.includes("signal") ||
    d.includes("sign")
  ) {
    return CATEGORIES.ROADS_TRANSPORT;
  }

  // Water Supply & Drainage
  if (
    d.includes("water") ||
    d.includes("drain") ||
    d.includes("sewage") ||
    d.includes("sewer") ||
    d.includes("pipe") ||
    d.includes("plumb") ||
    d.includes("leak") ||
    d.includes("flood")
  ) {
    return CATEGORIES.WATER_DRAINAGE;
  }

  // Sanitation & Waste Management
  if (
    d.includes("waste") ||
    d.includes("garbage") ||
    d.includes("trash") ||
    d.includes("sanitation") ||
    d.includes("litter") ||
    d.includes("dump") ||
    d.includes("bin") ||
    d.includes("refuse")
  ) {
    return CATEGORIES.SANITATION_WASTE;
  }

  // Electricity & Lighting
  if (
    d.includes("electric") ||
    d.includes("power") ||
    d.includes("light") ||
    d.includes("lamp") ||
    d.includes("wir") ||
    d.includes("pole") ||
    d.includes("transformer")
  ) {
    return CATEGORIES.ELECTRICITY_LIGHTING;
  }

  // Public Safety & Hazards
  if (
    d.includes("safety") ||
    d.includes("hazard") ||
    d.includes("danger") ||
    d.includes("emergency") ||
    d.includes("accident") ||
    d.includes("child") ||
    d.includes("pedestrian") ||
    d.includes("crime") ||
    d.includes("security")
  ) {
    return CATEGORIES.PUBLIC_SAFETY;
  }

  // Buildings & Infrastructure
  if (
    d.includes("building") ||
    d.includes("infrastructure") ||
    d.includes("structure") ||
    d.includes("construct") ||
    d.includes("bridge") ||
    d.includes("facility") ||
    d.includes("public building")
  ) {
    return CATEGORIES.BUILDINGS_INFRASTRUCTURE;
  }

  // Environment & Pollution
  if (
    d.includes("environment") ||
    d.includes("pollut") ||
    d.includes("air") ||
    d.includes("noise") ||
    d.includes("tree") ||
    d.includes("green") ||
    d.includes("park") ||
    d.includes("garden")
  ) {
    return CATEGORIES.ENVIRONMENT_POLLUTION;
  }

  // Default fallback
  return CATEGORIES.MISCELLANEOUS;
}

/**
 * Validates if a string is a valid category.
 *
 * @param category - The category string to validate
 * @returns true if valid, false otherwise
 */
export function isValidCategory(category: string): category is CategoryType {
  return CATEGORY_LIST.includes(category as CategoryType);
}

/**
 * Gets category color classes for UI display.
 *
 * @param category - The category to get colors for
 * @returns Color classes object with bg, text, and border
 */
export function getCategoryColors(category: string): {
  bg: string;
  text: string;
  border: string;
} {
  if (isValidCategory(category)) {
    return CATEGORY_COLORS[category];
  }
  // Fallback for unknown categories
  return CATEGORY_COLORS[CATEGORIES.MISCELLANEOUS];
}
