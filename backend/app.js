const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

// import
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const coupon = require("./controller/coupounCode");
const event = require("./controller/event");
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/event", event);
// handler error
app.use(ErrorHandler);
module.exports = app;
