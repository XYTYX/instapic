import { doFetch } from "./apiHelper";
import { Login } from "./models";

export interface Api {
  login(email: string, password: string): Promise<Login>;
}

export function ApiImpl(baseUrl: string): Api {
  async function login(email: string, password: string): Promise<Login> {
    const url = "/auth/login";
    const result = await doFetch(baseUrl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    return result.json();
  }

  return { login };
}
