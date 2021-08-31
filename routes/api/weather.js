const express = require("express");
const got = require("got");
const router = express.Router();
const { validationResult, query } = require("express-validator");

require("dotenv").config();

// middleware
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// validator
const validator = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  next();
};

// define the home page route
router.get(
  "/",
  // [query("lat").isNumeric(), query("lon").isNumeric()],
  // validator,
  async (req, res, next) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.API_KEY_OW;
    try {
      const response = await got(
        "https://api.openweathermap.org/data/2.5/weather",
        { searchParams: { lat, lon, appid: apiKey } }
      );
      return res.json(JSON.parse(response.body));
      // const {
      //   name,
      //   main: { temp_max: tMax, temp_min: tMin },
      //   wind,
      //   weather: [weather],
      //   sys: { country },
      // } = JSON.parse(response.body);
      // res.json({ name, tMax, tMin, wind, weather, country });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/error", function (req, res) {
  throw new Error("Error!");
  res.json({ message: "Error" });
});

module.exports = router;

// http://localhost:3000/weather?lat=49,8383&lon=24,0232
