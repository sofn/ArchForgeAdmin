const FALLBACK_MESSAGE = "操作失败";

/** Business failure payload: `{code,message,data}` with code≠0 or RFC 9457 ProblemDetail returned with HTTP 200. */
export class EnvelopeError extends Error {
  readonly code?: unknown;

  constructor(message: string, code?: unknown) {
    super(message);
    this.name = "EnvelopeError";
    this.code = code;
  }
}

/**
 * Throws {@link EnvelopeError} when `res` is an error envelope
 * (`{code,message,data}` with `code !== 0`) or an unwrapped ProblemDetail
 * (`title`/`detail`/`status`, no `data` field); returns `res` otherwise.
 */
export function assertOk<T>(res: T): T {
  if (!res || typeof res !== "object") return res;
  const payload = res as Record<string, unknown>;
  const isEnvelopeError = payload.code !== undefined && payload.code !== 0;
  const isProblemDetail =
    !("data" in payload) &&
    "title" in payload &&
    "detail" in payload &&
    "status" in payload;
  if (isEnvelopeError || isProblemDetail) {
    throw new EnvelopeError(
      String(payload.message || payload.detail || FALLBACK_MESSAGE),
      payload.code
    );
  }
  return res;
}
