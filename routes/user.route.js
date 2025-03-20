const express = require("express");
const userController = require("./../controllers/user.controller");

const route = express.Router();

route.post("/", userController.uploadUser, userController.createUser); //เพิ่มข้อมูล
route.get("/:userName/:userPassword", userController.checkLogin); //ดึง ดู ตรวจสอบข้อมูล
route.put("/:userId", userController.uploadUser, userController.updateUser); //แก้ไขข้อมูล

module.exports = route;
