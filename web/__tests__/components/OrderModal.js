/* global React */
import {shallow} from "enzyme";
import * as R from "ramda";

import {mockExams, orderGroups} from "../mockState/groupedExams";

import OrderModal from "../../app/components/OrderModal";
import ExamDemographics from "../../app/components/OrderModal/ExamDemographics";
import ExamImageLink from "../../app/components/OrderModal/ExamImageLink";

const defaultProps = {
  adjustOrder: () => {},
  avatarMap: {1: "bob.jpg"},
  currentUser: {},
  exams: mockExams,
  fetchAvatar: () => {},
  order: R.find(R.propEq("id", 781787), mockExams),
  orderGroup: orderGroups,
  resourceMap: {},
  startDate: 1527048000000,
}


describe("<OrderModal>", () => {
  it("renders the correct number of exam image links for patients with multiple visits", () => {
    const wrapper = shallow(
      <OrderModal {...defaultProps} />
    );
    expect(wrapper.find(ExamImageLink).length).toEqual(3);
  });
});

describe("<ExamDemographics>", () => {
  it("renders the correct number of order nav elements for grouped orders", () => {
    const wrapper = shallow(
      <ExamDemographics {...defaultProps} />
    );
    expect(wrapper.find(".order-nav").length).toEqual(2);
  });


  it("switches demographics when an order nav link is clicked", () => {
    const wrapper = shallow(
      <ExamDemographics {...defaultProps} />
    );
    expect(wrapper.state().selectedOrder).toEqual(781787);
    wrapper.find("#nav-781786").simulate("click");
    expect(wrapper.state().selectedOrder).toEqual(781786);
  });
});
