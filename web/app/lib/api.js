// @flow
import {GET} from "./network";

const ENDPOINTS = {
  exams: "/exams",
}

const fetchExams = (resourceIds: Array<number>) => (
  GET(ENDPOINTS.exams, {resource_ids: resourceIds})
);

const Api = {
  fetchExams: fetchExams,
}

export default Api;
