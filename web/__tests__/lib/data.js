import moment from "moment";

import {orderStopTime} from "../../app/lib/data";

function getStartDate() { return moment().startOf("day").unix() * 1000; }

describe("order duration", () => {
  it("uses procedure_duration when nothing else is present", () => {
    const startDate = getStartDate();
    const order = {procedure: {scheduled_duration: 29}, appointment: startDate};
    expect(orderStopTime(startDate, order)).toEqual(startDate + (29 * 60 * 1000));
  });

  it("uses appointment_duration when rad_exam isn't present", () => {
    const startDate = getStartDate();
    const order = {procedure: {scheduled_duration: 29}, appointment_duration: 5, appointment: startDate};
    expect(orderStopTime(startDate, order)).toEqual(startDate + (5 * 1000));
  });

  it("uses rad_exam end_exam time when present", () => {
    const startDate = getStartDate();
    const endTime = moment();
    const order = {
      procedure: {scheduled_duration: 29},
      appointment_duration: 5,
      rad_exam: {
        rad_exam_time: {end_exam: endTime},
      },
      appointment: startDate,
    };
    expect(orderStopTime(startDate, order)).toEqual(endTime);
  });

  it("uses merged stopTime when present", () => {
    const startDate = getStartDate();
    const endTime = moment();
    const order = {
      merged: true,
      stopTime: endTime,
      procedure: {scheduled_duration: 29},
      appointment_duration: 5,
      rad_exam: {
        rad_exam_time: {end_exam: "banana"},
      },
      appointment: startDate,
    };
    expect(orderStopTime(startDate, order)).toEqual(endTime);
  });
});
