/* eslint-disable react/prop-types */
/**
 * You will need to try/catch this
 * @param {*} path
 * @param {*} options
 * @returns
 */
export async function baseFetch(path, options) {
  let data = null;
  const res = await fetch(path, options);
  if (!res.ok) {
    throw new Error('Base fetch failed');
  }

  data = await res.json();
  return data;
}

export async function paginationFetch(path, options) {
  let res = null;
  try {
    res = await baseFetch(path, options);
  } catch (error) {
    console.log('pagination caught it', error);
  }
  return res;
}
