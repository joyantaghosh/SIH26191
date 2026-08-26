/**
 * Wraps an async express route/controller handler and forwards
 * any rejected promise to the next() error middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
