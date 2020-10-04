import {
  ConflictError,
  doPost,
  InternalServerError,
  UnauthorizedError,
} from "./apiHelper";
import { AuthToken } from "../models";

export interface Api {
  login(email: string, password: string): Promise<AuthToken>;
  signup(email: string, username: string, password: string): Promise<AuthToken>;
}

export class ApiImpl implements Api {
  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const url = "/auth/login";
    let result: Response;
    try {
      result = await doPost(this._baseUrl + url, {
        email: email,
        password: password,
      });
      return result.json();
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
    const url = "/user";
    let result: Response;
    try {
      result = await doPost(this._baseUrl + url, {
        email: email,
        username: username,
        password: password,
      });
      return result.json();
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

  private _baseUrl: string;
}

export class LoginFailedError extends Error {}
export class DownstreamError extends Error {}
export class UserAlreadyExistsError extends Error {}
