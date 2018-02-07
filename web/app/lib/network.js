// @flow
/* eslint no-console: 0 */

const HEADERS = new Headers({
  "Content-Type": "application/json",
  "Accept": "application/json",
})

export const GET = (url: string, _params: Object) => {
  return fetch(url, {
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
