const ListsModel = require('../model/List.model');
const UserRatingModel = require('../model/UserRatings.model');
const CommentModel = require('../model/Comment.model');
const mongoose = require('mongoose');
 

exports.getAll =async (req,res)=>{
	const{page=1,limit=10}=req.query
	const total = await ListsModel.find().countDocuments();
	await ListsModel.aggregate(
	[
		{$sort:{createdAt: -1}},
		{$skip:(page - 1) * limit}, 
		{$limit:limit*1},
		{
            $lookup:{
				from:'movies',
				localField:"movieIds",
				foreignField:'_id', 
				as:'movieIds'
			}
		},
		{
            $lookup:{
				from:'users',
				localField:"userId",
				foreignField:'_id', 
				as:'userId'
			}  
		},
         
		{
            $lookup:{
				from:'users',
				localField:"likes",
				foreignField:'_id', 
				as:'likes'
			}  
		},
		{
            $lookup:{
				from:'comments',
				localField:"comments",
				foreignField:'listId', 
				as:'comments'
			}  
		},
		// {
        //     $lookup:{
		// 		from:'users',
		// 		let:{userId:"$userId"},
		// 		pipeline:[
		// 			{$match:{$expr:{$eq:[mongoose.Types.ObjectId("$_id"),"$$userId"]}}},
		// 			{$project:{firstname:1}}
		// 		],
		// 		as:'likes'
		// 	} 
		// },
		{
            $lookup:{
				from:'userratings',
				localField:"userRatingIds",
				foreignField:'listId', 
				as:'userRatingIds'
			} 
		},
		
		
	],
	(err,response)=>{
	if(err)res.json(err);
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	res.json({ total,pages, status: 200, response })
}) 
}




exports.create = async (req, res) => {

	const {
		userId,
		name,
		description,
		isPublic,
		isActive, 
		isDeleted,
		rating,
		tags,
		userRatingIds
	} = req.body;
	const newList = await new ListsModel({
		userId,
		name,
		description,
		isPublic,
		isActive,
		isDeleted,
		rating,
		tags: tags.split(','),
		userRatingIds, 
		movieIds:JSON.parse(req.body.movieIds),
		likes:JSON.parse(req.body.likes)
		
	});
	newList
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
    }

	exports.getSingleList = async (req, res) => {
		
		await ListsModel.aggregate(
			
			[
	          
				{
					$match: { _id: mongoose.Types.ObjectId(req.params.id) }
				},
				{
					$lookup:{
						from:'movies',
						localField:"movieIds",
						foreignField:'_id', 
						as:'movieIds'
					}
				},
				{
					$lookup:{
						from:'users',
						localField:"userId",
						foreignField:'_id', 
						as:'userId'
					}  
				},
				{
					$lookup:{
						from:'users',
						localField:"likes",
						foreignField:'_id', 
						as:'likes'
					} 
				},
				{
					$lookup:{
						from:'comments',
						localField:"comments",
						foreignField:'listId', 
						as:'comments'
					}  
				},
				{
					$lookup:{
						from:'userratings',
						localField:"userRatingIds",
						foreignField:'listId', 
						as:'userRatingIds'
					} 
				},
				
				
			],
			(err,response)=>{
			if(err)res.json(err);
			res.json({response })
		}) 
	}





exports.getListByUserId = async (req, res) => {
		
	await ListsModel.aggregate(
			
		[
		  
			{
				$match: { userId: mongoose.Types.ObjectId(req.params.id) }
			},
			{
				$lookup:{
					from:'movies',
					localField:"movieIds",
					foreignField:'_id', 
					as:'movieIds'
				}
			},
			{
				$lookup:{
					from:'users',
					localField:"userId",
					foreignField:'_id', 
					as:'userId'
				}  
			},
			{
				$lookup:{
					from:'users',
					localField:"likes",
					foreignField:'_id', 
					as:'likes'
				} 
			},
			{
				$lookup:{
					from:'comments',
					localField:"comments",
					foreignField:'listId', 
					as:'comments'
				}  
			},
			{
				$lookup:{
					from:'userratings',
					localField:"userRatingIds",
					foreignField:'listId', 
					as:'userRatingIds'
				} 
			},
			
			
		],
		(err,response)=>{
		if(err)res.json(err);
		res.json({response })
	})  
};

exports.updateList = async (req, res) => {
		await ListsModel.findById({ _id: req.params.id })
			.then(async (list) => {

				const {userId,name,description,rating,tags,isPublic} =
					req.body;
				const newmovieids= typeof req.body.movieIds === 'string' ? JSON.parse(req.body.movieIds): req.body.movieIds
				await ListsModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							userId:userId ? userId : list.userId,
							name:name?name:list.name, 
							description:description ? description : list.description,
							rating:rating?rating:list.rating,
							tags: tags ? tags.split(',') : user.tags,
							movieIds:req.body.movieIds ? [...user.movieIds,newmovieids]:user.movieIds,
							isPublic:isPublic ? isPublic : list.isPublic,
							isActive: !req.body.isActive
								? true
								: req.body.isActive,
							isDeleted: !req.body.isDeleted
								? false
								: req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((data) =>
						res.json({
							status: 200,
							message: 'List is updated successfully', 
							data,
						})
					)
					.catch((err) => ({ status: 400, message: err })); 
			})
			.catch((err) => ({ status: 400, message: err }));
	
 
	// await ListsModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
	// 	.then((data) => res.json(data))
	// 	.catch((err) => res.json({ message: err })); 
};

exports.removeSingleList = async (req, res) => {
	await ListsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
