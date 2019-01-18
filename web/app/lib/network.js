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
      if (R.includes("application/json", response.headers.get("content-type"))) {
        return checkAuthenticated(response.json());
      } else {
        try {
          return checkAuthenticated(response.blob());
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
    method: "POST",
    headers: HEADERS,
    credentials: "same-origin",
    //credentials: "include",
    body: JSON.stringify(params),
  }).then((response) => {
    if (response.ok) {
      if (R.includes("application/json", response.headers.get("content-type"))) {
        return checkAuthenticated(response.json());
      } else {
        try {
          return checkAuthenticated(response.blob());
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

const checkAuthenticated = (promise) => {
  promise.then(json => {
    if (R.propEq("authenticated", false, json)) {
      location.reload();
    }
  });
  return promise;
}
