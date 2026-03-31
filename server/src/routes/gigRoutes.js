const express = require('express');
const router = express.Router();
const gigController = require('../controllers/gigController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');


router.get('/', gigController.getAllGigs);


router.get('/user/me', protect, gigController.getMyGigs);


router.get('/:id', gigController.getGig);

router.post('/', protect, gigController.createGig);
router.put('/:id', protect, gigController.updateGig);
router.delete('/:id', protect, gigController.deleteGig);

router.post('/:id/images', protect, upload.array('images', 5), gigController.uploadGigImages);
router.delete('/:id/images/:imageId', protect, gigController.deleteGigImage);

module.exports = router;