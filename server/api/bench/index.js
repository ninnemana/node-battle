'use strict';

var express = require('express');
var controller = require('./bench.controller');

var router = express.Router();

router.post('/', controller.index);

module.exports = router;
