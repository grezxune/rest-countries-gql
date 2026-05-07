import { z } from 'zod';

const RestCountrySchema = z.object({
  cca2: z.string(),
  name: z.object({
    common: z.string(),
  }),
  capital: z.array(z.string()).optional(),
  region: z.string().optional(),
  population: z.number().optional(),
  languages: z.record(z.string(), z.string()).optional(),
});

const RestCountryCollectionSchema = z.array(RestCountrySchema);
const RestCountryPayloadSchema = z.union([RestCountryCollectionSchema, RestCountrySchema]);

export type RestCountryRecord = z.infer<typeof RestCountrySchema>;

export interface RestCountriesApiContract {
  getCountryByCode(code: string): Promise<RestCountryRecord | null>;
}

export class UpstreamServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstreamServiceError';
  }
}

export class RestCountriesApi implements RestCountriesApiContract {
  constructor(private readonly baseUrl: string) {}

  async getCountryByCode(code: string): Promise<RestCountryRecord | null> {
    const countries = await this.fetchCollection(`/alpha/${encodeURIComponent(code)}`, {
      allowNotFound: true,
    });

    return countries[0] ?? null;
  }

  private async fetchCollection(path: string, options: { allowNotFound?: boolean } = {}): Promise<RestCountryRecord[]> {
    const response = await fetch(`${this.baseUrl}${path}`);

    if (response.status === 404 && options.allowNotFound) {
      return [];
    }

    if (!response.ok) {
      throw new UpstreamServiceError(`REST Countries request failed with status ${response.status}`);
    }

    const body: unknown = await response.json();
    const payload = RestCountryPayloadSchema.parse(body);
    return Array.isArray(payload) ? payload : [payload];
  }
}
