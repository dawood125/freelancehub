const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/me', protect, userController.getMyProfile);
router.put('/me', protect, userController.updateMyProfile);

router.post('/me/avatar', protect, upload.single('avatar'), userController.uploadAvatar);
router.delete('/me/avatar', protect, userController.deleteAvatar);

router.get('/:username', userController.getPublicProfile);

module.exports = router;