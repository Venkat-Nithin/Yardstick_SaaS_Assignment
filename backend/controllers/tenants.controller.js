const Tenant = require('../models/Tenant');

exports.upgradeTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findOne({ slug: req.params.slug });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found.' });
        }
        
        // Ensure the logged-in user belongs to the tenant they are trying to upgrade
        if (req.userData.tenantId.toString() !== tenant._id.toString()) {
            return res.status(403).json({ message: 'Access denied. Cannot upgrade another tenant.' });
        }

        tenant.subscriptionPlan = 'Pro';
        await tenant.save();

        res.status(200).json({ message: 'Subscription upgraded to Pro.', tenant });

    } catch (error) {
        res.status(500).json({ message: 'Error upgrading subscription.' });
    }
};