export const VALID_PROJECT_TYPES = [
  "reforestation",
  "conservation",
  "renewable_energy",
  "blue_carbon",
  "soil_carbon",
  "avoided_deforestation",
  "methane_reduction",
  "sustainable_agriculture",
  "wetland_restoration",
  "urban_greening",
  "other",
] as const;

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  reforestation: "Reforestation",
  conservation: "Conservation",
  renewable_energy: "Renewable Energy",
  blue_carbon: "Blue Carbon (Mangroves, Seagrass)",
  soil_carbon: "Soil Carbon Sequestration",
  avoided_deforestation: "Avoided Deforestation (REDD+)",
  methane_reduction: "Methane Reduction",
  sustainable_agriculture: "Sustainable Agriculture",
  wetland_restoration: "Wetland Restoration",
  urban_greening: "Urban Greening",
  other: "Other",
};
