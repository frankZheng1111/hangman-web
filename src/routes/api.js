'use strict'
import express from 'express';
import {  checkLogin } from '../middlewares/check';
import hangmen from './hangmen';
import users from './users';

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});
router.use('/users', users);
router.use(checkLogin);
router.use('/hangmen', hangmen);
router.use((req, res) => {
  res.status(404).json({ error: "404 NOT FOUND" });
});
router.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: "500 SERVER ERROR" });
});

export default router;
