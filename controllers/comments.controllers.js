const CommentsModel = require('../model/Comment.model');
const mongoose = require('mongoose');

exports.getAll =async (req,res)=>{

	const{page=1,limit=10}=req.query
	const total = await CommentsModel.find().countDocuments();
	await CommentsModel.aggregate(
	[ 
		{$sort:{createdAt: -1}},  
		{$skip:(page - 1) * limit}, 
		{$limit:limit*1},
		{ 
            $lookup:{ 
				from:'movies',
				let:{"movieId":"$movieId"},
				pipeline:[
					{$match:{$expr:{$eq:["$_id","$$movieId"]}}},
					{$project:{type:1,imdb_id:1,imdb_rating:1, 
						original_title:1,image_path:1,backdrop_path:1,
						runtime:1,release_date:1,genre:1,tmdb_id:1
					}},
				],
				as:'movieId' 
			} 
		},
		{
            $lookup:{ 
				from:'lists',
				let:{"listId":"$listId"},
				pipeline:[
					{$match:{$expr:{$eq:["$_id","$$listId"]}}},
					{$project:{name:1
					}},
				],
				as:'listId' 
			} 
		},
		{
            $lookup:{
				from:'users',
				let:{"userId":"$userId"},
				pipeline:[
					{$match:{$expr:{$eq:["$_id","$$userId"]}}},
					{$project:{firstname:1,lastname:1,mediaId:1}},  
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
					}
				],
				as:'userId'
			} 
		},
		{
            $lookup:{
				from:'commentlikes',
				localField:"_id",
				foreignField:'commentId', 
				as:'commentLikesCount'
			}, 
			
		}, 
		{
			$addFields: { commentLikesCount: { $size: "$commentLikesCount" } }  
		},
		{
			$project:{
				reasonToBlock:true,movieId:true,listId:true,isActive:true,
				isDeleted:true,userId:true,content:true,commentLikesCount:true,createdAt:true,
				updatedAt:true
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
	const newComment = await new CommentsModel({
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,
		listId: req.body.listId,
		isActive: req.body.isActive,
		movieId:req.body.movieId,
		reasonToBlock: req.body.reasonToBlock, 
		isDeleted: req.body.isDeleted,
	}); 

	newComment
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New comment is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.getSingleComment = async (req, res) => { 
		
	await CommentsModel.aggregate( 
		
		[
		  
			{
				$match: { _id: mongoose.Types.ObjectId(req.params.id) }
			},
			{
				$lookup:{ 
					from:'movies',
					let:{"movieId":"$movieId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$movieId"]}}},
						{$project:{type:1,imdb_id:1,imdb_rating:1, 
							original_title:1,image_path:1,backdrop_path:1,
							runtime:1,release_date:1,genre:1,tmdb_id:1
						}},
					],
					as:'movieId' 
				} 
			},
			{
				$lookup:{ 
					from:'lists',
					let:{"listId":"$listId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$listId"]}}},
						{$project:{name:1
						}},
					],
					as:'listId' 
				} 
			},
			{
				$lookup:{
					from:'users',
					let:{"userId":"$userId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$userId"]}}},
						{$project:{firstname:1,lastname:1,mediaId:1}},  
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
						}
					],
					as:'userId'
				} 
			},
			{
				$lookup:{
					from:'commentlikes',
					localField:"_id",
					foreignField:'commentId', 
					as:'commentLikesCount'
				}, 
				
			}, 
			{
				$addFields: { commentLikesCount: { $size: "$commentLikesCount" } }  
			},
			{
				$project:{
					reasonToBlock:true,movieId:true,listId:true,isActive:true,
					isDeleted:true,userId:true,content:true,commentLikesCount:true,createdAt:true,
					updatedAt:true
				} 
			},
		],
		(err,response)=>{
		if(err)res.json(err);
		res.json({response })
	}) 
}



exports.getCommentsByUserId = async (req, res) => {
	await CommentsModel.aggregate( 
		
		[
		   
			{
				$match: { userId: mongoose.Types.ObjectId(req.params.userid) }
			},
			{
				$lookup:{ 
					from:'movies',
					let:{"movieId":"$movieId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$movieId"]}}},
						{$project:{type:1,imdb_id:1,imdb_rating:1, 
							original_title:1,image_path:1,backdrop_path:1,
							runtime:1,release_date:1,genre:1,tmdb_id:1
						}},
					],
					as:'movieId' 
				} 
			},
			{
				$lookup:{ 
					from:'lists',
					let:{"listId":"$listId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$listId"]}}},
						{$project:{name:1
						}},
					],
					as:'listId' 
				} 
			},
			{
				$lookup:{
					from:'users',
					let:{"userId":"$userId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$userId"]}}},
						{$project:{firstname:1,lastname:1,mediaId:1}},  
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
						}
					],
					as:'userId'
				} 
			},
			{
				$lookup:{
					from:'commentlikes',
					localField:"_id",
					foreignField:'commentId', 
					as:'commentLikesCount'
				}, 
				
			}, 
			{
				$addFields: { commentLikesCount: { $size: "$commentLikesCount" } }  
			},
			{
				$project:{
					reasonToBlock:true,movieId:true,listId:true,isActive:true,
					isDeleted:true,userId:true,content:true,commentLikesCount:true,createdAt:true,
					updatedAt:true
				} 
			},
		],
		(err,response)=>{
		if(err)res.json(err);
		res.json({response })
	}) 
};
exports.getCommentsByList = async (req, res) => {
	await CommentsModel.aggregate( 
		
		[
		   
			{
				$match: { listId: mongoose.Types.ObjectId(req.params.listid) }
			},
			{
				$lookup:{ 
					from:'movies',
					let:{"movieId":"$movieId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$movieId"]}}},
						{$project:{type:1,imdb_id:1,imdb_rating:1, 
							original_title:1,image_path:1,backdrop_path:1,
							runtime:1,release_date:1,genre:1,tmdb_id:1
						}},
					],
					as:'movieId' 
				} 
			},
			{
				$lookup:{ 
					from:'lists',
					let:{"listId":"$listId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$listId"]}}},
						{$project:{name:1
						}},
					],
					as:'listId' 
				} 
			},
			{
				$lookup:{
					from:'users',
					let:{"userId":"$userId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$userId"]}}},
						{$project:{firstname:1,lastname:1,mediaId:1}},  
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
						}
					],
					as:'userId'
				} 
			},
			{
				$lookup:{
					from:'commentlikes',
					localField:"_id",
					foreignField:'commentId', 
					as:'commentLikesCount'
				}, 
				
			}, 
			{
				$addFields: { commentLikesCount: { $size: "$commentLikesCount" } }  
			},
			{
				$project:{
					reasonToBlock:true,movieId:true,listId:true,isActive:true,
					isDeleted:true,userId:true,content:true,commentLikesCount:true,createdAt:true,
					updatedAt:true
				} 
			},
		],
		(err,response)=>{
		if(err)res.json(err);
		res.json({response })
	}) 
};
exports.getCommentsByMovie = async (req, res) => {
	await CommentsModel.aggregate( 
		
		[
		   
			{
				$match: { movieId: mongoose.Types.ObjectId(req.params.movieid) }
			},
			{
				$lookup:{ 
					from:'movies',
					let:{"movieId":"$movieId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$movieId"]}}},
						{$project:{type:1,imdb_id:1,imdb_rating:1, 
							original_title:1,image_path:1,backdrop_path:1,
							runtime:1,release_date:1,genre:1,tmdb_id:1
						}},
					],
					as:'movieId' 
				} 
			},
			{
				$lookup:{ 
					from:'lists',
					let:{"listId":"$listId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$listId"]}}},
						{$project:{name:1
						}},
					],
					as:'listId' 
				} 
			},
			{
				$lookup:{
					from:'users',
					let:{"userId":"$userId"},
					pipeline:[
						{$match:{$expr:{$eq:["$_id","$$userId"]}}},
						{$project:{firstname:1,lastname:1,mediaId:1}},  
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
						}
					],
					as:'userId'
				} 
			},
			{
				$lookup:{
					from:'commentlikes',
					localField:"_id",
					foreignField:'commentId', 
					as:'commentLikesCount'
				}, 
				
			}, 
			{
				$addFields: { commentLikesCount: { $size: "$commentLikesCount" } }  
			},
			{
				$project:{
					reasonToBlock:true,movieId:true,listId:true,isActive:true,
					isDeleted:true,userId:true,content:true,commentLikesCount:true,createdAt:true,
					updatedAt:true
				} 
			},
		],
		(err,response)=>{
		if(err)res.json(err);
		res.json({response }) 
	}) 
};


exports.updateComment = async (req, res) => {
	await CommentsModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleComment = async (req, res) => {
	await CommentsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: false, message: err }));
}; 
