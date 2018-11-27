/* global global */
import * as React from "react";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "react-dates/initialize";
import "jest-enzyme";
import "whatwg-fetch";
import fetchMock from "fetch-mock";

import calendarExams from "./mockState/calendarExams";

global.React = React;
global.harbingerjsApmHost = "localhost";
global.harbingerjsApmPort = 4000;
global.harbingerjsRelativeRoot = "/";

enzyme.configure({adapter: new Adapter()});

fetchMock.get("glob:/exams*", calendarExams);
fetchMock.get("/employees/current?", {
  active: true,
  fte: 1,
  id: 21,
  name :"Some Person",
  person_id: 21,
  updated_at: "2017-11-09T14:00:37-05:00",
});
fetchMock.get("glob:/persons/*", []);
