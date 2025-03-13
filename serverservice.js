const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/user.route');

require('dotenv').config();

const app = express() //สร้าง web server

const POST = process.env.PORT

//ใช้ตัว middleware
app.use(cors())
app.use(express.json())
app.use('/user', userRoute)

//เอาไว้ test ว่ารับ request/response ได้หรือไม่
app.get('/', (request, response) => {
    response.json({
        message: "Hello, welcome to server...Teetus"
    })
})

//สั่ง start ตัว web server โดยเปิด PORT รองรับการ request/response ตามที่กำหนดไว้
app.listen(POST, () => {
    console.log(`Server is running on port ${POST}`)
})