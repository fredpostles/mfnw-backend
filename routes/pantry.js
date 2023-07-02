const express = require("express");
const {
  createPantryItem,
  updatePantryItem,
  getAllPantryItems,
  getPantryItem,
  deletePantryItem,
  checkPantryItem,
} = require("../mysql/queries");
const router = express.Router();

// create new pantry item
router.post("/", async (req, res) => {
  const { name, image } = req.body;
  const { userId } = req;

  try {
    if (name && image) {
      const pantryQuery = createPantryItem();

      const pantryParams = [name, image, userId];

      const pantryResults = await req.asyncMySQL(pantryQuery, pantryParams);

      if (pantryResults.affectedRows === 1) {
        res.status(200).send({ message: "Pantry item successfully created" });
      } else if (pantryResults.affectedRows === 0) {
        res.status(404).send({
          error: `Unsuccessful - pantry item not created. Not affecting any rows in the DB.`,
        });
      }
      return;
    }
    res.status(400).send({ error: "Some data missing from request" });
  } catch (error) {
    throw error;
  }
});

// get all pantry items
router.get("/items", async (req, res) => {
  const { token } = req.headers;

  const pantryQuery = getAllPantryItems();

  const pantryParams = [token];

  const pantryResults = await req.asyncMySQL(pantryQuery, pantryParams);

  if (pantryResults.affectedRows === 0) {
    res.status(404).send({
      error: "Could not retrieve user's pantry items - affectedRows = 0",
    });
    return;
  }
  if (pantryResults.length === 0) {
    res.status(404).send({ error: "No results returned" });
    return;
  }

  // Restructure the results to include the nested quantity object
  const restructuredResults = pantryResults.map((item) => {
    const { quantity_amount, quantity_units, ...rest } = item;

    const quantity =
      quantity_amount || quantity_units
        ? {
            amount: quantity_amount,
            units: quantity_units,
          }
        : null;

    return {
      ...rest,
      quantity,
    };
  });

  res.status(200).send({
    message: "Success! Pantry items retrieved:",
    pantryResults: restructuredResults,
  });
});

// get pantry item by ID
router.get("/item/:id", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  // check the item exists and belongs to the user
  const itemQuery = checkPantryItem();
  const itemParams = [id, token];
  const item = await req.asyncMySQL(itemQuery, itemParams);

  console.log("Pantry item ID:", item);

  // if pantry item id returns nothing, return
  if (!item.length) {
    res.status(404).send({ error: "Pantry item not found" });
    return;
  }

  // get pantry item by id
  const pantryQuery = getPantryItem();

  const pantryParams = [id, token];

  const pantryResults = await req.asyncMySQL(pantryQuery, pantryParams);
  console.log(pantryResults);

  if (pantryResults.affectedRows === 0) {
    res.status(404).send({
      error: "Could not retrieve user's pantry item - affectedRows = 0",
    });
    return;
  }

  res
    .status(200)
    .send({ message: "Success! Pantry item retrieved:", pantryResults });
});

// update pantry item (add quantity - nothing else is updateable)
router.put("/item/:id", async (req, res) => {
  const { quantity } = req.body;
  const { token } = req.headers;
  const { id } = req.params;

  // check the item exists and belongs to the user
  const itemQuery = getPantryItem();
  const itemParams = [id, token];
  const item = await req.asyncMySQL(itemQuery, itemParams);

  if (!item.length) {
    res.status(404).send({ error: "Pantry item not found" });
    return;
  }

  if (quantity && typeof quantity === "object") {
    // columns in DB
    const quantityColumns = ["quantity_amount", "quantity_units"];

    // grab values from request
    const quantityAmount = quantity.amount;
    const quantityUnits = quantity.units;

    const quantityQuery = updatePantryItem(quantityColumns);

    const quantityParams = [quantityAmount, quantityUnits, id, token];

    await req.asyncMySQL(quantityQuery, quantityParams);

    res.status(200).send({ message: "Pantry item successfully updated" });
    return;
  }

  res.status(400).send({
    error:
      "Some data missing from request. Make sure you're sending in quantity amount and/or units.",
  });
});

// delete pantry item w/ id
router.delete("/item/:id", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  console.log(">>>", id);
  const pantryQuery = deletePantryItem();

  const pantryParams = [id, token];

  const pantryResults = await req.asyncMySQL(pantryQuery, pantryParams);

  if (pantryResults.affectedRows === 0) {
    res.status(404).send({
      error: "Could not delete user's pantry item - affectedRows = 0",
    });
    return;
  }

  res.status(204).send({ message: "Success! Pantry item deleted." });
});

module.exports = router;
