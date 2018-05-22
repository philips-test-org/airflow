import Calendar from "../../app/components/Calendar";
import BaseNotecard from "../../app/components/Notecard/BaseNotecard";
import OrderModal from "../../app/components/OrderModal";
import * as R from "ramda";

import {flushAllPromises, mountAirflow} from "../helpers";

describe("<BaseNotecard>", () => {
  let airflow;
  let calendar;

  beforeEach(async () => {
    airflow = mountAirflow("calendar");

    await flushAllPromises();
    airflow.update();

    calendar = airflow.find(Calendar);
  });

  it("renders a BaseNotecard for grouped orders with a tab for each order", async () => {
    const groupedCard =
      calendar
        .find(BaseNotecard)
        .filterWhere(n => R.prop("patient_mrn_id", n.prop("order")) == 769712)
        .first();

    expect(airflow.find(OrderModal).exists()).toEqual(false);

    groupedCard.simulate("click");
    expect(airflow.find(OrderModal).exists()).toEqual(true);
    const modal = airflow.find(OrderModal);
    expect(modal.find(".order-tabs li").length).toEqual(2);
  });
});
