// @flow
/* eslint no-console: 0 */
/* global location */
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
    mode: "no-cors",
    method: "GET",
    headers: HEADERS,
    credentials: "include",
  }).then((response) => {
    refreshIfOpaque(response);
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

export const POST = (url: string, params: Object = {}) => {
  const csrfToken = getCSRFToken();
  HEADERS.set("X-CSRF-TOKEN", csrfToken);
  return fetch(url, {
    mode: "no-cors",
    method: "POST",
    headers: HEADERS,
    credentials: "same-origin",
    //credentials: "include",
    body: JSON.stringify(params),
  }).then((response) => {
    refreshIfOpaque(response);
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

const getCSRFToken = () => {
  const selector = document.querySelector("meta[name='csrf-token']");
  if (!selector) {return ""}
  // Can't get flow to recognize this is a meta element.
  // Suppressing the error for now.
  // $FlowFixMe
  return selector.content;
}

// Redirect the user to login if the response is opaque
// (they were logged out and a login page was returned)
const refreshIfOpaque = (response) => {
  if (response.type === "opaque") {
    location.reload();
  }
}
