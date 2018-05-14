// @flow
import {
  GET,
  POST,
} from "./network";

const ENDPOINTS = {
  exams: "/exams",
  kioskExams: "/exams/kiosk",
  personExams: (personId) => `/persons/${personId}/exams`,
  avatar: (userId) => `/avatar/${userId}`,
  events: "/events",
  resourceGroups: "/resource_groups",
  selectedResourceGroup: "/resource_groups/selected",
  currentEmployee: "/employees/current",
}

const fetchExams = (resourceGroup: String, resourceIds: Array<number>, date: number) => (
  GET(ENDPOINTS.exams, {resource_group: resourceGroup, resource_ids: resourceIds, date})
);

const fetchKioskExams = (resourceGroup: String, resourceIds: Array<number>) => (
  GET(ENDPOINTS.kioskExams, {resource_group: resourceGroup, resource_ids: resourceIds})
);

const fetchPersonExams = (personId: number) => (
  GET(ENDPOINTS.personExams(personId), {})
);

const fetchAvatar = (userId: number) => (
  GET(ENDPOINTS.avatar(userId), {})
);

const fetchResourceGroups = () => (
  GET(ENDPOINTS.resourceGroups)
);

const fetchSelectedResourceGroup = () => (
  GET(ENDPOINTS.selectedResourceGroup)
);

const fetchCurrentEmployee = () => (
  GET(ENDPOINTS.currentEmployee)
);

const createEvent = (event: Object) => (
  POST(ENDPOINTS.events, event)
)

const Api = {
  createEvent,
  fetchAvatar,
  fetchExams,
  fetchKioskExams,
  fetchPersonExams,
  fetchResourceGroups,
  fetchSelectedResourceGroup,
  fetchCurrentEmployee,
}

export default Api;
