const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('tenantId');
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed: Invalid credentials.' });
        }

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
        res.status(500).json({ message: 'An error occurred during authentication.' });
    }
};

exports.inviteUser = async (req, res) => {
    const { email, role } = req.body;
    const tenantId = req.userData.tenantId;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // Generate a temporary password (will be required to be changed on first login)
        const tempPassword = 'password'; 
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            tenantId,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'User invited successfully.', user: { email: newUser.email, role: newUser.role } });
    } catch (error) {
        res.status(500).json({ message: 'Failed to invite user.' });
    }
};