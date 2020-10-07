export default class HttpClient {
  constructor(authToken: string) {
    this._authToken = authToken;
  }

  setAuthToken(authToken: string) {
    this._authToken = authToken;
  }

  async doPost(path: string, body: Object) {
    return this.doFetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    });
  }

  async doGet(path: string, queryParams: QueryParams | null) {
    const pathAndQuery =
      queryParams === null
        ? path
        : path + "?" + this.encodeQueryParams(queryParams);

    return this.doFetch(pathAndQuery, {
      headers: {
        Authorization: this._authToken,
      },
    });
  }

  private encodeQueryParams(queryParams: QueryParams): string {
    return Object.keys(queryParams)
      .map(
        (k) =>
          `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k]!!)}`
      )
      .join("&");
  }

  private async doFetch(url: string, init: RequestInit): Promise<Response> {
    let response: Response;
    try {
      response = await fetch("/api" + url, init);
    } catch (e) {
      throw e;
    }

    if (response.status === 400) {
      throw new BadRequestError();
    } else if (response.status === 401) {
      throw new UnauthorizedError();
    } else if (response.status === 404) {
      throw new NotFoundError();
    } else if (response.status === 500) {
      throw new InternalServerError();
    }

    return response;
  }

  private _authToken: string;
}

interface QueryParams {
  [key: string]: string;
}

class BadRequestError extends Error {}
export class ConflictError extends Error {}
export class UnauthorizedError extends Error {}
export class NotFoundError extends Error {}
export class InternalServerError extends Error {}
