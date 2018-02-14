// @flow
import {GET} from "./network";

const ENDPOINTS = {
  exams: "/exams",
  avatar: (userId) => `/avatar/${userId}`,
}

const fetchExams = (resourceIds: Array<number>) => (
  GET(ENDPOINTS.exams, {resource_ids: resourceIds})
);

const fetchAvatar = (userId: number) => (
  GET(ENDPOINTS.avatar(userId), {})
);

const Api = {
  fetchAvatar: fetchAvatar,
  fetchExams: fetchExams,
}

export default Api;
