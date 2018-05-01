// @flow
import React, {Component} from "react";
import * as R from "ramda";
import {DropTarget} from "react-dnd";

import {
  COL_WIDTH,
  ItemTypes,
} from "../../lib/constants";

import {orderComments} from "../../lib/utility";

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
  resourceId: string,
  scrollToCoordinates: (x: number, y: number) => void,
  startDate: number,
  type: "calendar" | "kiosk",
  updateOrderTime: (orderId: number, resourceId: number, newState: Object) => void,
}

type CardPosition = {id: number, top: number, bottom: number};

type State = {
  overlappingCards: Array<{cards: Array<CardPosition>, offset: number}>,
  hasOverlap: boolean,
}

// React DnD setup
const laneTarget = {
  drop(props, monitor) {
    const movementOffset = monitor.getDifferenceFromInitialOffset();
    return {
      targetResourceId: props.resourceId,
      movementDelta: movementOffset,
    }
  }
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
    }
  }

  componentDidMount() {
    this.checkForCardOverlap();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.orders != prevProps.orders) {
      this.checkForCardOverlap();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !R.equals(nextProps, this.props) || !R.equals(nextState, this.state);
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
    const {hasOverlap, overlappingCards} = this.state;
    const tdStyle = isOver ? {opacity: 0.33, backgroundColor: "lightgray"} : {};

    const widthMultiplier = hasOverlap ? this.laneWidthMultiplier(overlappingCards) : 1;
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
      </td>
    )
  }

  renderCards() {
    const Component = this.props.type == "kiosk" ? ScaledCard(KioskNotecard) : DraggableNotecard;
    const {overlappingCards} = this.state;
    const overlaps = R.chain(({offset, cards}) => R.map(({id}) =>  ({offset, id}), cards), overlappingCards);

    return (
      R.map((order) => {
        const isFiltered = R.contains(order.id, this.props.filteredOrderIds);
        const overlapShift = R.find(R.propEq("id", order.id), overlaps);
        const offset = !R.isNil(overlapShift) ? {left: COL_WIDTH * overlapShift.offset} : {};

        return (
          <Component
            key={order.id}
            comments={orderComments(order)}
            isFiltered={isFiltered}
            isFocused={this.props.focusedOrderId === order.id}
            openModal={this.props.openModal}
            offsetStyle={offset}
            order={order}
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

    this.setState({
      overlappingCards,
      hasOverlap: R.length(overlappingCards) > 0,
    });
  }

  cardOverlaps() {
    const cards = R.values(this.cards);
    const positions = R.map(card => {
      const top = card.decoratedComponentInstance.orderTop();
      const height = card.decoratedComponentInstance.orderHeight();
      return {
        id: card.props.order.id,
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
}

export default DropTarget(ItemTypes.NOTECARD, laneTarget, collect)(NotecardLane);
