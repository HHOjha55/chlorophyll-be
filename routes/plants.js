const express = require("express");
const router = express.Router();

const {
  addPlant,
  getAllPlants,
  getPlant,
  updatePlant,
  removePlant,
  // loadPlantData,
} = require("../controllers/plantController");

// router.route("/loadPlantData").post(loadPlantData);
router.route("/addPlant").post(addPlant);
router.route("/plants").get(getAllPlants);
router.route("/plant/:id").get(getPlant);
router.route("/plant/:id").put(updatePlant);
router.route("/plant/:id").delete(removePlant);

module.exports = router;
