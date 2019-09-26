// helper.js
import axios from "axios";

// CORS enabled apikey
const apikey = "5d8cc1100e26877dd0577b76"; //"5d8c96aa0e26877dd0577b61"; // "595f6501afce09e87211ea68";

// Autotrade delay
const trade_delay = 5000; // millis

// REST endpoint
let restdb = axios.create({
  async: true,
  crossDomain: true,
  baseURL: "https://sensit-17f0.restdb.io",
  timeout: 10000,
  headers: {
    "x-apikey": apikey,
    "content-type": "application/json",
    "cache-control": "no-cache"
  }
});
// Eventource endpoint
const realtimeURL = `https://sensit-17f0.restdb.io/realtime?apikey=${apikey}`;

export { apikey, restdb, realtimeURL, trade_delay };
