const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const auth = require('../middleware/auth');

router.use(auth); // All note routes require authentication

router.post('/', notesController.createNote);
router.get('/', notesController.getNotes);
router.get('/:id', notesController.getNoteById);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;