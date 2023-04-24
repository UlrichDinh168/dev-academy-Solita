// const express = require('express');
import express from 'express';
import path from 'path'
const router = express.Router();

router.get('/hello', async (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
  console.log(req.body, 'body');

});

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// module.exports = router;
export default router
