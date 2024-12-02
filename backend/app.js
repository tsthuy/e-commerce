const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const cors = require("cors");

app.use(
  cors({
    origin: ["https://e-commerce-nu-lyart.vercel.app"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// import
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const coupon = require("./controller/coupounCode");
const event = require("./controller/event");
const order = require("./controller/order");
const withdraw = require("./controller/withdraw");
const payment = require("./controller/payment");
const conversation = require("./controller/conversation");
const message = require("./controller/message");

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/event", event);
app.use("/api/v2/order", order);
app.use("/api/v2/withdraw", withdraw);
app.use("/api/v2/payment", payment);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
// handler error
app.use(ErrorHandler);
module.exports = app;
