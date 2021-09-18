const MediaModel = require('../model/Media.model');
const AWS = require('aws-sdk');
require('dotenv').config();
const Access_Key = process.env.Access_Key_ID;
const Secret_Key = process.env.Secret_Access_Key;
const Bucket_Name = process.env.Bucket_Name;

exports.getAllMedia = async (req, res) => {   
	try {  
		const { page = 1, limit } = req.query;
		const response = await MediaModel.find()  
		.limit(limit * 1)
		.skip((page - 1) * limit) 
		.sort({ createdAt: -1 });
		const total = await MediaModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);   
		res.json({ total: total, pages, status: 200, response });  
	   } catch (e) { 
		res.status(500).json(e);  
	   } 
};   

exports.createMedia = async (req, res) => {
	const files = req.files.image;
	const s3 = new AWS.S3({
		accessKeyId: Access_Key,
		secretAccessKey: Secret_Key,
	});    
	const params = {
		Bucket: Bucket_Name,
		Key: req.files.image.name,
		Body: req.files.image.data,
		ContentType: files.mimetype, 
	}; 
	s3.upload(params, async (err, data) => { 
		if (err) {
			res.json(err);
		} else {
			const newMedia = await new MediaModel({
				url: data.Location,
				title: req.body.title,
				description: req.body.description,
				isHomePage: req.body.isHomePage,
				isActive: req.body.isActive,
				isDeleted: req.body.isDeleted,
				type:params.ContentType
			});
			newMedia
				.save()
				.then((response) =>
					res.json({ message: 'Media Created', status: true, response })
				)
				.catch((err) => res.json({ message: err, status: false }));
		}
	});
}; 

exports.getSingleMedia = async (req, res) => {
	await MediaModel.findById({ _id: req.params.mediaId }, (err, data) => {
		if (err) {
			res.json({ message: err, status: false });
		} else {
			res.json(data);
		}
	});
};

exports.updateSingleMedia = async (req, res) => {
	await MediaModel.findByIdAndUpdate({ _id: req.params.mediaId }, { $set: req.body })
		.then((data) => res.json({ message: 'Media updated', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.removeSingleMedia = async (req, res) => {
	await MediaModel.findByIdAndDelete({ _id: req.params.mediaId })
		.then((data) => res.json({ message: 'Media removed', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
}; 
 