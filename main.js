const data = require("./data.json");
const basicURL = "https://dev.virtualearth.net/REST/v1/Routes/";
const BingMapsKey =
  "AnFS3v-4xXtTwePXNAP1cyE2AP3UnosaRI_fCvQZ3m4OM0WSUSPOQnEt3bSFPwDw";
const origin = "-22.89141, -42.423";
const destination = "-22.89361, -42.46864";

async function fetchTravelJSON() {
  const response = await fetch(
    `${basicURL}DistanceMatrix?origins=${origin}&destinations=${destination}&travelMode=driving&key=${BingMapsKey}`
  );
  const travel = await response.text();
  const travelDistance = travel.substr(-170, 26).replace(/\D/g, "");

  console.log(travelDistance);
}

// console.log(data)
fetchTravelJSON();
console.log("Hello world");
