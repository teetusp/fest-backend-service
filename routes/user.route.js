const express = require('express');
const userController = require('./../controllers/user.controller');

const route = express.Router();

route.post('/', userController.uploadUser, userController.createUser);

module.exports = route