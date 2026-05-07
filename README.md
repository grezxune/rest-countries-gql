# TypeScript + GraphQL Exercise

## Overview

You are joining a codebase that exposes a small GraphQL API over a REST datasource. The project shape is intentionally similar to how we structure this kind of work in production:

- GraphQL schema is split into feature modules
- resolvers are composed centrally
- downstream APIs are accessed through a typed datasource on the GraphQL context
- external DTOs are mapped into a GraphQL-facing model instead of leaking raw API responses into resolvers
- tests cover both pure mapping logic and GraphQL behavior

The goal of this exercise is to finish a partially implemented GraphQL feature using TypeScript.

## Timebox

This exercise is designed to take roughly **30 to 40 minutes** for a strong candidate.

You do not need to build everything from scratch. Most of the scaffolding is already in place. The important part is how you structure the implementation, model the data, and handle edge cases cleanly.

## What You Are Building

You are implementing a small GraphQL service backed by the public [REST Countries API](https://restcountries.com/).

Use this REST API base URL when wiring the datasource:

```text
https://restcountries.com/v3.1
```

The schema exposes:

- `country(code: ID!): CountryLookupResult!`

The public `Country` type should stay intentionally small:

- `code`
- `name`
- `capital`
- `languages`
- `summary`

The service already includes:

- Apollo Server wiring
- modular SDL composition
- a REST datasource with typed response parsing
- tests that describe the expected behavior

## Your Task

Make the supplied tests pass by completing the missing implementation.

The core work is in:

- `src/context.ts`
- `src/modules/country/country.mapper.ts`
- `src/modules/country/country.resolver.ts`

You may edit other files if you think it improves the solution, but the main path should stay within these files.

## Functional Requirements

### 1. `country(code)`

Implement the `country` query resolver with the following behavior:

- Treat the incoming `code` as a 2-letter ISO country code
- normalize it by trimming whitespace and uppercasing it
- if the normalized value is not exactly 2 characters, return:
  - `country: null`
  - `error.code: INVALID_INPUT`
- if the datasource returns no match, return:
  - `country: null`
  - `error.code: NOT_FOUND`
- if the datasource succeeds, return:
  - `country` mapped into the GraphQL model
  - `error: null`
- if the downstream REST API is unavailable, return:
  - `country: null`
  - `error.code: UPSTREAM_ERROR`

### 2. `Country.summary`

Implement a computed GraphQL field called `summary`.

It should be derived from the mapped `Country` object and should include:

- the country name
- the country code
- the region, when available
- the population formatted for humans
- the capital, or a sensible fallback if capital data is missing

You do not need to match a perfect prose style, but the output should read naturally and be deterministic.

### 3. REST DTO Mapping

Implement the mapper in `country.mapper.ts`.

The mapper should convert the REST Countries response into the GraphQL-facing model and handle optional data sensibly.

Expected mapping behavior:

- `code` comes from `cca2`
- `name` comes from `name.common`
- `capital` should be the first capital in the REST array, or `null`
- `region` should be converted from the REST string into the internal model enum value when possible
- `population` should default to `0` if the source value is missing, so `summary` can be deterministic
- `languages` should be returned as a sorted array of language names

## What Is Already Provided

- a working Apollo server bootstrap
- a `RestCountriesApi` datasource class
- Zod-based response parsing for the external API
- tests for both mapping and GraphQL queries

This means you should not need to spend time on:

- wiring the GraphQL server
- inventing new architecture
- building a REST client from scratch

The datasource class is present, but the REST Countries base URL is intentionally not wired into it yet.

## How To Run

Install dependencies:

```bash
pnpm install
```

Run the tests:

```bash
pnpm test
```

Run the type checker:

```bash
pnpm run typecheck
```

Start the server locally:

```bash
pnpm run dev
```

The server will start on `http://localhost:4000/`.

## Example Query

```graphql
query Example {
  country(code: " fr ") {
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
```

## What We Care About

- clear TypeScript modeling
- resolver logic that is easy to follow
- good separation between fetching, mapping, and GraphQL behavior
- pragmatic edge-case handling
- clean, readable code

## What We Are Not Looking For

- over-engineering
- unnecessary abstractions
- large framework changes
- excessive time spent on tooling or stylistic polish

## If You Finish Early

If you have time left, you can improve the solution with one or more of the following:

- add one extra focused test
- improve error messaging
- make the summary formatting slightly more polished
- tighten any types that feel too loose

## Submission Guidance

Please leave the project in a runnable state where:

- `pnpm test` completes successfully
- `pnpm run typecheck` succeeds

If you make any assumptions, note them briefly in the code or in a short written note.
