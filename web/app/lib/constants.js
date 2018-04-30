// @flow
// Misc. constants used throughout the app.

export const PIXELS_PER_SECOND = 200.0 / 60.0 / 60.0;

export const NAVBAR_OFFSET = 100;

// Notecard lane base column width.
export const COL_WIDTH = 250;

// Would be nice to define here and just use from
// this for the css (without having to use a style prop);
// would make it only require updating in one place.
// Instead, must be updated here and in css.
export const HOURBAR_WIDTH = 50;

export const SCROLL_SPEED = 100;

// Draggable Item types for React-DnD
export const ItemTypes = {
  NOTECARD: "notecard",
};

