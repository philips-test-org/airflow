/* global React setImmediate */
import {mount} from "enzyme";
import storeFunc from "../app/lib/store";
import Airflow from "../app/components/Airflow";

/* Async function that will finish execution after all promises have been finished
 * Usage:
 *   it('...', async () =. {
 *     // mount component
 *     // execute actions
 *     await flushAllPromises();
 *     // execute assertions for async actions
 *   });
 */
export function flushAllPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

export function mountAirflow(type) {
  const props = {
    board: {
      type,
      images: {spinner: "http://spinnerUrl"},
      hydrated: false,
    },
    user: {
      ssoUrl: "http://ssoUrl",
      hydrated: false,
    },
  };
  const store = storeFunc(props);

  return {
    airflow: mount(<Airflow store={store} />),
    store,
  };
}
