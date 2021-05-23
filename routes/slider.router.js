const express = require('express');
const router = express.Router();

const sliderControllers = require('../controllers/slider.controllers')

router.get('/sliders',sliderControllers.getAllSliders);
router.post('/slider', sliderControllers.createSlider);
router.put('/slider/:sliderId', sliderControllers.updateSingleSlider);
router.delete('/slider/:sliderId', sliderControllers.deleteSlider);



module.exports = router