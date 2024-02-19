const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/signup_demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema and Model using Mongoose
const userSchema = new mongoose.Schema({
  name: String,
  registernumber:string,
  email: String,
  password: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

const User = mongoose.model('User', userSchema);

// Express routes
app.use(express.json());

// Signup route
app.post('/submit', async (req, res) => {
  try {
    const { registernumber,name, email, password } = req.body;

    // Generate verification token (you can use any method)
    const verificationToken = Math.random().toString(36).substring(7);

    // Save user to DB (password hashing with bcrypt is recommended)
    const newUser = new User({
      registernumber,
      name,
      email,
      password, // Remember to hash the password
      verificationToken,
    });
    await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      // Configure nodemailer with your email service details
      service: 'gmail',
      auth: {
        user: 'ftmnasrinc@gmail.com',
        pass: 'your_password',
      },
    });

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: "Click this link to verify your email  http://localhose:3000/verify/${verificationToken}, "};

    await transporter.sendMail(mailOptions);

    res.status(200).send('Verification email sent');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in signup');
  }
});

// Verify email route
app.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });

    if (user) {
      // Update user's verification status
      user.isVerified = true;
      user.verificationToken = ''; // Clear the token after verification
      await user.save();
      res.status(200).send('Email verified successfully');
    } else {
      res.status(404).send('Invalid token');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in verification');
  }
});

// Start the server
