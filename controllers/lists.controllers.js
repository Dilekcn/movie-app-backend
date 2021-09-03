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
				let:{"movieIds":"$movieIds"},
				pipeline:[
					{$match:{$expr:{$in:["$_id","$$movieIds"]}}},
					{$project:{type:1,imdb_id:1,imdb_rating:1,original_title:1,image_path:1,backdrop_path:1}},
				],
				as:'movieIds' 
			} 
		},
		{
            $lookup:{
				from:'users',
				let:{"userId":"$userId"},
				pipeline:[
					{$match:{$expr:{$eq:["$_id","$$userId"]}}},
					{$project:{firstname:1,lastname:1,mediaId:1}},
					{ $lookup:
						{
						   from: "media",
						   localField: "mediaId",
						   foreignField: "_id",
						   as: "mediaId"
						}
					}
					// {
					// 	$lookup:{
					// 		from:'medias',
					// 		let:{"mediaId":"$mediaId"},
					// 		pipeline:[
					// 			{$match:{$expr:{$eq:["$_id","$$mediaId"]}}},
					// 			{$project:{url:1}},
					// 		],
					// 		as:'mediaId'  
					// 	}
					// }
				],
				as:'userId'
			} 
		},
		
		{
            $lookup:{
				from:'comments',
				localField:"commentIds",
				foreignField:'listId', 
				as:'commentIds'
			}  
		},
	
		// {
        //     $lookup:{
		// 		from:'comments',
		// 		let:{"commentIds":mongoose.Types.ObjectId("$commentIds")},
		// 		pipeline:[
		// 			{$match:{$expr:{$eq:["$_id","$$commentIds"]}}},
		// 			{$project:{title:1}}
		// 		],
		// 		as:'commentIds' 
		// 	} 
		// },
		{
            $lookup:{
				from:'users',
				let:{"likes":"$likes"},
				pipeline:[
					{$match:{$expr:{$in:["$_id","$$likes"]}}},
					{$project:{firstname:1,lastname:1}}
				],
				as:'likes'
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
						let:{"movieIds":"$movieIds"},
						pipeline:[
							{$match:{$expr:{$in:["$_id","$$movieIds"]}}},
							{$project:{type:1,imdb_id:1,imdb_rating:1,original_title:1,image_path:1,backdrop_path:1}},
						],
						as:'movieIds' 
					} 
				},
				{
					$lookup:{
						from:'users',
						let:{"userId":"$userId"},
						pipeline:[
							{$match:{$expr:{$eq:["$_id","$$userId"]}}},
							{$project:{firstname:1,lastname:1,mediaId:1}},
							
							// {
							// 	$lookup:{
							// 		from:'medias',
							// 		let:{"mediaId":"$mediaId"},
							// 		pipeline:[
							// 			{$match:{$expr:{$eq:["$_id","$$mediaId"]}}},
							// 			{$project:{url:1}},
							// 		],
							// 		as:'mediaId'  
							// 	}
							// }
						],
						as:'userId'
					} 
				},
				{
					$lookup:{
						from:'users',
						let:{"likes":"$likes"},
						pipeline:[
							{$match:{$expr:{$in:["$_id","$$likes"]}}},
							{$project:{firstname:1,lastname:1}}
						],
						as:'likes'
					} 
				},
				{
					$lookup:{
						from:'comments',
						localField:"commentIds",
						foreignField:'listId', 
						as:'commentIds'
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
					let:{"movieIds":"$movieIds"},
					pipeline:[
						{$match:{$expr:{$in:["$_id","$$movieIds"]}}},
						{$project:{type:1,imdb_id:1,imdb_rating:1,original_title:1,image_path:1,backdrop_path:1}},
					],
					as:'movieIds' 
				} 
			},
			{
				$lookup:{
					from:'users',
					let:{"userId":"$userId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$userId"]}}},
						{$project:{firstname:1,lastname:1,mediaId:1}},
						
						// {
						// 	$lookup:{
						// 		from:'medias',
						// 		let:{"mediaId":"$mediaId"},
						// 		pipeline:[
						// 			{$match:{$expr:{$eq:["$_id","$$mediaId"]}}},
						// 			{$project:{url:1}},
						// 		],
						// 		as:'mediaId'  
						// 	}
						// }
					],
					as:'userId'
				} 
			},
			{
				$lookup:{
					from:'users',
					let:{"likes":"$likes"},
					pipeline:[
						{$match:{$expr:{$in:["$_id","$$likes"]}}},
						{$project:{firstname:1,lastname:1}}
					],
					as:'likes'
				} 
			},
			{
				$lookup:{
					from:'comments',
					localField:"commentIds",
					foreignField:'listId', 
					as:'commentIds'
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
