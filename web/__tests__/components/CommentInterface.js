/* global React */
import {shallow} from "enzyme";

import {mergedOrder} from "../mockState/groupedExams";

import CommentInterface from "../../app/components/OrderModal/CommentInterface";
import Event from "../../app/components/OrderModal/CommentInterface/Event";
import RoundingUpdate from "../../app/components/OrderModal/CommentInterface/RoundingUpdate";
import Comment from "../../app/components/OrderModal/CommentInterface/Comment";

const defaultProps = {
  events: mergedOrder.events,
  fetchAvatar: () => {},
  handleNewComment: (_comment) => {},
  resourceMap: {5: "VHC Main CT-3"},
  user: {
    active: true,
    fte: 1,
    id: 21,
    name :"Some Person",
    person_id: 21,
    updated_at: "2017-11-09T14:00:37-05:00",
  },
}

describe("<CommentInterface>", () => {
  it("renders merged events for a merged order", () => {
    const wrapper = shallow(
      <CommentInterface {...defaultProps} />
    );
    expect(defaultProps.events.length).toEqual(23);
    expect(wrapper.find("#event-list").find(Event).length).toEqual(9);
    expect(wrapper.find("#event-list").find(RoundingUpdate).length).toEqual(1);
  });

  it("renders merged comments for a merged order", () => {
    const wrapper = shallow(
      <CommentInterface {...defaultProps} />
    );
    expect(defaultProps.events.length).toEqual(23);
    expect(wrapper.find("#comment-list").find(Comment).length).toEqual(3);
  });

  it("renders the correct number of merged all events for a merged order", () => {
    const wrapper = shallow(
      <CommentInterface {...defaultProps} />
    );
    expect(defaultProps.events.length).toEqual(23);
    expect(wrapper.find("#combined-events-list").children().length).toEqual(13);
  });
});
