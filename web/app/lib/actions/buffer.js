// @flow

const BufferActions = {
  // Middleware
  BUFFER_ENQUEUE: "BUFFER_ENQUEUE",
  FLUSH_BUFFER: "FLUSH_BUFFER",
  // Reducer
  BUFFER_MESSAGE: "BUFFER_MESSAGE",
  RESET_BUFFER: "RESET_BUFFER",
}

const bufferEnqueue = (table: string, affectedId: number, payload: Object) => ({
  type: BufferActions.BUFFER_ENQUEUE,
  table,
  affectedId,
  payload,
});

// Empty the message buffer.
const flushBuffer = () => ({
  type: BufferActions.FLUSH_BUFFER,
});

// Add a payload to the message buffer.
const bufferMessage = (queue: string, payload: Object) => ({
  type: BufferActions.BUFFER_MESSAGE,
  queue,
  payload,
});

const resetBuffer = () => ({
  type: BufferActions.RESET_BUFFER,
});

export {
  BufferActions,
  bufferEnqueue,
  flushBuffer,
  bufferMessage,
  resetBuffer,
};
