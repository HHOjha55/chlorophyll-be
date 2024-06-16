const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utility/customError");
const Location = require("../models/location");

// add-location
exports.addLocation = BigPromise(async (req, res, next) => {
  const location = await Location.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      location,
    },
  });
});

// update-location
exports.updateLocation = BigPromise(async (req, res, next) => {
  const location = await Location.FindByIdAndUpdate({
    _id: req.params.id,
    ...req.body,
  });

  res.status(200).json({
    status: "success",
    data: {
      location,
    },
  });
});

// remove-location
exports.removeLocation = BigPromise(async (req, res, next) => {
  const location = await Location.FindByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      location,
    },
  });
});

// get-location
exports.getLocation = BigPromise(async (req, res, next) => {
  const location = await Location.FindById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      location,
    },
  });
});

// get-all-locations
exports.getAllLocations = BigPromise(async (req, res, next) => {
  const locations = await Location.Find();

  res.status(200).json({
    status: "success",
    data: {
      locations,
    },
  });
});

// search-location
exports.searchLocation = BigPromise(async (req, res, next) => {
  //check for matching string in all fields based on schema
  const query = req.query.q;
  console.log(query);

  let results = await Location.find();

  results = results.filter(
    (item) =>
      item.city.toLowerCase().includes(query.toLowerCase()) ||
      item.district.toLowerCase().includes(query.toLowerCase()) ||
      item.state.toLowerCase().includes(query.toLowerCase()) ||
      item.plantArea.toLowerCase().includes(query.toLowerCase())
  );

  console.log(results[0].geoLocation);

  res.status(200).json({
    status: "success",
    data: results,
  });
});
