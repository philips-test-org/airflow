// @flow
/* eslint no-console: 0 */
import * as R from "ramda";

const HEADERS = new Headers({
  "Content-Type": "application/json",
  "Accept": "application/json",
})

export const GET = (url: string, params: Object = {}) => {
  let newParams = new URLSearchParams("")
  const queryString = buildQueryString(params, newParams);
  const urlWithParams = `${url}?${queryString}`;
  return fetch(urlWithParams, {
    method: "GET",
    headers: HEADERS,
    credentials: "include",
  }).then((response) => {
    if (response.ok) {
      if (R.contains("application/json", response.headers.get("content-type"))) {
        return response.json();
      } else {
        try {
          return response.blob();
        } catch(error) {
          console.log(error)
        }
      }
    }
  }).catch((error) => {
    console.log(error)
  })
}

const buildQueryString = (params, acc) => {
  const queryBuilder = R.compose(
    R.reduce((acc, [key, val]) => {
      if (R.type(val) == "Array") {
        R.forEach((v) => acc.append(`${key}[]`, v), val);
        return acc;
      }
      acc.append(key, val)
      return acc;
    }, acc),
    R.toPairs
  )
  return queryBuilder(params);
}

