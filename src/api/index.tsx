import HttpClient, {
  ConflictError,
  InternalServerError,
  QueryParams,
  UnauthorizedError,
} from "./client";
import { AuthToken, Post, User } from "../models";
import { SortBy } from "../components/explore";

export interface Api {
  login(email: string, password: string): Promise<AuthToken>;
  signup(email: string, username: string, password: string): Promise<AuthToken>;
  logout(): Promise<void>;
  getPosts(
    sortBy: SortBy,
    offset: number | null,
    limit: number | null
  ): Promise<Array<Post>>;
  newPost(file: File | Blob, text: string): Promise<Post>;
  getAllUsers(): Promise<Array<User>>;
  getUser(publicId: string): Promise<User>;
  getPostsByUser(userPublicId: string): Promise<Array<Post>>;
}

export class ApiImpl implements Api {
  constructor(client: HttpClient) {
    this._client = client;
  }

  setClient(client: HttpClient) {
    this._client = client;
  }

  async getAllUsers(): Promise<Array<User>> {
    const path = `/v1/user`;
    let result: Response;

    try {
      result = await this._client.doGet(path, null);
    } catch (e) {
      throw e;
    }

    return result.json()!!;
  }

  async getPostsByUser(userPublicId: string): Promise<Array<Post>> {
    const path = `/v1/post/${userPublicId}`;
    let result: Response;

    try {
      result = await this._client.doGet(path, null);
    } catch (e) {
      throw e;
    }

    return result.json()!!;
  }

  async getUser(userPublicId: string): Promise<User> {
    const path = `/v1/user/${userPublicId}`;
    let result: Response;

    try {
      result = await this._client.doGet(path, null);
    } catch (e) {
      throw e;
    }
    return result.json()!!;
  }

  async logout(): Promise<void> {
    const path = "/v1/auth/logout";

    try {
      await this._client.doPostJson(path, {});
    } catch (e) {
      throw e;
    }
    return;
  }

  async newPost(file: File | Blob, text: string): Promise<Post> {
    const path = "/v1/post";
    let result: Response;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    try {
      result = await this._client.doPostFormData(path, formData);
    } catch (e) {
      throw e;
    }
    return result.json()!!;
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const url = "/v1/auth/login";
    let result: Response;
    try {
      result = await this._client.doPostJson(url, {
        email: email,
        password: password,
      });
      return result.json()!!;
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        throw new LoginFailedError();
      }
      if (e instanceof InternalServerError) {
        throw new DownstreamError();
      } else {
        throw e;
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
      result = await this._client.doPostJson(url, {
        email: email,
        username: username,
        password: password,
      });
      return result.json()!!;
    } catch (e) {
      if (e instanceof ConflictError) {
        throw new UserAlreadyExistsError();
      } else if (e instanceof InternalServerError) {
        throw new DownstreamError();
      } else {
        throw e;
      }
    }
  }

  async getPosts(
    sortBy: SortBy,
    offset: number | null,
    limit: number | null
  ): Promise<Array<Post>> {
    let result: Response;

    let queryParams: QueryParams = {
      sort_by: sortBy,
    };

    if (limit !== null && offset !== null) {
      queryParams = {
        sort_by: sortBy,
        offset: String(offset),
        limit: String(limit),
      };
    }

    try {
      result = await this._client.doGet("/v1/post", queryParams);
      return result.json();
    } catch (e) {
      if (e instanceof InternalServerError) {
        throw new DownstreamError();
      } else {
        throw e;
      }
    }
  }

  private _client: HttpClient;
}

export class LoginFailedError extends Error {}
export class DownstreamError extends Error {}
export class UserAlreadyExistsError extends Error {}
