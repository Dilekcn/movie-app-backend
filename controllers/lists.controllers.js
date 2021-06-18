const mongoose = require('mongoose');
const ListsModel = require('../model/List.model');

exports.getAll = async (req, res) => {
	try {
		const response = await ListsModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error); 
	}
};
 
exports.create = async (req, res) => {
    const {userId,name,description,coverImageId,sortBy,isPublic,isActive,isDeleted
    }=req.body
	const newList = await new ListsModel({
		userId,
        name,
        description,
        coverImageId,
        sortBy,
        isPublic,
        isActive,
        isDeleted
	});
	newList
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};
 


exports.getSingleList = async (req,res) => {
await ListsModel.findById({_id: req.params.id}, (err,data) => {
  if(err) {
    res.json({message: err})
  } else {
    res.json(data)
  }
})
  }
 
exports.getListByUserId = async (req,res) => {
    await ListsModel.find({userId: req.params.id}, (err,data) => {
      if(err) {
        res.json({message: err})
      } else {
        res.json(data)
      }
    })
      } 
		  
exports.updateList= async (req, res) => {
			await ListsModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{ $set: req.body },
			)
				.then((data) => res.json(data))
				.catch((err) => res.json({ message: err }));
		};

exports.removeSingleList = async (req, res) => {
	await ListsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
