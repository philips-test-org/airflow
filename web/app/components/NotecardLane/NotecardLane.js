// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {DropTarget} from "react-dnd";
import moment from "moment";

import {
  COL_WIDTH,
  ItemTypes,
  PIXELS_PER_SECOND,
  getOrderComments,
} from "../../lib";

import ScaledCard from "../Notecard/ScaledCard";
import DraggableNotecard from "../Notecard";
import KioskNotecard from "../Notecard/KioskNotecard";

import type {Order} from "../../types";

type Props = {
  connectDropTarget: Function,
  filteredOrderIds: Array<Order>,
  focusedOrderId: number,
  header: string,
  isOver: boolean,
  orders: Array<Order>,
  openModal: (Order) => void,
  movedOrder: Order,
  movementOffset: {x: number, y: number},
  removeOrders: (orderIds: Array<number>) => void,
  resourceId: number,
  updateWidthMultiplier: (resourceId: number, widthMultiplier: number) => void,
  scrollToCoordinates: (x: number, y: number) => void,
  showGhostEndTime: boolean,
  startDate: number,
  type: "calendar" | "kiosk",
  updateOrderTime: (orderId: number, resourceId: number, newState: Object) => void,
  updateWidth: () => void,
}

type CardPosition = {id: number, top: number, bottom: number};

type State = {
  overlappingCards: Array<{cards: Array<CardPosition>, offset: number}>,
  hasOverlap: boolean,
  widthMultiplier: number,
  ghostTop: number,
  ghostHeight: number,
}

// React DnD setup
const laneTarget = {
  drop(props, monitor) {
    const movementOffset = monitor.getDifferenceFromInitialOffset();
    return {
      targetResourceId: props.resourceId,
      movementDelta: movementOffset,
      scrollTopStart: monitor.getItem().scrollTopStart,
    }
  },
  hover(props, monitor, component) {
    const scrollTopStart = monitor.getItem().scrollTopStart;
    const element = document.getElementById("board");

    const currnetScrollTop = element ? element.scrollTop : 0;

    const movementDelta = monitor.getDifferenceFromInitialOffset();
    const newTop = R.max(0, monitor.getItem().orderTop + movementDelta.y - (scrollTopStart - currnetScrollTop));
    const orderHeight = monitor.getItem().orderHeight;

    component.setGhost(newTop, orderHeight);
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    movementOffset: monitor.getClientOffset(),
    movedOrder: monitor.getItem(),
  };
}

// React component
class NotecardLane extends Component<Props, State> {
  lane: ?HTMLElement;
  cards: {[number]: HTMLElement};

  constructor(props: Props) {
    super(props);
    this.cards = {};

    this.state = {
      hasOverlap: false,
      overlappingCards: [],
      widthMultiplier: 0,
      ghostTop: 0,
      ghostHeight: 0,
    }
  }

  componentDidMount() {
    this.checkForCardOverlap();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.orders != prevProps.orders) {
      this.checkForCardOverlap();
    }

    if (this.state.widthMultiplier != prevState.widthMultiplier) {
      this.props.updateWidth();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const omitFns = R.omit(["updateWidth"]);
    return !R.equals(omitFns(nextProps), omitFns(this.props)) || !R.equals(nextState, this.state);
  }

  scrollToY = (y: number) => {
    if (this.lane) {
      const x = this.lane.offsetLeft;
      this.props.scrollToCoordinates(x, y);
    }
  };

  render() {
    if (this.props.type === "kiosk") {
      return this.renderLane();
    }
    return this.props.connectDropTarget(this.renderLane());
  }

  renderLane() {
    const {isOver, header} = this.props;
    const {widthMultiplier} = this.state;
    const tdStyle = isOver ? {opacity: 0.33, backgroundColor: "lightgray"} : {};

    const width = COL_WIDTH * widthMultiplier;
    const thStyle = {width, minWidth: width};

    return (
      <td
        key={`${header}-lane`}
        className="relative-column"
        style={thStyle}
        ref={el => {if (el) this.lane = el}}
      >
        <div className="markers" style={tdStyle}>
          {R.map((hour) => {
            return (
              <div key={`${hour}-marker`} className="row-marker"></div>
            )
          }, R.range(0, 48))}
        </div>
        <div>
          {this.renderCards()}
        </div>
        {isOver && this.renderGhostCard()}
      </td>
    )
  }

  renderGhostCard() {
    const ghostStyle = {
      top: this.state.ghostTop,
      height: this.state.ghostHeight,
    };

    const heightToTime = (top) => this.props.startDate + (top / PIXELS_PER_SECOND * 1000);
    const orderStartTime = heightToTime(this.state.ghostTop);
    const orderStopTime = heightToTime(this.state.ghostTop + this.state.ghostHeight);
    const startTimeFormatted = moment(orderStartTime).format("kk:mm");
    const stopTimeFormatted = moment(orderStopTime).format("kk:mm");

    return (
      <div className="ghost-card" style={ghostStyle}>
        <div>
          <p className="start-time">{startTimeFormatted}</p>
          {this.props.showGhostEndTime &&
            <p className="stop-time">{stopTimeFormatted}</p>
          }
        </div>
      </div>
    );
  }

  renderCards() {
    const Component = this.props.type == "kiosk" ? ScaledCard(KioskNotecard) : DraggableNotecard;
    const {overlappingCards} = this.state;
    const overlaps = R.chain(({offset, cards}) => R.map(({id}) =>  ({offset, id}), cards), overlappingCards);

    return (
      R.map((order) => {
        const isFiltered = order.merged ?
          R.any((order) => R.contains(order.id, this.props.filteredOrderIds), order.orders) :
          R.contains(order.id, this.props.filteredOrderIds);
        const overlapShift = R.find(R.propEq("id", order.id), overlaps);
        const offset = !R.isNil(overlapShift) ? {left: COL_WIDTH * overlapShift.offset} : {};

        return (
          <Component
            key={order.id}
            comments={getOrderComments(order)}
            isFiltered={isFiltered}
            isFocused={this.props.focusedOrderId === order.id}
            openModal={this.props.openModal}
            offsetStyle={offset}
            order={order}
            removeOrders={this.props.removeOrders}
            resourceId={this.props.resourceId}
            scrollToY={this.scrollToY}
            startDate={this.props.startDate}
            type={this.props.type}
            updateOrderTime={this.props.updateOrderTime}
            ref={e => {this.cards[order.id] = e}}
          />
        );
      }, this.props.orders)
    );
  }

  checkForCardOverlap() {
    const overlappingCards = R.compose(
      R.chain(this.prettyPrint),
      R.pluck("overlapping")
    )(this.cardOverlaps());
    const hasOverlap = R.length(overlappingCards) > 0;
    const widthMultiplier = hasOverlap ? this.laneWidthMultiplier(overlappingCards) : 1;

    this.props.updateWidthMultiplier(this.props.resourceId, widthMultiplier)

    this.setState({
      overlappingCards,
      hasOverlap,
      widthMultiplier,
    });
  }

  cardOverlaps() {
    const cards = R.values(this.cards);
    const positions = R.map(card => {
      let top;
      let height;
      if (R.has("decoratedComponentInstance", card)) {
        top = card.decoratedComponentInstance.orderTop();
        height = card.decoratedComponentInstance.orderHeight();
      } else {
        top = card.orderTop();
        height = card.orderHeight();
      }
      return {
        id: card.props.order.id,
        groupingId: card.props.order.groupIdentity,
        top,
        bottom: top + height,
      };
    }, R.reject(R.isNil, cards));

    return R.compose(
      this.overlapFold,
      R.reject(([{id: id1}, {id: id2}]) => id1 == id2),
      R.xprod(positions)
    )(positions);
  }

  overlapFold = R.reduce((acc, [x, y]) => {
    const overlap = this.overlaps(x, y);
    // Don't care if there is no overlap.
    if (!overlap) return acc;

    const lastOverlap = R.head(acc);
    // If this is the first overlap, wrap it in a list and return it.
    const overlapObj = {overlapping: [x, y]};
    if (R.isNil(lastOverlap)) return [overlapObj];

    // Check if the first value in the pair to is already overlapping other orders.
    const overlappingIds = R.pluck("id", lastOverlap.overlapping);
    const multi = R.any((id) => R.contains(id, [x.id, y.id]), overlappingIds);
    if (multi) {
      const overlapper = R.find(({id}) => R.not(R.contains(id, overlappingIds)), [x, y]);
      if (overlapper) {
        let obj = {overlapping: R.append(overlapper, lastOverlap.overlapping)};
        // Return a new list of overlap objects with the multi overlap object updated at the head.
        return R.prepend(obj, R.tail(acc));
      } else {return acc}
    }

    return R.prepend(overlapObj, acc);
  }, []);

  // Scalar to multiply lane width by based on max overlap columns.
  laneWidthMultiplier = R.compose(
    R.reduce(R.max, 0),
    R.map(R.inc),
    R.pluck("offset")
  );

  overlaps = (card1: CardPosition, card2: CardPosition): boolean => {
    const twoInOne = (card2.top >= card1.top) && (card2.top <= card1.bottom);
    const oneInTwo = (card1.top >= card2.top) && (card1.top <= card2.bottom);
    return twoInOne || oneInTwo;
  };

  noOverlap = (x, y) => R.not(this.overlaps(x, y));

  addCard = ({offset, cards}, card) => ({offset, cards: R.append(card, cards)});

  // Check whether a card doesn't overlap any other cards in a column.
  canPutInLane = ({cards}, card) => {
    if (R.isEmpty(cards) || R.isNil(cards)) return true;
    return R.all((c) => this.noOverlap(card, c), cards);
  };

  prettyPrintFold = (columns, card, offset) => {
    // Determines whether a card can go into a column in the lane
    // based on it's position vs positions of others already in the
    // lane. If there is overlap with cards already in the column
    // then recursively try to put it in the remaining columns that
    // make up the lane. If it doesn't fit in any of the columns that
    // have already been added, adds it in a new column.
    if (R.isEmpty(columns) || R.isNil(columns)) {
      return [{offset, cards: [card]}];
    }

    const h = R.head(columns);
    const t = R.tail(columns);
    if (this.canPutInLane(h, card)) {
      return R.prepend(this.addCard(h, card), t);
    } else {
      return R.prepend(h, this.prettyPrintFold(t, card, offset + 1));
    }
  };

  // Divides cards into columns inside the lane based on which ones actually overlap
  // while trying to minimize the total width of the lane.
  prettyPrint = R.reduce((acc, card) => (this.prettyPrintFold(acc, card, 0)), [{offset: 0, cards: []}]);

  setGhost = (ghostTop, ghostHeight) => {
    this.setState({ghostTop, ghostHeight});
  }
}

export default DropTarget(ItemTypes.NOTECARD, laneTarget, collect)(NotecardLane);
