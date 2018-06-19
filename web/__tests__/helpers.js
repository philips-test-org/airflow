/* global React setImmediate */
import {mount} from "enzyme";
import {mergeDeepRight} from "ramda";
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

export function mountAirflow(type, startingProps = {}) {
  const props = mergeDeepRight({
    board: {
      type,
      images: {spinner: "http://spinnerUrl"},
      hydrated: false,
    },
    user: {
      ssoUrl: "http://ssoUrl",
      hydrated: false,
    },
  }, startingProps);
  const store = storeFunc(props);

  return {
    airflow: mount(<Airflow store={store} />),
    store,
  };
}
