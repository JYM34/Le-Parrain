import express from 'express';
import { helloWorld } from '../controllers/apiController.js';

const router = express.Router();

// Route de test : GET /api/hello
router.get('/hello', helloWorld);

export default router;
