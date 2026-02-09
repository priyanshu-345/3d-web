import express from 'express';
const router = express.Router();

// Contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // TODO: Send email notification
    // TODO: Save to database if needed
    // TODO: Integrate with email service (SendGrid, Nodemailer, etc.)

    console.log('Contact form submission:', { name, email, phone, subject, message });

    res.json({ 
      message: 'Thank you for your message. We will get back to you soon!',
      success: true 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;









