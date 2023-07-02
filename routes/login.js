const express = require("express");
const { checkCreds, addToken } = require("../mysql/queries");
const { getUniqueId } = require("../utils");
const router = express.Router();
const sha256 = require("sha256");

router.post("/", async (req, res) => {
  let { email, password } = req.body;

  // check that username and password match details on system
  if (!email || !password) {
    return res.status(404).send({ error: "Email and password are required." });
  }

  // hash password with salt
  password = sha256(process.env.SALT + password);

  // check user exists with given email/password combo
  const query = checkCreds();

  const params = [email, password];

  const results = await req.asyncMySQL(query, params);

  // if credentials don't match, return
  if (results.length === 0) {
    res.status(401).send({ error: "Invalid login credentials" });
    return;
  }

  const token = getUniqueId(64);

  const secondQuery = addToken();

  const secondParams = [results[0].id, token];

  await req.asyncMySQL(secondQuery, secondParams);

  res.status(200).send({
    message: "User successfully logged in",
    token: token,
  });
});

module.exports = router;
