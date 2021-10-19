const MoviesModel = require('../model/Movies.model');
const MediaModel = require('../model/Media.model');
const UserModel = require('../model/User.model');
const UserRatingModel = require('../model/UserRatings.model');
const mongoose = require('mongoose');
require('dotenv').config();
const S3 = require('../config/aws.s3.config');

exports.getAll =async (req,res)=>{
	const{page=1,limit=10}=req.query
	const total = await MoviesModel.find().countDocuments();
	await MoviesModel.aggregate(
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
				from:'watchlists',
				localField:"_id",
				foreignField:'movieId',
				as:'watchlistCount'
			}, 
			
		}, 
		{
			$addFields: { watchlistCount: { $size: "$watchlistCount" } }  
		},
		{
            $lookup:{
				from:'watcheds',
				localField:"_id",
				foreignField:'movieId', 
				as:'watchedCount' 
			},
			
		},
		{
			$addFields: { watchedCount: { $size: "$watchedCount" } }
		}, 
		{
            $lookup:{
				from:'likeds',
				localField:"_id", 
				foreignField:'movieId',
				as:'likesCount'
			}, 
			
		},
		{
			$addFields: { likesCount: { $size: "$likesCount" } } 
		}, 
		{ 
            $lookup:{
				from:'userratings',
				localField:"_id",
				foreignField:'movieId', 
				as:'userRatingIds'
			} 
		},
		{
            $lookup:{
				from:'comments',
				localField:"_id",
				foreignField:'movieId', 
				as:'commentIds'
			}  
		},
		{
            $lookup:{
				from:'lists', 
				localField:"_id",
				foreignField:'movieIds',
				as:'listedCount'
			}, 
			
		}, 
		{
			$addFields: { listedCount: { $size: "$listedCount" } }  
		},
	
		{
			$project:{
				type:true,imdb_id:true,tmdb_id:true,imdb_rating:true,image_path:true,
				backdrop_path:true,original_title:true,isActive:true,isDeleted:true,
				'userRatingIds.rating':true,'userRatingIds.userId':true,
				watchlistCount:true,watchedCount:true,likesCount:true,
				commentIds:true,runtime:true,release_date:true,
				listedCount:true,commentLikes:true
			} 
		},
	
	],
	(err,response)=>{
	if(err)res.json(err);
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	res.json({ total,pages, status: 200, response })
}) 
}


exports.searchWithTitle = async (req, res, next) => {
	const total = await MoviesModel.find({ "original_title": { "$regex": req.body.original_title, "$options": "i" } }).countDocuments();
	try {
		const response = await MoviesModel.find({ "original_title": { "$regex": req.body.original_title, "$options": "i" } })
		res.json({status:200,total,message: 'Filtered movies', response }); 
	} catch (error) {
		next({ status: 404, message: error });
	}
};  

 
exports.create = async (req, res) => {
	await MoviesModel.findOne({tmdb_id:req.body.tmdb_id}, async (err, result) => { 
        
		if(err) res.json({status: false, message: err })

		if(result === null) {
			const newMovie = await new MoviesModel({
				type: req.body.type,
				imdb_id: req.body.imdb_id,
				tmdb_id:req.body.tmdb_id,
				imdb_rating:req.body.imdb_rating,
				image_path:req.body.image_path,
				backdrop_path:req.body.backdrop_path,
				original_title: req.body.original_title, 
				runtime:req.body.runtime,
				genre:req.body.genre,
				release_date:req.body.release_date,
				isActive: req.body.isActive,
				isDeleted: req.body.isDeleted,         

			});
		 
			await newMovie
				.save()
				.then(async(data) =>
				await MoviesModel.aggregate(
					[ 
						{
							$match: { tmdb_id:req.body.tmdb_id}  
						},
						{
							$lookup:{
								from:'watchlists',
								localField:"_id",
								foreignField:'movieId',
								as:'watchlistCount'
						}, 
							
						}, 
						{
							$addFields: { watchlistCount: { $size: "$watchlistCount" } }
						},
						{
							$lookup:{
								from:'watcheds',
								localField:"_id",
								foreignField:'movieId', 
								as:'watchedCount'
							},
							
						},
						{
							$addFields: { watchedCount: { $size: "$watchedCount" } }
						}, 
						{
							$lookup:{
								from:'likeds',
								localField:"_id", 
								foreignField:'movieId',
								as:'likesCount'
							}, 
							
						},
						{
							$addFields: { likesCount: { $size: "$likesCount" } } 
						}, 
						{ 
							$lookup:{
								from:'userratings',
								localField:"_id",
								foreignField:'movieId', 
								as:'userRatingIds'
							} 
						},
						{
							$lookup:{
								from:'comments',
								localField:"_id",
								foreignField:'movieId', 
								as:'commentIds'
							}  
						},
						{
							$lookup:{
								from:'lists', 
								localField:"_id",
								foreignField:'movieIds',
								as:'listedCount'
							}, 
							
						}, 
						{
							$addFields: { listedCount: { $size: "$listedCount" } }  
						},
						{
							$project:{
								type:true,imdb_id:true,tmdb_id:true,imdb_rating:true,
								image_path:true,backdrop_path:true,original_title:true,
								isActive:true,isDeleted:true,'userRatingIds.rating':true,
								'userRatingIds.userId':true,watchlistCount:true,watchedCount:true,
								likesCount:true,commentIds:true,runtime:true,release_date:true,
								listedCount:true
							} 
						},
					
					],
					(err,data)=>{
					if(err)res.json(err);
					res.json({ status: 200, data })
				})
				)
				.catch((err) => res.json({ status: false, message: err }))
					
		} else {
			await MoviesModel.aggregate(
				[ 
					{
						$match: { tmdb_id:req.body.tmdb_id}  
					},
					{
						$lookup:{
							from:'watchlists',
							localField:"_id",
							foreignField:'movieId',
							as:'watchlistCount'
					}, 
						
					}, 
					{
						$addFields: { watchlistCount: { $size: "$watchlistCount" } }
					},
					{
						$lookup:{
							from:'watcheds',
							localField:"_id",
							foreignField:'movieId', 
							as:'watchedCount'
						},
						
					},
					{
						$addFields: { watchedCount: { $size: "$watchedCount" } }
					}, 
					{
						$lookup:{
							from:'likeds',
							localField:"_id", 
							foreignField:'movieId',
							as:'likesCount'
						}, 
						
					},
					{
						$addFields: { likesCount: { $size: "$likesCount" } } 
					}, 
					{ 
						$lookup:{
							from:'userratings',
							localField:"_id",
							foreignField:'movieId', 
							as:'userRatingIds'
						} 
					},
					{
						$lookup:{
							from:'comments',
							localField:"_id",
							foreignField:'movieId', 
							as:'commentIds'
						}  
					},
					{
						$lookup:{
							from:'lists', 
							localField:"_id",
							foreignField:'movieIds',
							as:'listedCount'
						}, 
						
					}, 
					{
						$addFields: { listedCount: { $size: "$listedCount" } }  
					},
					{
						$project:{
							type:true,imdb_id:true,tmdb_id:true,imdb_rating:true,
							image_path:true,backdrop_path:true,original_title:true,
							isActive:true,isDeleted:true,'userRatingIds.rating':true,
							'userRatingIds.userId':true,watchlistCount:true,watchedCount:true,
							likesCount:true,commentIds:true,runtime:true,release_date:true,
							listedCount:true
						} 
					},
				
				],
				(err,data)=>{
				if(err)res.json(err);
				res.json({ status: 200, data })
			}) 
		}
	})
	
};
exports.getSingleMovie =async (req,res)=>{

	await MoviesModel.aggregate(
	[ 
		{
			$match: { _id: mongoose.Types.ObjectId(req.params.id) }
		},
		 {
            $lookup:{
				from:'watchlists',
				localField:"_id",
				foreignField:'movieId',
				as:'watchlistCount' 
			}, 
			
		},
		{
			$addFields: { watchlistCount: { $size: "$watchlistCount" } }
		},
		{
            $lookup:{
				from:'watcheds',
				localField:"_id",
				foreignField:'movieId',
				as:'watchedCount'
			},
			 
		},
		{
			$addFields: { watchedCount: { $size: "$watchedCount" } }
		},
		{
            $lookup:{
				from:'likeds',
				localField:"_id",
				foreignField:'movieId',
				as:'likesCount'
			}, 
			
		},
		{
			$addFields: { likesCount: { $size: "$likesCount" } } 
		}, 
		{ 
            $lookup:{
				from:'userratings',
				localField:"_id",
				foreignField:'movieId', 
				as:'userRatingIds'
			} 
		},
		{
			$lookup:{
				from:'lists', 
				localField:"_id",
				foreignField:'movieIds',
				as:'listedCount'
			}, 
			
		}, 
		{
			$addFields: { listedCount: { $size: "$listedCount" } }  
		},
		{
			$project:{
				type:true,imdb_id:true,tmdb_id:true,imdb_rating:true,
				image_path:true,backdrop_path:true,original_title:true,
				isActive:true,isDeleted:true,'userRatingIds.rating':true,
				'userRatingIds.userId':true,runtime:true,genre:true,release_date:true,
				watchlistCount:true,watchedCount:true,likesCount:true,
				listedCount:true
			} 
		},
	
	],
	(err,response)=>{
	if(err)res.json(err);
	res.json({status: 200, response })
}) 
}




exports.updateSingleMovie = async (req, res) => {
	await MoviesModel.findById({ _id: req.params.id })
		.then(async (movie) => {
			await MoviesModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {  
						type:req.body.type ?req.body.type:movie.type ,
						imdb_id:req.body.imdb_id ?req.body.imdb_id : movie.imdb_id ,
						tmdb_id:req.body.tmdb_id ? req.body.tmdb_id : movie.tmdb_id,
						imdb_rating:req.body.imdb_rating ? req.body.imdb_rating :movie.imdb_rating,
						original_title:req.body.original_title ? req.body.original_title :movie.original_title,
						image_path:req.body.image_path ? req.body.image_path :movie.image_path,
						backdrop_path:req.body.backdrop_path ? req.body.backdrop_path : movie.backdrop_path,
						runtime:req.body.runtime ? req.body.runtime:movie.runtime,
						genre:req.body.genre ? req.body.genre : movie.genre,
						release_date:req.body.release_date ? req.body.release_date : movie.release_date,
						isActive: !req.body.isActive
								? movie.isActive 
								: req.body.isActive,
						isDeleted: !req.body.isDeleted
								? movie.isDeleted
								: req.body.isDeleted,
					}, 
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: 200,
						message: 'Movie is updated successfully',
						data,
					})
				) 
				.catch((err) => ({ status: 400, message: err })); 
		})
		.catch((err) => ({ status: 400, message: err }));

		await MoviesModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err })); 
}; 
 

exports.getSingleMovieByTmdb = async (req, res) => {
	await MoviesModel.aggregate(
		[ 
			{
				$match: { tmdb_id: req.params.tmdbid } 
			},
			 {
				$lookup:{
					from:'watchlists',
					localField:"_id",
					foreignField:'movieId',
					as:'watchlistCount' 
				}, 
				
			},
			{
				$addFields: { watchlistCount: { $size: "$watchlistCount" } }
			},
			{
				$lookup:{
					from:'watcheds',
					localField:"_id",
					foreignField:'movieId',
					as:'watchedCount'
				},
				 
			},
			{
				$addFields: { watchedCount: { $size: "$watchedCount" } }
			},
			{
				$lookup:{
					from:'likeds',
					localField:"_id",
					foreignField:'movieId',
					as:'likesCount'
				}, 
				
			},
			{
				$addFields: { likesCount: { $size: "$likesCount" } } 
			}, 
			{ 
				$lookup:{
					from:'userratings',
					localField:"_id",
					foreignField:'movieId', 
					as:'userRatingIds'
				} 
			},
			{
				$lookup:{
					from:'lists', 
					localField:"_id",
					foreignField:'movieIds',
					as:'listedCount'
				}, 
				
			}, 
			{
				$addFields: { listedCount: { $size: "$listedCount" } }  
			},
			{
				$project:{
					type:true,imdb_id:true,tmdb_id:true,imdb_rating:true,image_path:true,
					backdrop_path:true,original_title:true,isActive:true,isDeleted:true,
					'userRatingIds.rating':true,'userRatingIds.userId':true,runtime:true,
					genre:true,release_date:true,watchlistCount:true,watchedCount:true,likesCount:true,
					listedCount:true
				} 
			},
		
		],
		(err,response)=>{
		if(err)res.json(err);
		res.json({status: 200, response })
	}) 
};


exports.removeSingleMovie = async (req, res) => {
	await MoviesModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err })); 
};
