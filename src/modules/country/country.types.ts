export const regionValues = ['AFRICA', 'AMERICAS', 'ASIA', 'EUROPE', 'OCEANIA'] as const;

export type Region = (typeof regionValues)[number];

export interface CountryModel {
  code: string;
  name: string;
  capital: string | null;
  region: Region | null;
  population: number;
  languages: string[];
}

export type CountryLookupErrorCode = 'INVALID_INPUT' | 'NOT_FOUND' | 'UPSTREAM_ERROR';

export interface CountryLookupError {
  code: CountryLookupErrorCode;
  message: string;
}

export interface CountryLookupResult {
  country: CountryModel | null;
  error: CountryLookupError | null;
}
