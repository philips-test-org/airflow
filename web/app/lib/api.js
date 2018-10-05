// @flow
import {
  GET,
  POST,
} from "./network";

import {
  APP_ROOT,
} from "./constants";

const ENDPOINTS = {
  exams: `${APP_ROOT}/exams`,
  exam: (id) => `${APP_ROOT}/exams/${id}`,
  kioskExams: `${APP_ROOT}/exams/kiosk`,
  personExams: (personId) => `${APP_ROOT}/persons/${personId}/exams`,
  personEvents: (mrnId) => `${APP_ROOT}/persons/${mrnId}/events`,
  avatar: (userId) => `${APP_ROOT}/avatar/${userId}`,
  events: `${APP_ROOT}/events`,
  currentEmployee: `${APP_ROOT}/employees/current`,
}

const fetchExams = (resourceGroup: String, resourceIds: Array<number>, date: number) => (
  GET(ENDPOINTS.exams, {resource_group: resourceGroup, resource_ids: resourceIds, date})
);

const fetchExam = (id: number, table: string) => (
  GET(ENDPOINTS.exam(id), {table})
);

const fetchKioskExams = (resourceGroup: String, resourceIds: Array<number>) => (
  GET(ENDPOINTS.kioskExams, {resource_group: resourceGroup, resource_ids: resourceIds})
);

const fetchPersonExams = (personId: number) => (
  GET(ENDPOINTS.personExams(personId), {})
);

const fetchPersonEvents = (mrnId: number) => (
  GET(ENDPOINTS.personEvents(mrnId), {})
);

const fetchAvatar = (userId: number) => (
  GET(ENDPOINTS.avatar(userId), {})
);

const fetchCurrentEmployee = () => (
  GET(ENDPOINTS.currentEmployee)
);

async function createEvent(event: Object) {
  let payload = await POST(ENDPOINTS.events, event);
  return Object.assign({}, payload, {order_id: event.order_id})
}

const Api = {
  createEvent,
  fetchAvatar,
  fetchExams,
  fetchExam,
  fetchKioskExams,
  fetchPersonExams,
  fetchPersonEvents,
  fetchCurrentEmployee,
}

export default Api;
