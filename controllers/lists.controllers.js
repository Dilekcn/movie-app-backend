const ListsModel = require('../model/List.model');
const UserRatingModel = require('../model/UserRatings.model');
const CommentModel = require('../model/Comment.model');
const MovieModel = require('../model/Movies.model');
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
					{$project:{type:1,imdb_id:1,imdb_rating:1, 
						original_title:1,image_path:1,backdrop_path:1,
						runtime:1,release_date:1,genre:1,tmdb_id:1
					}},
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
				from:'comments',
				localField:"_id",
				foreignField:'listId', 
				as:'commentIds'
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
				from:'userratings',
				localField:"_id", 
				foreignField:'listId', 
				as:'userRatingIds'
			} 
		},
	
		{
            $lookup:{
				from:'listlikes',
				localField:"_id",
				foreignField:'listId', 
				as:'listLikesCount'
			}, 
			
		}, 
		{
			$addFields: { listLikesCount: { $size: "$listLikesCount" } }  
		},
		{
			$project:{
				reasonToBlock:true,likes:true,rating:true,tags:true,movieIds:true,isPublic:true,isActive:true,
				isDeleted:true,userId:true,name:true,description:true,'userRatingIds.rating':true,'userRatingIds.userId':true,
				'commentIds.userId':true,'commentIds.title':true,'commentIds.content':true,listLikesCount:true
			} 
		},

		 
	],
	(err,response)=>{
	if(err)res.json(err);
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	res.json({ total,pages, status: 200, response })
}) 
}


exports.getPopular =async (req,res)=>{

	const{page=1,limit=10}=req.query
	const total = await ListsModel.find().countDocuments();
	await ListsModel.aggregate(
	[ 
		{$sort:{rating: -1}},  
		{$skip:(page - 1) * limit}, 
		{$limit:limit*1}, 
		{
            $lookup:{ 
				from:'movies',
				let:{"movieIds":"$movieIds"},
				pipeline:[
					{$match:{$expr:{$in:["$_id","$$movieIds"]}}},
					{$project:{type:1,tmdb_id:1,imdb_id:1,imdb_rating:1,original_title:1,image_path:1,backdrop_path:1,runtime:1,release_date:1,genre:1}},
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
				from:'comments',
				localField:"_id",
				foreignField:'listId', 
				as:'commentIds'
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
				from:'userratings',
				localField:"_id", 
				foreignField:'listId', 
				as:'userRatingIds' 
			} 
		},
		{
            $lookup:{
				from:'listlikes',
				localField:"_id",
				foreignField:'listId', 
				as:'listLikesCount' 
			}, 
			
		}, 
		{
			$addFields: { listLikesCount: { $size: "$listLikesCount" } }  
		},
		{
			$project:{
				reasonToBlock:true,likes:true,rating:true,tags:true,movieIds:true,isPublic:true,isActive:true,
				isDeleted:true,userId:true,name:true,description:true,'userRatingIds.rating':true,'userRatingIds.userId':true,
				'commentIds.userId':true,'commentIds.title':true,'commentIds.content':true,listLikesCount:true
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
	const movieRatings =[];
	await Promise.all(
	 JSON.parse(req.body.movieIds).map(async(item)=>{
	  await MovieModel.find({_id:item},(err,data)=>{
		 if (err) {
		  res.json({ status: false, message: err });
		 } else {
		movieRatings.push(data[0].imdb_rating*1)  
		 }
		})
	   })
	)
	   const movieRatingAverage = (movieRatings.reduce((a,b)=>a+b)/JSON.parse(req.body.movieIds).length).toFixed(1)
    
	const {
		userId,
		name,
		description,
		isPublic,
		isActive, 
		isDeleted, 
		rating,
		userRatingIds
	} = req.body;
	
	const newList = await new ListsModel({  
		userId,
		name,
		description,
		isPublic,
		isActive,
		isDeleted, 
		rating:movieRatingAverage,
		tags:req.body.tags ? req.body.tags.split(','):[],
		userRatingIds, 
		movieIds:JSON.parse(req.body.movieIds), 
		
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
							{$project:{type:1,imdb_id:1,tmdb_id:1,imdb_rating:1,original_title:1,image_path:1,backdrop_path:1,tmdb_id:1}},
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
						from:'comments',
						localField:"_id",
						foreignField:'listId', 
						as:'commentIds'
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
						from:'userratings',
						localField:"_id", 
						foreignField:'listId', 
						as:'userRatingIds'
					} 
				},
				{
					$lookup:{
						from:'listlikes',
						localField:"_id",
						foreignField:'listId', 
						as:'listLikesCount'
					}, 
					
				}, 
				{
					$addFields: { listLikesCount: { $size: "$listLikesCount" } }  
				},
				{
					$project:{
						reasonToBlock:true,likes:true,rating:true,tags:true,movieIds:true,isPublic:true,isActive:true,
						isDeleted:true,userId:true,name:true,description:true,'userRatingIds.rating':true,'userRatingIds.userId':true,
						'commentIds.userId':true,'commentIds.title':true,'commentIds.content':true,listLikesCount:true
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
						{$project:{type:1,imdb_id:1,tmdb_id:1,imdb_rating:1,original_title:1,image_path:1,backdrop_path:1}},
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
			{
				$lookup:{
					from:'listlikes',
					localField:"_id",
					foreignField:'listId', 
					as:'listLikesCount'
				}, 
				
			}, 
			{
				$addFields: { listLikesCount: { $size: "$listLikesCount" } }  
			},
			{
				$project:{
					reasonToBlock:true,likes:true,rating:true,tags:true,movieIds:true,isPublic:true,isActive:true,
					isDeleted:true,userId:true,name:true,description:true,'userRatingIds.rating':true,'userRatingIds.userId':true,
					'commentIds.userId':true,'commentIds.title':true,'commentIds.content':true,listLikesCount:true
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
				
				const {reasonToBlock,userId,name,description,rating,tags,likes,isPublic} =
					req.body; 
				const newmovieids= typeof req.body.movieIds === 'string' ? JSON.parse(req.body.movieIds): req.body.movieIds
              
				const updatedMovies = []
				if(req.body.movieIds){
					newmovieids.map(item=>{
						if(!list.movieIds.includes(item)){
							updatedMovies.push(item)
						}
					})
				}
				 
		    
				const indexLikes = list.likes.indexOf(req.body.likes)
				const updatedLikes= indexLikes>-1 
				? list.likes.filter((item,index)=> index!==indexLikes)
				:[...list.likes,req.body.likes]
				
				await ListsModel.findByIdAndUpdate(	 		
					{ _id: req.params.id },
					{
						$set: { 
							userId:userId ? userId : list.userId,  
							name:name?name:list.name, 
							description:description ? description : list.description,
							rating:rating?rating:list.rating,
							tags: tags ? tags.split(',') : list.tags,
							movieIds:req.body.movieIds ? list.movieIds.concat(updatedMovies):list.movieIds,
							isPublic:isPublic ? isPublic : list.isPublic,
							likes:likes ? updatedLikes:list.likes,
							reasonToBlock:reasonToBlock ? reasonToBlock :req.body.reasonToBlock,
							isActive: !req.body.isActive
								? list.isActive 
								: req.body.isActive,
							isDeleted: !req.body.isDeleted
								? list.isDeleted
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
};

exports.searchWithName = async (req, res, next) => {
	const total = await ListsModel.find({ "name": { "$regex": req.body.name, "$options": "i" } }).countDocuments();
	try {
		const response = await ListsModel.find({ "name": { "$regex": req.body.name, "$options": "i" } })
		res.json({status:200,total,message: 'Filtered lists', response }); 
	} catch (error) {
		next({ status: 404, message: error });
	}   
}; 

exports.removeMovieFromList = async (req, res) => { 
	await ListsModel.findById({ _id: req.params.id })
		.then(async (list) => {
	//    const toRemove= typeof req.body.movieIds === 'string' ? JSON.parse(req.body.movieIds): req.body.movieIds	
    const updatedMovieIds = list.movieIds.filter(item=>!req.body.movieIds.includes(item)) 
     console.log(updatedMovieIds)

			await ListsModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						userId:list.userId, 
						name:list.name, 
						description:list.description,
						rating:list.rating,
						tags:list.tags,
						movieIds:updatedMovieIds,
						isPublic:list.isPublic,
						likes:list.likes,
						isActive: list.isActive,
						isDeleted: list.isDeleted,
						reasonToBlock:list.reasonToBlock
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: 200,
						message: 'Movie is removed successfully', 
						data,
					})
				)
				.catch((err) => ({ status: 400, message: err })); 
		})
		.catch((err) => ({ status: 400, message: err }));
};

 
exports.removeSingleList = async (req, res) => {
	await ListsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err })); 
};
