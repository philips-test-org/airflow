import * as jsc from "jsverify";
import * as R from "ramda";

export const eventGen = jsc.record({
  type: jsc.oneof(jsc.constant("info"), jsc.constant("alert")),
  event: jsc.record({
    id: jsc.int8.smap((x) => Math.abs(x), R.identity),
    event_type: jsc.oneof(jsc.constant("info"), jsc.constant("alert")),
    message: jsc.string,
    displayed: jsc.bool,
  }),
});
