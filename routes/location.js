const express = require("express");
const router = express.Router();

const {
  addLocation,
  getAllLocations,
  getLocation,
  updateLocation,
  removeLocation,
  searchLocation,
} = require("../controllers/locationController");

router.route("/addLocation").post(addLocation);
router.route("/locations").get(getAllLocations);
router.route("/location/:id").get(getLocation);
router.route("/location/:id").put(updateLocation);
router.route("/location/:id").delete(removeLocation);
router.route("/search-location").get(searchLocation);

module.exports = router;
