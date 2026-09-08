export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function assertAuthenticated(
  userId: string | null | undefined,
): asserts userId is string {
  if (!userId) throw new HttpError(401, "Unauthenticated");
}

export function objectPath(userId: string, id: string) {
  return `${userId}/${id}`;
}
