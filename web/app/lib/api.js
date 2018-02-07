// @flow
import {GET} from "./network";

const ENDPOINTS = {
  messages: "/messages",
}

const fetchMessages = (topic: string) => (
  GET(ENDPOINTS["messages"], {topic})
)

const Api = {
  fetchMessages: fetchMessages,
}

export default Api;
