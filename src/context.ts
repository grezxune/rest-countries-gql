import { RestCountriesApi, type RestCountriesApiContract } from './datasources/rest-countries-api.js';

export interface AppContext {
  dataSources: {
    restCountriesApi: RestCountriesApiContract;
  };
}

export const createContext = (): AppContext => ({
  dataSources: {
    restCountriesApi: new RestCountriesApi(),
  },
});
