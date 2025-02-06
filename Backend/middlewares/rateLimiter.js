import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes ---> change it to 15 later
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many requests. Please try again after 15 minutes.',
});

export default rateLimiter;

