//จัดการ DB
const { PrismaClient } = require("@prisma/client");
//จัดการ Upload
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { response } = require("express");

//สร้างตัวแปลอ้างอิงสำหรับ Prisma เพื่อเอาไปใช้งาน
const prisma = new PrismaClient();

//upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/fests");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "fest_" +
        Math.floor(Math.random() * Date.now()) +
        path.extname(file.originalname)
    );
  },
});
exports.uploadFest = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Error: Images Only");
  },
}).single("festImage");

// เอาข้อมูลที่ส่งมาจาก FontedEnd เพิ่ม (Create/Insert) ลงใน DB
exports.createFest = async (req, res) => {
  try {
    //------
    const result = await prisma.fest_tb.create({
      data: {
        festName: req.body.festName,
        festDetail: req.body.festDetail,
        festState: req.body.festState,
        festNumDay: parseInt(req.body.festNumDay),
        festCost: parseFloat(req.body.festCost),
        festImage: req.file
          ? req.file.path.replace("\\images\\fests\\", "")
          : "",
        userId: parseInt(req.body.userId),
      },
    });
    //------
    res.status(200).json({
      message: "เพิ่มข้อมูลสําเร็จ",
      info: result,
    });
  } catch (error) {
    res.status(500).json({
      message: `พบปัญหาในการทำงาน : ${error}`,
    });
    console.log(`Error: ${error}`);
  }
};

//ดึงข้อมูล fest ทั้งหมดของ user หนึ่งๆ จาก DB
exports.getAllFestByUser = async (req, res) => {
  try {
    const result = await prisma.fest_tb.findMany({
      where: {
        userId: parseInt(req.params.userId),
      },
    });
    res.status(200).json({
      message: "Ok",
      info: result,
    });
  } catch (err) {
    res.status(500).json({
      message: `พบปัญหาในการทำงาน: ${err}`,
    });
    console.log(`Error: ${err}`);
  }
};

exports.getOnlyFest = async (req, res) => {
  try {
    const result = await prisma.fest_tb.findFirst({
      where: {
        festId: parseInt(req.params.festId),
      },
    });
    res.status(200).json({
      message: "Ok",
      info: result,
    });
  } catch (err) {
    res.status(500).json({
      message: `พบปัญหาในการทำงาน: ${err}`,
    });
    console.log(`Error: ${err}`);
  }
};

//----------------------------------------------
exports.updateFest = async (req, res) => {
  try {
    let result = {};
    if (req.file) {
      const festReult = await prisma.fest_tb.findFirst({
        where: {
          festId: parseInt(req.params.festId),
        },
      });
      //เอาข้อมูลของ fest ที่ได้มามาดูว่ามีรูปไหม ถ้ามีให้ลบรูปนั้นทิ้ง
      if (festReult.festImage) {
        fs.unlinkSync(path.join("images/fests", festReult.festImage)); //ลบรูปทิ้ง
      }
      //แก้ไขข้อมูลในฐานข้อมูล
      result = await prisma.user_tb.update({
        where: {
          festId: parseInt(req.params.festId),
        },
        data: {
          festName: req.body.festName,
          festDetail: req.body.festDetail,
          festState: req.body.festState,
          festNumDay: parseInt(req.body.festNumDay),
          festCost: parseFloat(req.body.festCost),
          festImage: req.file.path.replace("images\\fests\\", ""),
          userId: parseInt(req.body.userId),
        },
      });
    } else {
      //แก้ไขข้อมูลแบบไม่มีการแก้ไขรูป
      result = await prisma.fest_tb.update({
        where: {
          festId: parseInt(req.params.festId),
        },
        data: {
          festName: req.body.festName,
          festDetail: req.body.festDetail,
          festState: req.body.festState,
          festNumDay: parseInt(req.body.festNumDay),
          festCost: parseFloat(req.body.festCost),
          userId: parseInt(req.body.userId),
        },
      });
    }
    //-----
    res.status(200).json({
      message: "แก้ไขข้อมูลสําเร็จ",
      info: result,
    });
  } catch (error) {
    res.status(500).json({
      message: `พบปัญหาในการทำงาน: ${error}`,
    });
    console.log(`Error: ${error}`);
  }
};

//ลบ fest (Delete) จากตารางใน DB
exports.deleteFest = async (req, res) => {
  try {
    const result = await prisma.fest_tb.delete({
      where: {
        festId: parseInt(req.params.festId),
      },
    });
    res.status(200).json({
      message: "ลบข้อมูลสําเร็จ",
      info: result,
    });
  } catch (error) {
    res.status(500).json({
      message: `พบปัญหาในการทำงาน: ${error}`,
    });
    console.log(`Error: ${error}`);
  }
};
