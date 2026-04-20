
export const logger = (req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next(); //move on to the next middleware or route
};

export const timestamp = (req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  console.log("Request Time:", req.requestTime);
  next();
};


export default {logger, timestamp};