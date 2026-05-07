export const countryTypeDefs = /* GraphQL */ `
  enum Region {
    AFRICA
    AMERICAS
    ASIA
    EUROPE
    OCEANIA
  }

  enum CountryLookupErrorCode {
    INVALID_INPUT
    NOT_FOUND
    UPSTREAM_ERROR
  }

  type CountryLookupError {
    code: CountryLookupErrorCode!
    message: String!
  }

  type Country {
    code: ID!
    name: String!
    capital: String
    languages: [String!]!
    summary: String!
  }

  type CountryLookupResult {
    country: Country
    error: CountryLookupError
  }

  extend type Query {
    country(code: ID!): CountryLookupResult!
    countriesByRegion(region: Region!, limit: Int = 5): [Country!]!
  }
`;
