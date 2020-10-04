export async function doPost(url: string, body: Object) {
  return doFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
  });
}

export async function doFetch(
  url: string,
  init: RequestInit
): Promise<Response> {
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

class BadRequestError extends Error {}
export class ConflictError extends Error {}
export class UnauthorizedError extends Error {}
class NotFoundError extends Error {}
export class InternalServerError extends Error {}
