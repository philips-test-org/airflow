// @flow
import {
  GET,
  POST,
} from "./network";

const ENDPOINTS = {
  exams: "/exams",
  kioskExams: "/exams/kiosk",
  avatar: (userId) => `/avatar/${userId}`,
  events: "/events",
  resourceGroups: "/resource_groups",
  selectedResourceGroup: "/resource_groups/selected",
  currentEmployee: "/employees/current",
}

const fetchExams = (resourceIds: Array<number>, date: number) => (
  GET(ENDPOINTS.exams, {resource_ids: resourceIds, date})
);

const fetchKioskExams = (resourceIds: Array<number>) => (
  GET(ENDPOINTS.kioskExams, {resource_ids: resourceIds})
);

const fetchAvatar = (userId: number) => (
  GET(ENDPOINTS.avatar(userId), {})
);

const fetchResourceGroups = () => (
  GET(ENDPOINTS.resourceGroups)
);

const fetchSelectedResourceGroups = () => (
  GET(ENDPOINTS.selectedResourceGroup)
);

const fetchCurrentEmployee = () => (
  GET(ENDPOINTS.currentEmployee)
);

const createEvent = (event: Object) => (
  POST(ENDPOINTS.events, event)
)

const Api = {
  createEvent: createEvent,
  fetchAvatar: fetchAvatar,
  fetchExams: fetchExams,
  fetchKioskExams: fetchKioskExams,
  fetchResourceGroups: fetchResourceGroups,
  fetchSelectedResourceGroup: fetchSelectedResourceGroups,
  fetchCurrentEmployee: fetchCurrentEmployee,
}

export default Api;
