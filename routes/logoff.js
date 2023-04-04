const express = require("express");
const { deleteToken } = require("../mysql/queries");
const router = express.Router();

router.delete("/", async (req, res) => {
  const { token } = req.headers;

  const query = deleteToken();

  const params = [token];

  await req.asyncMySQL(query, params);

  res.status(200).send({
    message: "User successfully logged off!",
  });
});

module.exports = router;
