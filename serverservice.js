const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/user.route.js");
const festRoute = require("./routes/fest.route.js");

require("dotenv").config();

const app = express(); //สร้าง web server

const PORT = process.env.PORT || 8989;

//ใช้ตัว middleware
app.use(cors());
app.use(express.json());
app.use("/user", userRoute);
app.use("/fest", festRoute);
app.use("images/users", express.static("images/users"));
app.use("images/fests", express.static("images/fests"));

// เอาไว้ test ว่ารับ request/response ได้หรือไม่
app.get("/", (request, response) => {
  response.json({
    message: "Hello, welcome to server...Teetus",
  });
});

//สั่ง start ตัว web server โดยเปิด PORT รองรับการ request/response ตามที่กำหนดไว้
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
