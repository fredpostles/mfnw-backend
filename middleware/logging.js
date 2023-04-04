const fs = require("fs");

module.exports.addToLog = (req, res, next) => {
  const log = `${new Date().toString()} | Headers: ${JSON.stringify(
    req.headers
  )} | Body: ${JSON.stringify(req.body)}\r\n`;

  fs.appendFile("log.txt", log, (error) => {
    if (error) {
      console.log(error);
    }
  });

  next();
};
