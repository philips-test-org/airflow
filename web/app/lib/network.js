// @flow
/* eslint no-console: 0 */
import * as R from "ramda";

const HEADERS = new Headers({
  "Content-Type": "application/json",
  "Accept": "application/json",
})

export const GET = (url: string, params: Object) => {
  const queryString = buildQueryString(params);
  const urlWithParams = `${url}?${queryString}`;
  return fetch(urlWithParams, {
    method: "GET",
    headers: HEADERS,
    credentials: "include",
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
  }).catch((error) => {
    console.log(error)
  })
}

const buildQueryString = R.compose(
  R.reduce((acc, [key, val]) => {
    if (R.type(val) == "Array") {
      R.forEach((v) => acc.append(`${key}[]`, v), val);
      return acc;
    }
    acc.append(key, val)
    return acc;
  }, new URLSearchParams("")),
  R.toPairs
)
