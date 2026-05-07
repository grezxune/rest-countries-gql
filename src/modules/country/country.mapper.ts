import { type RestCountryRecord } from '../../datasources/rest-countries-api.js';
import { type CountryModel } from './country.types.js';

export const mapRestCountryToCountry = (_country: RestCountryRecord): CountryModel => {
  // TODO:
  // - map the REST Countries DTO to the GraphQL-facing CountryModel
  // - convert empty optional values to null where appropriate
  // - sort languages alphabetically
  throw new Error('TODO: implement mapRestCountryToCountry');
};
