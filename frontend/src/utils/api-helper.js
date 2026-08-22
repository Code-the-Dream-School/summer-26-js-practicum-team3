/**
 * You will need to try/catch this
 * @param {*} path
 * @param {*} options
 * @returns
 * data = await res.json();
 * return data;
 * JSON object. - Do not have to "await" the returned object
 */
export async function baseFetch(path, options) {
  let data = null;
  const res = await fetch(path, options);

  if (!res.ok) {
    let customErrorReport = {};
    let errorPayload = {};

    try {
      errorPayload = await res.json();
      customErrorReport.message =
        errorPayload?.message ||
        errorPayload?.error ||
        'error/message where empty';
      customErrorReport.errorCode = errorPayload.stack;
      customErrorReport.status = errorPayload.status;
      if (errorPayload.details) {
        customErrorReport.details = errorPayload.details;
      }
    } catch (error) {
      customErrorReport = { message: 'base fetch failed somewhere', error };
    }
    throw customErrorReport;
  }

  data = await res.json();
  return data;
}
