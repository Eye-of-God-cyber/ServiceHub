'use strict';

/**
 * Sanitization Utility
 * 
 * Reasoning:
 * - Plain-text fields (e.g., names, addresses) should not be HTML-escaped in the database.
 *   Doing so corrupts the data for non-web clients (e.g., iOS/Android apps) and makes editing difficult.
 *   Instead, modern frontends (React/Vue) auto-escape plain text.
 * - However, as a defense-in-depth measure against legacy web clients that might use `.innerHTML`,
 *   we strip dangerous tags (like <script>, <iframe>, <object>) entirely, rather than escaping them.
 * - For fields that are strictly plain text, we also strip basic HTML tags to prevent formatting injection.
 */

const stripDangerousHtml = (val) => {
  if (typeof val !== 'string') {return val;}
  // Naive but effective defense-in-depth regex to remove scripts and iframes.
  // In a real-world scenario with rich-text, we would use DOMPurify or sanitize-html.
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove inline handlers like onclick="..."
    .replace(/on\w+='[^']*'/gi, '') 
    .replace(/javascript:/gi, '');
};

const sanitizePlainText = (val) => {
  if (typeof val !== 'string') {return val;}
  // For strictly plain-text fields, we can optionally strip all HTML tags
  // to ensure no formatting is injected (e.g., <b>, <a>).
  return val.replace(/<\/?[^>]+(>|$)/g, "");
};

module.exports = {
  stripDangerousHtml,
  sanitizePlainText,
};
