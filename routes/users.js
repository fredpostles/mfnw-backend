const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  updatePreferences,
} = require("../mysql/queries");
const router = express.Router();
const sha256 = require("sha256");

// get user info
router.get("/", async (req, res) => {
  const { token } = req.headers;

  const userQuery = getUser();

  const userParams = [token];

  const userResults = await req.asyncMySQL(userQuery, userParams);

  if (userResults.length === 0) {
    res.status(404).send({ error: "User not found" });
    return;
  }

  const user = {
    id: userResults[0].id,
    name: userResults[0].name,
    surname: userResults[0].surname,
    email: userResults[0].email,
    // if I wanted to pass down password, do it here
    preferences: {
      vegan: userResults[0].vegan === 1 ? true : false,
      vegetarian: userResults[0].vegetarian === 1 ? true : false,
      glutenFree: userResults[0].gluten_free === 1 ? true : false,
    },
  };

  res.status(200).send({ message: "Success - user found", user });
});

// update user info
router.put("/", async (req, res) => {
  let { email, password, name, surname, preferences } = req.body;
  const { token } = req.headers;

  console.log("Request body in backend", req.body);

  let params = [];

  if (email && typeof email === "string") {
    let column = "email";
    const query = updateUser(column);
    params = [email, token];
    await req.asyncMySQL(query, params);
  }

  if (password && typeof password === "string") {
    password = sha256(process.env.SALT + password);
    let column = "password";
    const query = updateUser(column);
    params = [password, token];
    await req.asyncMySQL(query, params);
  }

  if (name && typeof name === "string") {
    let column = "name";
    const query = updateUser(column);
    params = [name, token];
    await req.asyncMySQL(query, params);
  }

  if (surname && typeof surname === "string") {
    let column = "surname";
    const query = updateUser(column);
    params = [surname, token];
    await req.asyncMySQL(query, params);
  }

  if (preferences && typeof preferences === "object") {
    console.log("vegan in update user backend:", preferences.vegan);
    console.log("vegetarian in update user backend:", preferences.vegetarian);
    console.log("glutenFree in update user backend:", preferences.glutenFree);

    // columns in prefs table in DB
    const prefColumns = ["vegan", "vegetarian", "gluten_free"];

    // convert bool into tinyint for DB
    const convertedVegan = preferences.vegan === true ? 1 : 0;
    const convertedVegetarian = preferences.vegetarian === true ? 1 : 0;
    const convertedGlutenFree = preferences.glutenFree === true ? 1 : 0;

    // set values
    const prefValues = [
      convertedVegan,
      convertedVegetarian,
      convertedGlutenFree,
    ];

    // send columns to SQL query
    const prefQuery = updatePreferences(prefColumns);

    // set params
    const prefParams = [...prefValues, token];

    await req.asyncMySQL(prefQuery, prefParams);
  } else {
    console.log("Error in request body - preferences");
  }

  res.status(200).send({ message: "User successfully updated" });
});

// delete user
router.delete("/", async (req, res) => {
  const { userId } = req;

  try {
    const deleteUserQuery = deleteUser();

    const deleteUserParams = [userId];

    const results = await req.asyncMySQL(deleteUserQuery, deleteUserParams);

    if (results.affectedRows !== 0) {
      res.status(204).send({ message: "User successfully deleted" });
    } else {
      res.status(500).send({ error: "Server error - affectedRows = 0" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to delete user" });
  }
});

module.exports = router;
