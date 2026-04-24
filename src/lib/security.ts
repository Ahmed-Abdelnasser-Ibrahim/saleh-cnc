import xss from "xss";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window as unknown as Parameters<typeof createDOMPurify>[0]);

/**
 * Sanitizes a string to prevent XSS attacks.
 * Uses a combination of xss library and DOMPurify.
 */
export function sanitize(text: string): string {
  if (!text) return "";
  // First pass: DOMPurify to strip dangerous HTML
  const clean = DOMPurify.sanitize(text);
  // Second pass: xss for additional safety
  return xss(clean);
}

/**
 * Sanitizes an object by recursively sanitizing all string values.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) return obj;

  const newObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = (obj as Record<string, unknown>)[key];
    if (typeof value === "string") {
      (newObj as Record<string, unknown>)[key] = sanitize(value);
    } else if (typeof value === "object") {
      (newObj as Record<string, unknown>)[key] = sanitizeObject(value);
    } else {
      (newObj as Record<string, unknown>)[key] = value;
    }
  }

  return newObj as T;
}
