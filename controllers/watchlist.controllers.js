const WatchlistModel = require('../model/Watchlist.model');

exports.getAll = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await WatchlistModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate({
				path:'userId',
				model:'user',
				select:'firstname lastname mediaId',
				populate:{
					path:'mediaId',
					model:'media',
					select:'url'
				} 
			})	
			.populate('movieId','type imdb_id original_title');  
			
		const total = await WatchlistModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => { 
	
 await WatchlistModel.find({ userId: req.body.userId,movieId: req.body.movieId } )
	 .then(data=>{
		 if(data.length>0){
			console.log(data,'denem')
			WatchlistModel.findByIdAndDelete({ _id: data[0]._id })
	       .then((data) => res.json({ status: 200,message:"Removed from watchlist", data }))
	       .catch((err) => res.json({ status: false, message: err }));

		 }else{
			const newWatchList = new WatchlistModel({
				userId: req.body.userId,
				movieId: req.body.movieId,
				isActive: req.body.isActive, 
				isDeleted: req.body.isDeleted,  
			  });   
	
		newWatchList
			.save() 
			.then((response) =>
				res.json({
					status: 200,
					message: 'New watchlist is created successfully', 
					response,
				})
			)
			.catch((err) => res.json({ status: false, message: err }));
		 }
	 })
	 .catch(err=>console.log(err))
};

exports.getSingleWatchlist = async (req, res) => {
	await WatchlistModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ data });
		}
	})
	.populate({
        path:'userId',
        model:'user',
        select:'firstname lastname mediaId',
        populate:{
            path:'mediaId',
            model:'media',
            select:'url'
        }
    })
		.populate('movieId','type imdb_id original_title');
};

exports.getWatchlistByUserId = async (req, res) => {
	await WatchlistModel.find({ userId: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
	.populate({
        path:'userId',
        model:'user',
        select:'firstname lastname mediaId',
        populate:{
            path:'mediaId',
            model:'media',
            select:'url'
        }
    })
	.populate('movieId','type imdb_id original_title');  
};

exports.getWithQuery = async (req, res, next) => {

	try {
		const  query  = typeof req.body.query==="string" ?  JSON.parse(req.body.query) : req.body.query
	
		const response = await WatchlistModel.find(query)
		.populate({
			path:'userId',
			model:'user',
			select:'firstname lastname mediaId',
			populate:{
				path:'mediaId',
				model:'media',
				select:'url'
			}
		})
		.populate('movieId','type imdb_id original_title'); 

		res.json({status:200,message: 'Filtered Watched', response }); 
	} catch (error) {
		next({ status: 404, message: error });
	}
};

