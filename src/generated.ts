/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    get: {
      responses: {
        /** OK */
        200: unknown
      }
    }
  }
  "/patches": {
    get: {
      parameters: {
        query: {
          /** The patch ID, e.g. `7.00`, `7.28c`, `7.29` */
          id?: parameters["rowFilter.patches.id"]
          links?: parameters["rowFilter.patches.links"]
          createdAt?: parameters["rowFilter.patches.createdAt"]
          releasedAt?: parameters["rowFilter.patches.releasedAt"]
          /** Filtering Columns */
          select?: parameters["select"]
          /** Ordering */
          order?: parameters["order"]
          /** Limiting and Pagination */
          offset?: parameters["offset"]
          /** Limiting and Pagination */
          limit?: parameters["limit"]
        }
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"]
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"]
          /** Preference */
          Prefer?: parameters["preferCount"]
        }
      }
      responses: {
        /** OK */
        200: {
          schema: definitions["patches"][]
        }
        /** Partial Content */
        206: unknown
      }
    }
    post: {
      parameters: {
        body: {
          /** patches */
          patches?: definitions["patches"]
        }
        query: {
          /** Filtering Columns */
          select?: parameters["select"]
        }
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"]
        }
      }
      responses: {
        /** Created */
        201: unknown
      }
    }
    delete: {
      parameters: {
        query: {
          /** The patch ID, e.g. `7.00`, `7.28c`, `7.29` */
          id?: parameters["rowFilter.patches.id"]
          links?: parameters["rowFilter.patches.links"]
          createdAt?: parameters["rowFilter.patches.createdAt"]
          releasedAt?: parameters["rowFilter.patches.releasedAt"]
        }
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"]
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
    patch: {
      parameters: {
        query: {
          /** The patch ID, e.g. `7.00`, `7.28c`, `7.29` */
          id?: parameters["rowFilter.patches.id"]
          links?: parameters["rowFilter.patches.links"]
          createdAt?: parameters["rowFilter.patches.createdAt"]
          releasedAt?: parameters["rowFilter.patches.releasedAt"]
        }
        body: {
          /** patches */
          patches?: definitions["patches"]
        }
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"]
        }
      }
      responses: {
        /** No Content */
        204: never
      }
    }
  }
}

export interface definitions {
  patches: {
    /**
     * The patch ID, e.g. `7.00`, `7.28c`, `7.29`
     *
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: string
    links: string
    createdAt: string
    releasedAt?: string
  }
}

export interface parameters {
  /** Preference */
  preferParams: "params=single-object"
  /** Preference */
  preferReturn: "return=representation" | "return=minimal" | "return=none"
  /** Preference */
  preferCount: "count=none"
  /** Filtering Columns */
  select: string
  /** On Conflict */
  on_conflict: string
  /** Ordering */
  order: string
  /** Limiting and Pagination */
  range: string
  /** Limiting and Pagination */
  rangeUnit: string
  /** Limiting and Pagination */
  offset: string
  /** Limiting and Pagination */
  limit: string
  /** patches */
  "body.patches": definitions["patches"]
  /** The patch ID, e.g. `7.00`, `7.28c`, `7.29` */
  "rowFilter.patches.id": string
  "rowFilter.patches.links": string
  "rowFilter.patches.createdAt": string
  "rowFilter.patches.releasedAt": string
}

export interface operations {}
