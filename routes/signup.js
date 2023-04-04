const express = require("express");
const { createUser, createPreferences } = require("../mysql/queries");
const router = express.Router();
const sha256 = require("sha256");

// create new user
router.post("/", async (req, res) => {
  let { name, surname, email, password, preferences } = req.body;

  console.log("Req body", req.body);

  //check we have all the data
  if (name && surname && email && password) {
    password = sha256(process.env.SALT + password);

    const userQuery = createUser();

    const userParams = [name, surname, email, password];

    // insert user info into DB
    const userResult = await req.asyncMySQL(userQuery, userParams);

    if (userResult.affectedRows === 1) {
      const userId = userResult.insertId;

      const prefQuery = createPreferences();

      const vegan = preferences.vegan === "true" ? 1 : 0;
      const vegetarian = preferences.vegetarian === "true" ? 1 : 0;
      const glutenFree = preferences.glutenFree === "true" ? 1 : 0;

      const prefParams = [userId, vegan, vegetarian, glutenFree];

      // insert preferences into DB
      await req.asyncMySQL(prefQuery, prefParams);
      res.status(200).send({ message: "Success - account created!" });
    } else {
      res.status(403).send({ error: "Duplicate entry" });
    }

    return;
  }

  res.status(400).send({ error: "Some data missing" });
});

module.exports = router;
