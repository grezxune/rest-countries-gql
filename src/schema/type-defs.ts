import { mergeTypeDefs } from '@graphql-tools/merge';
import { countryTypeDefs } from '../modules/country/country.type-defs.js';

const baseTypeDefs = /* GraphQL */ `
  type Query {
    _empty: Boolean
  }
`;

export const typeDefs = mergeTypeDefs([baseTypeDefs, countryTypeDefs]);
