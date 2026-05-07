import { describe, expect, it, vi } from 'vitest';
import { type AppContext } from '../src/context.js';
import { type RestCountryRecord, UpstreamServiceError } from '../src/datasources/rest-countries-api.js';
import { createServer } from '../src/server.js';

const countryQuery = /* GraphQL */ `
  query Country($code: ID!) {
    country(code: $code) {
      country {
        code
        name
        capital
        languages
        summary
      }
      error {
        code
        message
      }
    }
  }
`;


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



const createMockContext = () => {
  const getCountryByCode = vi.fn(async (_code: string) => null as RestCountryRecord | null);

  const context: AppContext = {
    dataSources: {
      restCountriesApi: {
        getCountryByCode,
      },
    },
  };

  return {
    context,
    getCountryByCode,
  };
};

const executeSingle = async (query: string, variables: Record<string, unknown>, contextValue: AppContext) => {
  const server = createServer();

  try {
    const response = await server.executeOperation(
      {
        query,
        variables,
      },
      {
        contextValue,
      },
    );

    if (response.body.kind !== 'single') {
      throw new Error('Expected a single GraphQL result.');
    }

    return response.body.singleResult;
  } finally {
    await server.stop();
  }
};

describe('country queries', () => {
  it('returns a mapped country and computed summary for a valid code', async () => {
    const { context, getCountryByCode } = createMockContext();
    getCountryByCode.mockResolvedValue(france);

    const result = await executeSingle(countryQuery, { code: ' fr ' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      country: {
        country: {
          code: 'FR',
          name: 'France',
          capital: 'Paris',
          languages: ['French'],
          summary: 'France (FR) is in Europe. Population: 67,391,582. Capital: Paris.',
        },
        error: null,
      },
    });
    expect(getCountryByCode).toHaveBeenCalledWith('FR');
  });

  it('returns INVALID_INPUT and skips the datasource when the code is malformed', async () => {
    const { context, getCountryByCode } = createMockContext();

    const result = await executeSingle(countryQuery, { code: ' FRA ' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      country: {
        country: null,
        error: {
          code: 'INVALID_INPUT',
          message: 'Country code must be a 2-letter ISO code.',
        },
      },
    });
    expect(getCountryByCode).not.toHaveBeenCalled();
  });

  it('returns NOT_FOUND when the datasource cannot find a country', async () => {
    const { context, getCountryByCode } = createMockContext();
    getCountryByCode.mockResolvedValue(null);

    const result = await executeSingle(countryQuery, { code: 'zz' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      country: {
        country: null,
        error: {
          code: 'NOT_FOUND',
          message: 'No country found for code "ZZ".',
        },
      },
    });
  });

  it('returns UPSTREAM_ERROR when the datasource throws an upstream failure', async () => {
    const { context, getCountryByCode } = createMockContext();
    getCountryByCode.mockRejectedValue(new UpstreamServiceError('boom'));

    const result = await executeSingle(countryQuery, { code: 'fr' }, context);

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      country: {
        country: null,
        error: {
          code: 'UPSTREAM_ERROR',
          message: 'REST Countries is currently unavailable.',
        },
      },
    });
  });
});
