# Make Food, Not Waste: Backend

## Introduction
This is the backend API code for the "Make Food, Not Waste" React app [repo here](https://github.com/fredpostles/food-waste-app) initially developed during a full-stack software engineering bootcamp course.
The backend JavaScript code is written in Node.js, using the Express framework.

## Features
This API features all the necessary endpoints for the "Make Food, Not Waste" app, including `signup`, `login`, `logoff`, `users`, `pantry` and `saved-recipes`.
These routes handle all requests from the frontend and use SQL queries to communicate with the MySQL/MariaDB database to perform CRUD operations.

## Endpoints

### /signup

    POST /
        Description: Create a new user.
        Request Body: JSON object containing user registration details (e.g., username, password). E.g. `{
	"name": "Mister",
	"surname": "Demo",
	"email": "demo@mfnw.com",
	"password": "password123",
	"preferences": {
		"vegan": "false",
		"vegetarian": "true",
		"glutenFree": "false"
	}
}`
        Response: Either of the following:
          - Status code: 200; Message: "Success - account created!"
          - Status code: 403; Error: "Duplicate entry"
          - Status code: 400; Error: "Some data missing"

### / login
    POST /
        Description: Log in an existing user.
        Request Body: JSON object containing user login credentials, e.g. email and password.
        Response: Status code 200 and a message indicating the user has successfully logged in, in addition to the authentication token.

### /pantry

    GET /pantry
        Description: Retrieve the pantry items for the authenticated user.
        Authentication: User must be logged in. Token should be sent in request header.
        Response: An array of pantry items, as follows:
`{
	"message": "Success! Pantry items retrieved:",
	"pantryResults": [
		{
			"id": 71,
			"name": "rolled oats",
			"image": "rolled-oats.jpg",
			"date_added": "2023-09-10T17:35:52.000Z",
			"user_id": 46,
			"quantity.amount": 1,
			"quantity.units": "kilograms",
			"quantity": {
				"amount": 1,
				"units": "kilograms"
			}
		},
		{
			"id": 72,
			"name": "tofu",
			"image": "tofu.png",
			"date_added": "2023-09-10T17:36:00.000Z",
			"user_id": 46,
			"quantity.amount": 50,
			"quantity.units": "grams",
			"quantity": {
				"amount": 50,
				"units": "grams"
			}
		},
]}`
    GET /pantry/item/:id
    As above, but item id must be sent in as a request parameter.

    POST /pantry
        Description: Add a new pantry item.
        Authentication: User must be logged in. Token should be sent in request header.
        Request Body: JSON object containing pantry item details, as follows `{
	"itemName": "cocoa",
	"image": "cocoa.jpg"
}`. ID is added by the database.
        Response: Status code 200, with the following message: "Pantry item successfully created".

    PUT /pantry/item/:id
        Description: Update a pantry item by ID. Only the quantity is able to be updated, as this is not set when the item is added to pantry.
        Authentication: User must be logged in. Token should be sent in request header.
        Request Parameters: id (ID of the pantry item to update).
        Request Body: JSON object containing updated pantry item quantity, made up of either ONLY amount, or both amount and units. Example: `{
	"quantity": {
		"amount": "500",
		"units": "g"
	}
}`. 
        Response: The updated pantry item.

    DELETE /pantry/item/:id
        Description: Delete a pantry item by ID.
        Authentication: User must be logged in.
        Request Parameters: id (ID of the pantry item to delete).
        Response: Status code 204.

### /saved-recipes

    GET /
        Description: Retrieve the saved recipes for the authenticated user.
        Authentication: User must be logged in. Token should be sent in request header.
        Response: An array of saved recipes.

    POST /
        Description: Save a new recipe.
        Authentication: User must be logged in. Token should be sent in request header.
        Request Body: JSON object containing recipe details.
        Response: Status code 200 and "message": "Recipe successfully saved to DB".

    DELETE /:id
        Description: Delete a recipe from 'saved-recipes' by ID.
        Authentication: User must be logged in. Token should be sent in request header.
        Request Parameters: id (ID of the recipe to unsave).
        Response: Status code 204.

### /users

    GET /
        Description: Retrieve user info, e.g. name, email, dietary preferences.
        Request Header: Authentication token should be sent in request headers.
        Response: For a successful request, the expected response is a 200 status code and a response in the following format: 
`{
	"message": "Success - user found",
	"user": {
		"id": 47,
		"name": "Name",
		"surname": "Surname"
		"email": "e@mail.co.uk,
		"preferences": {
			"vegan": false,
			"vegetarian": false,
			"glutenFree": false
		}
	}
}`
        If the user is not found, a 404 status code is sent with the message "User not found".

    PUT /
        Description: Update the currently authenticate user. Any or all of the fields can be updated independently or together.
        Authentication: User must be logged in. Authentication token should be sent in request headers.
        Request body: JSON object containing user details to be updated. The request body should look something like this:
`{
	"name": "Joe",
	"surname": "Bloggs",
	"email": "jbloggs@abc.com",
	"password": "password321",
	"preferences": {
		"vegan": "true",
		"vegetarian": "false",
		"glutenFree": "false"
	}
}`
        Response: Status code 200 and a message saying "User successfully updated".

    DELETE /
        Description: Delete the currently authenticated user.
        Authentication: User must be logged in. Authentication token should be sent in request headers.
        Response: 204 status code.

  ### /logoff
    DELETE /
        Description: Log out the currently authenticated user.
        Authentication: User must be logged in. Authentication token should be sent in request headers.
        Response: 204 status code.

# Authentication

### Authentication is required for certain endpoints. 

To authenticate, users must obtain an authentication token. Typically, this token is obtained by logging in via the /login endpoint. Subsequent authenticated requests should include this token in the request headers to access protected endpoints.

# Database
This backend communicates with a relational database using SQL queries. Prepared statements have been used to help prevent injection attacks.

# Still To Do
- Improve error handling and error messages to help with debugging on front end.
- Write unit tests for each route and endpoint.
- Improve authentification, perhaps by using JWT or other library.
- Integrate OAuth, to allow people to sign up using other accounts, e.g. Google, GitHub or Facebook.
