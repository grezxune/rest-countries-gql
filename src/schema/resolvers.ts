import { mergeResolvers } from '@graphql-tools/merge';
import { countryResolvers } from '../modules/country/country.resolver.js';

export const resolvers = mergeResolvers([countryResolvers]);
