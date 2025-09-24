const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log('Received login request for:', email);
    console.log('Password received:', password);

    try {
        const user = await User.findOne({ email }).populate('tenantId');
        if (!user) {
            console.log('User not found.');
            return res.status(401).json({ message: 'Authentication failed: Invalid credentials.' });
        }
        
        console.log('User found:', user.email);
        console.log('Stored hashed password:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch.');
            return res.status(401).json({ message: 'Authentication failed: Invalid credentials.' });
        }
        
        console.log('Passwords match. Generating token...');

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            expiresIn: 3600,
            userData: {
                email: user.email,
                role: user.role,
                tenant: {
                    name: user.tenantId.name,
                    slug: user.tenantId.slug,
                    subscriptionPlan: user.tenantId.subscriptionPlan
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during authentication.' });
    }
};