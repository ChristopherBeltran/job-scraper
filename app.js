const express = require("express");
require("./mongoose");
const userRouter = require("./src/routers/user");

const app = express();

app.use(express.json());
app.use(userRouter);

module.exports = app;