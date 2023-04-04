const queries = {
  createUser: () => {
    return `INSERT IGNORE users 
                (name, surname, email, password) 
                    VALUES 
                        (?, ?, ?, ?);`;
  },

  createPreferences: () => {
    return `INSERT INTO preferences (user_id, vegan, vegetarian, gluten_free)
            VALUES (?, ?, ?, ?)`;
  },

  getUser: () => {
    return `SELECT users.* , preferences.vegan, preferences.vegetarian, preferences.gluten_free
                FROM users
                    JOIN logins 
                        ON users.id = logins.user_id
                          LEFT JOIN preferences on users.id = preferences.user_id
                            WHERE token = ?;`;
  },

  getUserID: (token) => {
    return `SELECT users.id FROM users 
              JOIN logins ON users.id = logins.user_id          
                WHERE logins.token = ?`;
  },

  updateUser: (column) => {
    return `UPDATE users
                JOIN logins
                    ON users.id = logins.user_id
                        SET ${column} = ?
                            WHERE token = ?;`;
  },

  updatePreferences: (columns) => {
    const setColumns = columns.map((column) => `${column} = ?`).join(", ");
    return `UPDATE preferences
              JOIN users ON preferences.user_id = users.id
                JOIN logins ON users.id = logins.user_id
                  SET ${setColumns}
                    WHERE logins.token = ?`;
  },

  deleteUser: () => {
    return `DELETE users, logins, preferences, pantry_items, saved_recipes
                FROM users
                  LEFT JOIN logins ON users.id = logins.user_id
                    LEFT JOIN preferences ON users.id = preferences.user_id
                            WHERE users.id = ?`;
  },
  checkCreds: () => {
    return `SELECT id 
                FROM users 
                    WHERE email = ? 
                        AND password = ?;`;
  },
  addToken: () => {
    return `INSERT INTO logins 
                (user_id, token) 
                    VALUES 
                        (?, ?);`;
  },
  checkToken: () => {
    return `SELECT users.id
              FROM users
                JOIN logins
                  ON users.id = logins.user_id
                    WHERE token = ?;`;
  },

  deleteToken: () => {
    return `DELETE FROM logins 
                WHERE token = ?;`;
  },

  createPantryItem: () => {
    return `INSERT INTO pantry_items (item_name, image, user_id)
              VALUES (?, ?, ?);`;
  },

  updatePantryItem: (columns) => {
    const setColumns = columns.map((column) => `${column} = ?`).join(", ");
    return `UPDATE pantry_items
              JOIN users ON pantry_items.user_id = users.id
                JOIN logins ON users.id = logins.user_id
                  SET ${setColumns}
                    WHERE pantry_items.id = ? 
                      AND logins.token = ?;`;
  },

  checkPantryItem: () => {
    return `SELECT pantry_items.id FROM pantry_items 
                  JOIN users ON pantry_items.user_id = users.id 
                    JOIN logins ON users.id = logins.user_id 
                      WHERE pantry_items.id = ? 
                        AND logins.token = ?;`;
  },

  getAllPantryItems: () => {
    return `SELECT pantry_items.* FROM pantry_items
              JOIN users ON users.id = pantry_items.user_id
                JOIN logins ON users.id = logins.user_id          
                  WHERE logins.token = ?;`;
  },

  getPantryItem: () => {
    return `SELECT pantry_items.* FROM pantry_items
              JOIN users ON users.id = pantry_items.user_id
                JOIN logins ON users.id = logins.user_id          
                  WHERE pantry_items.id = ?
                    AND logins.token = ?;`;
  },

  deletePantryItem: () => {
    return `DELETE pantry_items.* FROM pantry_items
              JOIN users ON users.id = pantry_items.user_id
                JOIN logins ON users.id = logins.user_id          
                  WHERE pantry_items.id = ?
                    AND logins.token = ?;`;
  },

  createSavedRecipe: () => {
    return `INSERT INTO saved_recipes (recipe_id, recipe_title, ready_in_minutes, servings, recipe_image,	extended_ingredients,	analyzed_instructions, user_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
  },

  getAllSavedRecipes: () => {
    return `SELECT saved_recipes.* FROM saved_recipes
              JOIN users ON users.id = saved_recipes.user_id
                JOIN logins ON users.id = logins.user_id          
                  WHERE logins.token = ?;`;
  },

  checkSavedRecipe: () => {
    return `SELECT saved_recipes.recipe_id FROM saved_recipes 
              JOIN users ON saved_recipes.user_id = users.id 
                JOIN logins ON users.id = logins.user_id 
                  WHERE saved_recipes.recipe_id = ? 
                    AND logins.token = ?;`;
  },

  getSavedRecipe: () => {
    return `SELECT saved_recipes.* FROM saved_recipes
              JOIN users ON users.id = saved_recipes.user_id
                JOIN logins ON users.id = logins.user_id          
                  WHERE saved_recipes.recipe_id = ?
                    AND logins.token = ?;`;
  },

  deleteSavedRecipe: () => {
    return `DELETE saved_recipes.* FROM saved_recipes
              JOIN users ON users.id = saved_recipes.user_id
                JOIN logins ON users.id = logins.user_id          
                  WHERE saved_recipes.recipe_id = ?
                    AND logins.token = ?;`;
  },
};

module.exports = queries;
