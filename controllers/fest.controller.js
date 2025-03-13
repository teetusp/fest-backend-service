//จัดการ DB
const { PrismaClient } = require('@prisma/client');
//จัดการ Upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { response } = require('express');

//สร้างตัวแปลอ้างอิงสำหรับ Prisma เพื่อเอาไปใช้งาน
const prisma = new PrismaClient();

//upload image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/fest");
    },
    filename: (req, file, cb) => {
        cb(null, 'fest_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
})
exports.uploadFest = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb("Error: Images Only");
    }
}).single("userImage");

// เอาข้อมูลที่ส่งมาจาก FontedEnd เพิ่ม (Create/Insert) ลงใน DB
exports.createFest = async (req, res) => {
    try {
        //------
        const result = await prisma.fest_tb.create({
            data: {
                festName: req.body.festName,
                festDetail: req.body.festDetail,
                festNumDay: req.body.festNumDay,
                festCost: req.body.festCost,
                festImage: req.file ? req.file.path.replace('\\images\\fest\\', '') : '',
            }
        })
        //------
        response.status(200).json({
            message: "เพิ่มข้อมูลสําเร็จ",
            info: result
        })

    } catch (error) {
        response.status(500).json({
            message: `พบปัญหาในการทำงาน : ${error}`
        });
        console.log(`Error: ${error}`);
    }
}