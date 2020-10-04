export default class HttpClient {
  constructor(hostname: string, authToken: string) {
    this._hostname = hostname;
    this._authToken = authToken;
  }

  setAuthToken(authToken: string) {
    this._authToken = authToken;
  }

  async doPost(path: string, body: Object) {
    return this.doFetch(this._hostname + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(body),
    });
  }

  async doGet(
    path: string,
    queryParams: Map<string, string>,
    init: Omit<RequestInit, "headers">
  ) {
    let url = new URL(this._hostname + path);
    queryParams.forEach((v, k) => url.searchParams.append(k, v));

    return this.doFetch(url.toString(), {
      ...init,
      headers: {
        Authorization: this._authToken,
      },
    });
  }

  private async doFetch(url: string, init: RequestInit): Promise<Response> {
    let response: Response;
    try {
      response = await fetch(url, init);
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

  private _hostname: string;
  private _authToken: string;
}

class BadRequestError extends Error {}
export class ConflictError extends Error {}
export class UnauthorizedError extends Error {}
export class NotFoundError extends Error {}
export class InternalServerError extends Error {}
