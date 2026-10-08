import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sign = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

// POST /api/auth/register  { email, password }
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!EMAIL_RE.test(email || '')) {
      res.status(400).json({ message: 'Enter a valid email address' });
      return;
    }
    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }
    const user = await User.create({ email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user.id), user: { id: user.id, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    res.json({ token: sign(user.id), user: { id: user.id, email: user.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
