export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const logger = (req, res, next) => {
  const t = Date.now();
  res.on('finish', () => console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - t}ms`));
  next();
};
export const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
export const errorHandler = (err, req, res, next) => {
  let code = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;
  if (err.name === 'CastError') { code = 400; message = 'Invalid ID'; }
  if (err.name === 'ValidationError') code = 400;
  if (err.code === 11000) { code = 400; message = 'Already exists (duplicate)'; }
  console.error('ERROR:', message);
  res.status(code).json({ message });
};
export const fail = (res, code, msg) => { res.status(code); throw new Error(msg); };
