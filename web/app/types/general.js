// @flow

import type {Event} from "./order";

export type ViewType = "calendar" | "kiosk" | "overview"

export type Notification = {
  type: "flash" | "alert",
  event?: Event | Object,
  message?: string,
}
