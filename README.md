<h2 align="center">Get the Flight Out</h2>

<!-- TODO: add logo -->

<p align="center">
  <a href="#getting-started">Getting Started</a> •
  <a href="#functionality">Functionality</a> •
  <a href="#route-examples">Route Examples</a> •
  <a href="#data-flow">Data Flow</a> •
  <a href="#tests">Tests</a> •
  <a href="#built-with">Built With</a> •
  <a href="#creators">Creators</a>
</p>

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

<br>

<!-- TODO: add travis badge -->

## Overview
PetMinder is an application designed to send a text message to remind clients when to administer their pet's medications. Their Veterinary physician can fully set up the reminders for the client when the medication is prescribed. Reminders can be set for monthly medication like heartworm or flea/tick prevention or for daily medications. These reminders will increase the quality of life for both the pet and the owner.


## Getting Started
To use this application as a developer:
* Install [NPM](https://www.npmjs.com/get-npm), [HTTPie](https://httpie.org/) and [MongoDB](https://docs.mongodb.com/manual/administration/install-enterprise/)
* Fork and clone this repository [GTFO](https://github.com/Get-the-flight-out/EJ-backend)
<!-- change this if we change the repo names -->
* NPM init your project
* Add .gitignore and .travis.yml files
* Add the following dependencies

<!-- TODO: change depending what dependencies we need -->

```
"dependencies": {
    "bcrypt": "^1.0.3",
    "body-parser": "^1.18.2",
    "cors": "^2.8.4",
    "dotenv": "^5.0.0",
    "express": "^4.16.2",
    "jest": "^22.2.2",
    "jsonwebtoken": "^8.1.1",
    "mongoose": "^5.0.4",
    "node-schedule": "^1.3.0",
    "twilio": "^3.11.3"
  },
  "devDependencies": {
    "faker": "^4.1.0",
    "jest-cli": "^22.2.2",
    "superagent": "^3.8.2"
  }
```
* Add the following .env files

<!-- TODO: add .test.env -->

.env
```
PORT=3000
MONGODB_URI='mongodb://localhost/TravelApp'
APP_SECRET='<secret>'
FLIGHT_URL=https://api.sandbox.amadeus.com/v1.2/flights
API_KEY=<api key>
```
* Start your server using nodemon or npm run start:watch
* Connect to your database using npm run start-db
* Open Mongo in the terminal, if needed.


## Functionality
As a user, I want to be able to sign up with the following required information: username, password, email address, and phone number. A user can securely log in to the app after a successful sign up.

In order to keep track of the pets medication needs, a user will enter relevant information about their pets and the medicine they must take.

After pet and medicine information are entered, a user can then create a reminder for each pet that will notify the user as much as they decide.

With the users phone number that is stored on signup, a user can choose to be notified via text message 1-3 times per day (morning, noon, and evening.)

This app will help ensure owners give their pets the medicine they are supposed to take at the correct time.

## Route Examples

Examples using HTTPie

#### POST:

#### GET:
* Retrieve flights
  <!-- * Add appropriate endpoint: ...... TODO:... -->

##### Get All
* Example for how to retrieve inspirational searches
* The user's origin is require. Optional: direct, duration, max_price, destination, departure_date.
* Below is an example of a GET request with the origin of Seattle Airport and the optional input of max price of $500 USD.
```
http GET http://localhost:3000/api/v1/inspiration-search origin=SEA max_price=500
```
* Example for how to retrieve lowfare searches
* The user's origin, destination, and departure_date are require. Optional: nonstop, max_price, and return_date.
* Below is an example of a GET request with the origin of Seattle Airport, destination of Bangkok International Airport, departure date of September 15th, 2018 and the optional input of max price of $1000 USD.
```
http GET http://localhost:3000/api/v1/lowfare-search origin=SEA destination=BKK departure_date=2018-09-15 max_price=1000
```

##### Get One


#### PUT:


#### DELETE:


## Tests
This project uses Travis-CI for continuous integration. Every Pull Request to the master branch is initiated will launch travis, which in turn runs Jest tests. Pull requests are not merged until all travis-ci tests pass.

## Data Flow

<!-- TODO: make a data flow diagram...maybe? add it here -->


## Built With

* [Javascript](https://www.javascript.com/)
* [npm](https://www.npmjs.com/)
* [Jest](https://www.npmjs.com/package/jest)
* [Body-parser](https://www.npmjs.com/package/body-parser)
* [Cors](https://www.npmjs.com/package/cors)
* [Express](https://www.npmjs.com/package/express)
* [jsonwebtoken](https://www.npmjs.com/package/json-web-token)
* [Mongoose](http://mongoosejs.com/docs/api.html)
* [Faker](https://www.npmjs.com/package/Faker)
* [Superagent](https://www.npmjs.com/package/superagent)

## Creators
The Creators of Get the Flight Out!
