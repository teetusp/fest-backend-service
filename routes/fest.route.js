const express = require("express");
const festController = require("./../controllers/fest.controller");

const route = express.Router();

route.post("/", festController.uploadFest, festController.createFest); //เพิ่มข้อมูล
route.get("/:userId", festController.getAllFestByUser); //ดึงข้อมูลทั้งหมด
route.get("/only/:festId", festController.getOnlyFest);
route.put("/:festId", festController.uploadFest, festController.updateFest); //แก้ไขข้อมูล
route.delete("/:festId", festController.deleteFest); //ลบข้อมูล

module.exports = route;
