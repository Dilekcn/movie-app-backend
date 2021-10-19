const WatchedModel = require('../model/Watched.model');

exports.getAll = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await WatchedModel.find()
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
			
		const total = await WatchedModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	await WatchedModel.find({ userId: req.body.userId,movieId: req.body.movieId } )
	.then(data=>{
		if(data.length>0){
		   WatchedModel.findByIdAndDelete({ _id: data[0]._id })
		  .then((data) => res.json({ status: 200,message:"Removed from watched", data }))
		  .catch((err) => res.json({ status: false, message: err }));

		}else{
		   const newWatched = new WatchedModel({
			   userId: req.body.userId,
			   movieId: req.body.movieId,
			   isActive: req.body.isActive, 
			   isDeleted: req.body.isDeleted,  
			 });   
   
	   newWatched
		   .save() 
		   .then((response) => 
			   res.json({
				   status: 200,
				   message: 'New watched is created successfully', 
				   response,
			   })
		   )
		   .catch((err) => res.json({ status: false, message: err }));
		}
	})
	.catch(err=>console.log(err))
};

exports.getSingleWatched = async (req, res) => {
	await WatchedModel.findById({ _id: req.params.id }, (err, data) => {
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

exports.getWatchedByUserId = async (req, res) => {
	await WatchedModel.find({ userId: req.params.id }, (err, data) => {
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
	
		const response = await WatchedModel.find(query)
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

