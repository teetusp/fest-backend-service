//จัดการ DB
const {PrismaClient} = require('@prisma/client');
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
        cb(null, "images/user");
    } ,
    filename: (req, file, cb) => {
        cb(null, 'user_'+ Math.floor(Math.random()* Date.now()) + path.extname(file.originalname));
    }
})
exports.uploadUser = multer({
     storage: storage,
     limits: {
         fileSize: 1000000
     },
     fileFilter: (req, file, cb) => {
         const fileTypes = /jpeg|jpg|png/;
         const mimeType = fileTypes.test(file.mimetype);
         const extname = fileTypes.test(path.extname(file.originalname));
         if(mimeType && extname) {
             return cb(null, true);
         }
         cb("Error: Images Only");
     }
}).single("userImage");

// เอาข้อมูลที่ส่งมาจาก FontedEnd เพิ่ม (Create/Insert) ลงใน DB
exports.createUser = async (req, res) => {
    try{
        //------
        const result = await prisma.user_tb.create({
            data: {
                userFullname: req.body.userFullname,
                userName: req.body.userName,
                userPassword: req.body.userPassword,
                userImage: req.file ? req.file.path.replace('\\images\\user\\', '') : '' ,
            }
        })
        //------
        response.status(200).json({
            message: "เพิ่มข้อมูลสําเร็จ",
            info : result
        })

    }catch(error){
        response.status(500).json({
            message: `พบปัญหาในการทำงาน : ${error}`
        });
        console.log(`Error: ${error}`);
    }
}