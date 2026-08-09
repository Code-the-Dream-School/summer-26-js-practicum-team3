import '@github/arianotify-polyfill';

/**
 * Makes an announcement to assistive technology (AT) users. Announcements can be polite or assertive. Polite announcements will wait until the AT tool is idle before announcing the message. Assertive announcements will interrupt the AT tool and announce the message immediately.
 * @param {string} message
 * @param {object} options
 * @param {"high" | "normal"} [options.priority="normal"]
 * @example
 * ```js
 * // Makes a polite announcement.
 * ariaNotify('Hello world');
 * // Makes an assertive announcement
 * ariaNotify('An error happened, world', { priority: 'high' });
 * ```
 */
export const ariaNotify = (message, options, element = document) => {
  element.ariaNotify(message, options);
};
