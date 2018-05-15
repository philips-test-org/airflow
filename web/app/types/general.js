// @flow

import type {Event} from "./order";

export type ViewType = "calendar" | "kiosk" | "overview"

export type Notification = {
  type?: "flash" | "alert",
  event_type?: "flash" | "alert",
  event: Event | {
    id: string,
    message: string,
    event_type?: "flash" | "alert",
  },
  message?: string,
}
