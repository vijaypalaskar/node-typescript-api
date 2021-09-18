"use strict";
const express = require('express');
const router = express.Router();
const hotel = require('./hotel');
router.get('/orders', hotel.getOrders);
router.get('/products', hotel.getProducts);
router.get('/users_migration', hotel.getUsers_migration);
router.get('/users', hotel.getUsers);
module.exports = router;
