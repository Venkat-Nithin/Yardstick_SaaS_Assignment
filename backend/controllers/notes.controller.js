const Note = require('../models/Note');
const Tenant = require('../models/Tenant');

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ tenantId: req.userData.tenantId });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes.' });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const tenant = await Tenant.findById(req.userData.tenantId);
        
        if (tenant.subscriptionPlan === 'Free') {
            const noteCount = await Note.countDocuments({ tenantId: req.userData.tenantId });
            if (noteCount >= 3) {
                return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Pro for unlimited notes.' });
            }
        }

        const newNote = new Note({
            title,
            content,
            tenantId: req.userData.tenantId,
            userId: req.userData.userId
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Error creating note.' });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, tenantId: req.userData.tenantId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found.' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching note.' });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.userData.tenantId },
            { title, content },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ message: 'Note not found.' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error updating note.' });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const result = await Note.deleteOne({ _id: req.params.id, tenantId: req.userData.tenantId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Note not found.' });
        }
        res.status(200).json({ message: 'Note deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note.' });
    }
};