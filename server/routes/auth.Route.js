import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.Model.js';
import authenticate from '../middleware/isAuthenticated.js';

const router = Router();
router.post('/signup', async (req, res) => {
    try {
      
      if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).json({ error: 'All fields required' });
      }


      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }


      const existingUsername = await User.findOne({ name: req.body.name });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({ ...req.body, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/profile', authenticate, async (req, res) => {
    const { name, email, phone, profilePicture } = req.user;
    res.json({ name, email, phone, profilePicture });
  });

export default router;