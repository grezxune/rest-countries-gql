import { type AppContext } from '../../context.js';
import { type CountryLookupResult, type CountryModel } from './country.types.js';

interface CountryQueryArgs {
  code: string;
}


export const countryResolvers = {
  Query: {
    country: async (
      _parent: unknown,
      arguments_: CountryQueryArgs,
      _context: AppContext,
    ): Promise<CountryLookupResult> => {
      const normalizedCode = arguments_.code.trim().toUpperCase();

      if (normalizedCode.length !== 2) {
        return {
          country: null,
          error: {
            code: 'INVALID_INPUT',
            message: 'TODO: return a clearer invalid-input message' } };
      }

      // TODO:
      // - fetch the country from the datasource
      // - return NOT_FOUND when the datasource returns null
      // - return UPSTREAM_ERROR when the REST API is unavailable
      // - return the mapped country on success
      throw new Error('TODO: implement Query.country');
    },
  },

  Country: {
    summary: (_country: CountryModel): string => {
      // TODO:
      // - derive a readable summary from the mapped CountryModel
      // - include name, code, region, population, and capital/fallback
      throw new Error('TODO: implement Country.summary');
    } } };
