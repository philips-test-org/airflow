/* global React */
import {shallow} from "enzyme";
import * as R from "ramda";

import {mergedOrder} from "../mockState/groupedExams";

import OrderModal from "../../app/components/OrderModal";
import ExamDemographics from "../../app/components/OrderModal/ExamDemographics";
import ExamImageLink from "../../app/components/OrderModal/ExamImageLink";

const defaultProps = {
  adjustOrder: () => {},
  avatarMap: {1: "bob.jpg"},
  currentUser: {},
  exams: R.pluck("rad_exam", mergedOrder.orders),
  fetchAvatar: () => {},
  order: mergedOrder,
  orderGroup: mergedOrder.orders,
  resourceMap: {},
  startDate: 1527048000000,
}


describe("<OrderModal>", () => {
  it("renders the correct number of exam image links for patients with multiple visits", () => {
    const wrapper = shallow(
      <OrderModal {...defaultProps} />
    );
    expect(wrapper.find(ExamImageLink).length).toEqual(2);
  });
});

describe("<ExamDemographics>", () => {
  it("renders the correct number of order nav elements for grouped orders", () => {
    const order = defaultProps.order.orders[0];
    const wrapper = shallow(
      <ExamDemographics {...defaultProps} order={order} />
    );
    expect(wrapper.find(".order-nav").length).toEqual(2);
  });


  it("switches demographics when an order nav link is clicked", () => {
    const order = defaultProps.order.orders[0];
    const wrapper = shallow(
      <ExamDemographics {...defaultProps} order={order} />
    );
    expect(wrapper.state().selectedOrder).toEqual(782758);
    wrapper.find("#nav-786179").simulate("click");
    expect(wrapper.state().selectedOrder).toEqual(786179);
  });
});
