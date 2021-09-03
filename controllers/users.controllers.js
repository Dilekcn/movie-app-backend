const UserModel = require('../model/User.model');
const MediaModel = require('../model/Media.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const S3 = require('../config/aws.s3.config');

exports.getAllUsers = async (req, res) => {
	const{page=1,limit=10}=req.query
	const total = await UserModel.find().countDocuments();
	await UserModel.aggregate(
	[
		{
			$sort:
			{
			 createdAt: -1
			} 
		},
		{
			 $skip:(page - 1) * limit 
		},
		{
			 $limit:limit*1 
		},
	
		{ 
            $lookup:{
				from:'watcheds',
				localField:"_id",
				foreignField:'userId',
				as:'watched'
			}
		}, 
		{
            $lookup:{ 
				from:'likeds',
				localField:"_id",
				foreignField:'userId', 
				as:'liked'
			}
		},
	
		{
            $lookup:{ 
				from:'watchlists',
				localField:"_id",
				foreignField:'userId', 
				as:'watchlist'
			}
		},
		{
            $lookup:{ 
				from:'media',
				let:{"mediaId":"$mediaId"},
				pipeline:[
					{$match:{$expr:{$eq:["$_id","$$mediaId"]}}},
					{$project:{url:1}},
				],
				as:'mediaId' 
			} 
		},
		{
			$project:{
				firstname:true,lastname:true,email:true,password:true,country:true,role:true,isActive:true,isDeleted:true,mediaId:true,'watchlist.movieId':true,'watched.movieId':true,'liked.movieId':true,createdAt:true,updatedAt:true
			}
		},
	],
	(err,response)=>{
	if(err)res.json(err);
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	res.json({ total,pages, status: 200, response })
}) 
};


  
exports.getSingleUserById = async (req, res) => { 
	await UserModel.aggregate(
		[
			{
				$match: { _id: mongoose.Types.ObjectId(req.params.id) }
			},
			{
				$sort:
				{
				 createdAt: -1
				} 
			},
		
			{ 
				$lookup:{
					from:'watcheds',
					localField:"_id",
					foreignField:'userId',
					as:'watched'
				}
			}, 
			{
				$lookup:{ 
					from:'likeds',
					localField:"_id",
					foreignField:'userId', 
					as:'liked'
				}
			},
		
			{
				$lookup:{ 
					from:'watchlists',
					localField:"_id",
					foreignField:'userId', 
					as:'watchlist'
				}
			},
			{
				$lookup:{ 
					from:'media',
					let:{"mediaId":"$mediaId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$mediaId"]}}},
						{$project:{url:1}},
					],
					as:'mediaId'  
				} 
			},
			{
				$project:{
					firstname:true,lastname:true,email:true,password:true,country:true,role:true,isActive:true,isDeleted:true,mediaId:true,'watchlist.movieId':true,'watched.movieId':true,'liked.movieId':true,createdAt:true,updatedAt:true
				}
			},
		],
		(err,response)=>{ 
		if(err)res.json(err);
		res.json({response })
	}) 

};





exports.createUser = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			url: data.Location || null,
			title: 'users',
			mediaKey: data.Key,
			alt: 'users',
		});

		newMedia.save();

		const {
			firstname,
			lastname,
			email,
			password,
			country,
			isActive,
			isDeleted,
			role,
		

		} = req.body;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await new UserModel({
			firstname,
			lastname,
			email,
			country,
			mediaId: newMedia._id,
			password: hashedPassword,
			role,
			watchlist:[],
			watched:[],
			liked:[],
			isActive,
			isDeleted,
		});
		newUser
			.save()
			.then((response) =>
				res.json({ status: true, message: 'Signed up successfully.', response })
			)
			.catch((err) => res.json({ status: false, message: err }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	UserModel.findOne({ email: email })
	.populate('mediaId','url alt') 
		.then(async (data) => {
			if (await bcrypt.compare(password, data.password)) {
				const token = jwt.sign(
					{ name: email, role: data.role },
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: '1h' }
				)
				res.json({
					status: true,
					firstname: data.firstname,
					lastname: data.lastname,
					email: data.email,
					country: data.country,
					watchlist:data.watchlist,
					watched:data.watched,
					liked:data.liked,
					isActive: data.isActive,
					isDeleted: data.isDeleted,
					id: data._id,
					mediaId: data.mediaId,
					role: data.role,
					token: token,
				})
			} else {
				res.json({ status: false, message: 'Wrong password' });  
			}
		})
		.catch((err) => res.json({ message: 'Email does not exist' })); 
};

exports.updateUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			await MediaModel.findById({ _id: user.mediaId }).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: user.mediaId },
						{
							$set: {
								url: data.Location || null,
								title: 'users',
								mediaKey: data.Key,
								alt: req.body.alt || null,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ status: 404, message: err }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});
	
			await UserModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						firstname:req.body.firstname ? req.body.firstname : user.firstname,
						lastname:req.body.lastname ? req.body.lastname : user.lastname,
						country:req.body.country ? req.body.country : user.country,
						mediaId: user.mediaId,
						isActive: !req.body.isActive ? true : req.body.isActive,
						isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						role: !req.body.role ? user.role : req.body.role,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: true,
						message: 'User is updated successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: false, message: err }));
		})
		.catch((err) => res.json({ status: false, message: err }));
};

exports.deleteUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: user.mediaId },
				{
					$set: { isActive: false }, 
				},
				{ useFindAndModify: false, new: true }
			);
			await UserModel.findByIdAndRemove({ _id: req.params.id })
				.then((data) =>
					res.json({ message: 'User is deleted successfully', data })
				)
				.catch((err) => res.json({ message: err }));
		})
		.catch((err) => res.json({ message: err }));
};

// exports.deleteUser = async (req, res) => {
// 	await UserModel.findByIdAndDelete({ _id: req.params.id })
// 		.then(async (user) => {
// 			await MediaModel.findById({ _id: user.mediaId }).then(async (media) => {
// 				S3.deleteMedia(media.mediaKey);
// 				await MediaModel.findByIdAndDelete({ _id: user.mediaId });
// 			});
// 			res.json(user);
// 		})
// 		.then((data) => res.json({ message: 'User is removed successfully.', data }))
// 		.catch((err) => res.json({ message: err }));
// };
