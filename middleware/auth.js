const { checkToken } = require("../mysql/queries");

module.exports.checkToken = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    res.status(401).send({ error: "Token not set" });
    return;
  }

  const query = checkToken();

  const params = [token];

  const results = await req.asyncMySQL(query, params);

  console.log("Results in checkToken", results[0]);

  if (results.length) {
    req.userId = results[0].id; // attach user ID to request
    console.log("req.userId in checkToken", results[0].id);
    next();
  } else {
    res.status(403).send({ error: "Invalid token!" });
  }
};
