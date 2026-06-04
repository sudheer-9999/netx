export const ADMIN_HEADER = "x-admin-key";

/** Change this string to set the admin panel password (/admin). */
export const ADMIN_PASSWORD = "4nGv6E7PFh#!";

export const verifyAdminKey = (key: string | null | undefined): boolean =>
  typeof key === "string" && key.length > 0 && key === ADMIN_PASSWORD;

export const isAdminRequest = (request: Request): boolean =>
  verifyAdminKey(request.headers.get(ADMIN_HEADER));

export const unauthorizedResponse = () =>
  new Response(JSON.stringify({ error: "Unauthorized." }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
