const mongoose = require('mongoose');
const SliderModel = require('../model/Slider.model');


exports.getAllSliders =  (req, res) => {
  
    SliderModel.find()
    .then((data) =>{ res.json(data);})
    .catch((err) => {res.json( err)});
}

exports.createSlider = (req, res) => {
    const newSlider =  new SliderModel(
     req.bady        
    )

    newSlider.save()
    .then((data) =>{ res.json(data);})
    .catch((err) => {res.json( err)});
   
}

exports.deleteSlider = (req,res,next)=>{

    SliderModel.findByIdAndRemove({_id:req.params.sliderId})
    .then((data)=>{res.json(data)})
    .catch((err)=>{
      next({message:'The slider deleted.',code:99})
      res.json(err)
    })
  }

  exports.updateSingleSlider =  (req, res) => {
    SliderModel.findByIdAndUpdate({_id: req.params.sliderId}, {$set: req.body})
    .then(data => res.json({message:'Slider updated', status:true, data}))
    .catch(err => res.json({message: err, status:false}))
}