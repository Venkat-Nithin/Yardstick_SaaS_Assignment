require('dotenv').config();
const mongoose = require('mongoose');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for seeding.');

        // Clean up previous data
        await Tenant.deleteMany({});
        await User.deleteMany({});
        console.log('Previous data cleared.');

        // Create Tenants
        const acme = await Tenant.create({ name: 'Acme Corporation', slug: 'acme', subscriptionPlan: 'Free' });
        const globex = await Tenant.create({ name: 'Globex Inc.', slug: 'globex', subscriptionPlan: 'Free' });
        console.log('Tenants created.');

        // Create Users
        const hashedPassword = await bcrypt.hash('password', 10);
        
        await User.create([
            { email: 'admin@acme.test', password: hashedPassword, tenantId: acme._id, role: 'Admin' },
            { email: 'user@acme.test', password: hashedPassword, tenantId: acme._id, role: 'Member' },
            { email: 'admin@globex.test', password: hashedPassword, tenantId: globex._id, role: 'Admin' },
            { email: 'user@globex.test', password: hashedPassword, tenantId: globex._id, role: 'Member' }
        ]);
        console.log('Users created.');

        console.log('Database seeding complete!');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedData();