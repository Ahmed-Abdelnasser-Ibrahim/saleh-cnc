import xss from "xss";

/**
 * Sanitizes a string to prevent XSS attacks.
 * Replaced JSDOM/DOMPurify with a lightweight approach using 'xss' library 
 * and manual character escaping to ensure compatibility with Vercel Serverless runtime.
 */
export function sanitize(text: string): string {
  if (!text) return "";

  // 1. Trim whitespace
  let clean = text.trim();

  // 2. Use xss library for robust HTML filtering
  // This works on the server without JSDOM dependency
  clean = xss(clean, {
    whiteList: {}, // Strip all tags by default for most fields
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script"]
  });

  return clean;
}

/**
 * Sanitizes an object by recursively sanitizing all string values.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }

  const newObj = {} as Record<string, unknown>;

  for (const key in obj) {
    const value = (obj as Record<string, unknown>)[key];
    if (typeof value === "string") {
      newObj[key] = sanitize(value);
    } else if (typeof value === "object") {
      newObj[key] = sanitizeObject(value);
    } else {
      newObj[key] = value;
    }
  }

  return newObj as T;
}
