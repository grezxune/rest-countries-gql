import { describe, expect, it } from 'vitest';
import { type RestCountryRecord } from '../src/datasources/rest-countries-api.js';
import { mapRestCountryToCountry } from '../src/modules/country/country.mapper.js';

describe('mapRestCountryToCountry', () => {
  it('maps a REST Countries response into the GraphQL model', () => {
    const france: RestCountryRecord = {
      cca2: 'fr',
      name: {
        common: 'France',
      },
      capital: ['Paris'],
      region: 'Europe',
      population: 67391582,
      languages: {
        fra: 'French',
      },
    };

    expect(mapRestCountryToCountry(france)).toEqual({
      code: 'FR',
      name: 'France',
      capital: 'Paris',
      region: 'EUROPE',
      population: 67391582,
      languages: ['French'],
    });
  });

  it('normalizes empty optional values and sorts languages', () => {
    const arcadia: RestCountryRecord = {
      cca2: 'ax',
      name: {
        common: 'Arcadia',
      },
      capital: [],
      region: 'Asia',
      languages: {
        zho: 'Chinese',
        eng: 'English',
      },
    };

    expect(mapRestCountryToCountry(arcadia)).toEqual({
      code: 'AX',
      name: 'Arcadia',
      capital: null,
      region: 'ASIA',
      population: 0,
      languages: ['Chinese', 'English'],
    });
  });
});
