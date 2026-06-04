/** Parse JSON from an API response; handles non-JSON error bodies from server crashes. */
export async function parseApiJson<T extends { error?: string }>(
  res: Response,
): Promise<{ data: T | null; error: string }> {
  const text = await res.text();
  if (!text.trim()) {
    return {
      data: null,
      error: res.ok
        ? "Empty response from server."
        : `Request failed (${res.status}).`,
    };
  }

  try {
    const data = JSON.parse(text) as T;
    if (!res.ok) {
      return {
        data,
        error: data.error ?? `Request failed (${res.status}).`,
      };
    }
    return { data, error: "" };
  } catch {
    return {
      data: null,
      error: res.ok
        ? "Invalid response from server."
        : `Server error (${res.status}). If this is production, ensure BLOB_READ_WRITE_TOKEN is set in Vercel.`,
    };
  }
}
