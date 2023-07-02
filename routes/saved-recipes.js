const express = require("express");
const {
  createSavedRecipe,
  getAllSavedRecipes,
  checkSavedRecipe,
  getSavedRecipe,
  deleteSavedRecipe,
} = require("../mysql/queries");
const router = express.Router();

// save recipe
router.post("/", async (req, res) => {
  const {
    id: recipeId,
    title: recipeTitle,
    readyInMinutes,
    servings,
    image: recipeImage,
    extendedIngredients,
    analyzedInstructions,
  } = req.body;
  const { userId } = req;

  // check everything is being sent in
  if (
    recipeId &&
    recipeTitle &&
    readyInMinutes &&
    servings &&
    recipeImage &&
    extendedIngredients &&
    analyzedInstructions
  ) {
    try {
      // build the query and params
      const savedRecipeQuery = createSavedRecipe();

      const savedRecipeParams = [
        recipeId,
        recipeTitle,
        readyInMinutes,
        servings,
        recipeImage,
        JSON.stringify(extendedIngredients),
        JSON.stringify(analyzedInstructions),
        userId,
      ];

      console.log("savedRecipeParams", savedRecipeParams);

      // send to the DB
      const savedRecipeResults = await req.asyncMySQL(
        savedRecipeQuery,
        savedRecipeParams
      );
      // if successful..
      if (savedRecipeResults.affectedRows === 1) {
        res.status(200).send({ message: "Recipe successfully saved to DB" });
        return;
      }
      // if unsuccessful
      res.status(404).send({
        error: `Unsuccessful - recipe not saved. Not affecting any rows in the DB.`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Server error" });
      return;
    }
    // if not everything needed is sent in
    res.status(400).send({ error: "Some data missing from request" });
  }
});

// get all saved recipes
router.get("/", async (req, res) => {
  const { token } = req.headers;

  const savedRecipeQuery = getAllSavedRecipes();

  const savedRecipeParams = [token];

  const savedRecipeResults = await req.asyncMySQL(
    savedRecipeQuery,
    savedRecipeParams
  );

  if (savedRecipeResults.affectedRows === 0) {
    res.status(404).send({
      error: "Could not retrieve user's saved recipes",
    });
    return;
  }

  // Parse stringified JSON fields back into JSON objects
  const parsedResults = savedRecipeResults.map((recipe) => ({
    ...recipe,
    extendedIngredients: JSON.parse(recipe.extendedIngredients),
    analyzedInstructions: JSON.parse(recipe.analyzedInstructions),
  }));

  if (parsedResults.length === 0) {
    res.status(404).send({ error: "No saved recipes" });
    return;
  }

  res.status(200).send({
    message: "Success! Saved recipes retrieved",
    savedRecipeResults: parsedResults,
  });
});

// get saved recipe by ID
router.get("/:id", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  // get saved recipe by id
  const savedRecipeQuery = getSavedRecipe();

  const savedRecipeParams = [id, token];

  const savedRecipeResults = await req.asyncMySQL(
    savedRecipeQuery,
    savedRecipeParams
  );

  console.log("get saved recipe by id", savedRecipeResults);

  if (savedRecipeResults.affectedRows === 0) {
    res
      .status(404)
      .send({ error: "Could not retrieve saved recipe - affectedRows = 0" });
    return;
  }

  res
    .status(200)
    .send({ message: "Success! Saved recipe retrieved", savedRecipeResults });
});

// delete saved recipe by id
router.delete("/:id", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  // check item exists and belongs to user
  const itemQuery = checkSavedRecipe();

  const itemParams = [id, token];

  const item = await req.asyncMySQL(itemQuery, itemParams);

  // if item ID returns nothing, exit
  if (!item.length) {
    res.status(404).send({ error: "Saved recipe not found" });
    return;
  }

  const savedRecipeQuery = deleteSavedRecipe();

  const savedRecipeParams = [id, token];

  const savedRecipeResults = await req.asyncMySQL(
    savedRecipeQuery,
    savedRecipeParams
  );

  if (savedRecipeResults.affectedRows === 0) {
    res.status(404).send({
      error: "Could not delete saved recipe - affectedRows = 0",
    });
    return;
  }

  res.status(204).send({ message: "Success! Saved recipe deleted" });
});

module.exports = router;
