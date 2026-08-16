import DOMPurify from 'dompurify';

export default function sanitizeInput(input) {
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
