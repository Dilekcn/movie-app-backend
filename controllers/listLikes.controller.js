const ListLikesModel = require('../model/ListLikes.model');

exports.getAll = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await ListLikesModel.find()
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
			.populate('listId','name description rating');  
			
		const total = await ListLikesModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	await ListLikesModel.find({ userId: req.body.userId,listId: req.body.listId } )
	.then(data=>{
		if(data.length>0){
		   ListLikesModel.findByIdAndDelete({ _id: data[0]._id })
		  .then((data) => res.json({ status: 200,message:"Removed from listlikes", data }))
		  .catch((err) => res.json({ status: false, message: err }));

		}else{
		   const newListLike = new ListLikesModel({
			   userId: req.body.userId,
			   listId: req.body.listId,
			   isActive: req.body.isActive, 
			   isDeleted: req.body.isDeleted,  
			 });   
   
          newListLike
		   .save() 
		   .then((response) => 
			   res.json({
				   status: 200,
				   message: 'New listlike is created successfully', 
				   response,
			   })
		   )
		   .catch((err) => res.json({ status: false, message: err }));
		}
	})
	.catch(err=>console.log(err))
};

exports.getSingleListLike = async (req, res) => {
	await ListLikesModel.findById({ _id: req.params.id }, (err, data) => {
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
    .populate('listId','name description rating');  
};

exports.getListLikesByUserId = async (req, res) => {
	await ListLikesModel.find({ userId: req.params.id }, (err, data) => {
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
	.populate('listId','name description rating');   
};
exports.getListLikesByListId = async (req, res) => {
	await ListLikesModel.find({ listId: req.params.id }, (err, data) => {
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
	.populate('listId','name description rating');   
};

exports.getWithQuery = async (req, res, next) => {

	try {
		const  query  = typeof req.body.query==="string" ?  JSON.parse(req.body.query) : req.body.query
	
		const response = await ListLikesModel.find(query)
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
		.populate('listId','name description rating');  

		res.json({status:200,message: 'Filtered ListLikes', response }); 
	} catch (error) {
		next({ status: 404, message: error });
	}
};

 