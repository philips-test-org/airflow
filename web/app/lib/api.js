// @flow
import {
  GET,
  POST,
} from "./network";

const ENDPOINTS = {
  exams: "/exams",
  kiosk_exams: "/exams/kiosk",
  avatar: (userId) => `/avatar/${userId}`,
  events: "/events",
}

const fetchExams = (resourceIds: Array<number>, date: number) => (
  GET(ENDPOINTS.exams, {resource_ids: resourceIds, date})
);

const fetchKioskExams = (resourceIds: Array<number>, date: number) => (
  GET(ENDPOINTS.kiosk_exams, {resource_ids: resourceIds, date})
);

const fetchAvatar = (userId: number) => (
  GET(ENDPOINTS.avatar(userId), {})
);

const createEvent = (event: Object) => (
  POST(ENDPOINTS.events, event)
)

const Api = {
  createEvent: createEvent,
  fetchAvatar: fetchAvatar,
  fetchExams: fetchExams,
  fetchKioskExams: fetchKioskExams,
}

export default Api;
