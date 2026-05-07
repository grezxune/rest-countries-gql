export const countryTypeDefs = /* GraphQL */ `
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
  }
`;
