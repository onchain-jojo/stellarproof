export const COUNTRIES: { code: number; name: string }[] = [
  { code: 254, name: "Kenya" },
  { code: 255, name: "Tanzania" },
  { code: 256, name: "Uganda" },
  { code: 250, name: "Rwanda" },
  { code: 251, name: "Ethiopia" },
  { code: 234, name: "Nigeria" },
  { code: 233, name: "Ghana" },
  { code: 27, name: "South Africa" },
  { code: 20, name: "Egypt" },
  { code: 212, name: "Morocco" },
  { code: 971, name: "UAE" },
  { code: 44, name: "United Kingdom" },
  { code: 1, name: "United States" },
  { code: 33, name: "France" },
  { code: 49, name: "Germany" },
  { code: 91, name: "India" },
];

export const DEFAULT_ALLOWED = [254, 255, 256, 250, 251, 234, 233, 27];

export const countryName = (code: number) =>
  COUNTRIES.find((c) => c.code === code)?.name ?? String(code);