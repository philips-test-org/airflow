// @flow
import {
  GET,
  POST,
} from "./network";

const ENDPOINTS = {
  exams: "/exams",
  exam: (id) => `/exams/${id}`,
  kioskExams: "/exams/kiosk",
  avatar: (userId) => `/avatar/${userId}`,
  events: "/events",
  resourceGroups: "/resource_groups",
  selectedResourceGroup: "/resource_groups/selected",
  currentEmployee: "/employees/current",
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
  fetchExam: fetchExam,
  fetchKioskExams: fetchKioskExams,
  fetchResourceGroups: fetchResourceGroups,
  fetchSelectedResourceGroup: fetchSelectedResourceGroups,
  fetchCurrentEmployee: fetchCurrentEmployee,
}

export default Api;
