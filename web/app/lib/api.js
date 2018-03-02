// @flow
import {
  GET,
  POST,
} from "./network";

const ENDPOINTS = {
  exams: "/exams",
  avatar: (userId) => `/avatar/${userId}`,
  events: "/events",
}

const fetchExams = (resourceIds: Array<number>, date: number) => (
  GET(ENDPOINTS.exams, {resource_ids: resourceIds, date})
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
}

export default Api;
