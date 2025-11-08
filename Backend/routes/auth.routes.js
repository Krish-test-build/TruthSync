const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const serviceAccount = require("../firebase-service-account.json");

const User = require('../models/SignUp.Model');
const { defaultImage } = require('../config/Default.config');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

router.post('/google-login', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Token missing' });

  try {
    const decoded = await admin.auth().verifyIdToken(credential);

    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName: name?.split(' ')[0] || name || 'User',
        lastName: name?.split(' ')[1] || '',
        username: (name || 'user').replace(/\s/g, '') + Date.now(),
        email,
        password: null,
        googleId: uid,
        image: picture || defaultImage,
      });
    }

    const token = user.generateToken();

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: false, 
      sameSite: 'lax'
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Firebase verification failed:", err);
    res.status(401).json({ error: 'Invalid Firebase token' });
  }
});

module.exports = router;
