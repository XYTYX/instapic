import HttpClient, {
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} from "./client";
import { AuthToken, Post } from "../models";
import { SortBy } from "../App";

export interface Api {
  login(email: string, password: string): Promise<AuthToken>;
  signup(email: string, username: string, password: string): Promise<AuthToken>;
  getPosts(sortBy: SortBy): Promise<Array<Post>>;
}

export class ApiImpl implements Api {
  constructor(client: HttpClient) {
    this._client = client;
  }

  setClient(client: HttpClient) {
    this._client = client;
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const url = "/v1/auth/login";
    let result: Response;
    try {
      result = await this._client.doPost(url, {
        email: email,
        password: password,
      });
      return result.json()!!;
    } catch (e) {
      switch (e) {
        case e instanceof UnauthorizedError: {
          throw new LoginFailedError();
        }
        case e instanceof InternalServerError: {
          throw new DownstreamError();
        }
        default: {
          throw e;
        }
      }
    }
  }

  async signup(
    email: string,
    username: string,
    password: string
  ): Promise<AuthToken> {
    const url = "/v1/user";
    let result: Response;
    try {
      result = await this._client.doPost(url, {
        email: email,
        username: username,
        password: password,
      });
      return result.json()!!;
    } catch (e) {
      switch (e) {
        case e instanceof ConflictError: {
          throw new UserAlreadyExistsError();
        }
        default: {
          throw e;
        }
      }
    }
  }

  async getPosts(sortBy: SortBy): Promise<Array<Post>> {
    let result: Response;

    const queryParams = {
      sort_by: SortBy.MOST_RECENT,
    };

    try {
      result = await this._client.doGet("/v1/post", queryParams);
      return result.json();
    } catch (e) {
      throw e;
    }
  }

  private _client: HttpClient;
}

export class LoginFailedError extends Error {}
export class DownstreamError extends Error {}
export class UserAlreadyExistsError extends Error {}
