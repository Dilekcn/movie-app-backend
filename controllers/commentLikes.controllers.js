const CommentLikesModel = require('../model/CommentLikes.model');

exports.getAll = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await CommentLikesModel.find()
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
			.populate('commentId','title content');  
			
		const total = await CommentLikesModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	await CommentLikesModel.find({ userId: req.body.userId,commentId: req.body.commentId } )
	.then(data=>{
		if(data.length>0){
		   CommentLikesModel.findByIdAndDelete({ _id: data[0]._id })
		  .then((data) => res.json({ status: 200,message:"Removed from commentlikes", data }))
		  .catch((err) => res.json({ status: false, message: err }));

		}else{
		   const newListLike = new CommentLikesModel({
			   userId: req.body.userId,
			   commentId: req.body.commentId,
			   isActive: req.body.isActive, 
			   isDeleted: req.body.isDeleted,  
			 });   
   
          newListLike
		   .save() 
		   .then((response) => 
			   res.json({
				   status: 200,
				   message: 'New commentlike is created successfully', 
				   response,
			   })
		   )
		   .catch((err) => res.json({ status: false, message: err }));
		}
	})
	.catch(err=>console.log(err))
};

exports.getSingleCommentLike = async (req, res) => {
	await CommentLikesModel.findById({ _id: req.params.id }, (err, data) => {
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
    .populate('commentId','title content');   
};

exports.getCommentLikesByUserId = async (req, res) => {
	await CommentLikesModel.find({ userId: req.params.id }, (err, data) => {
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
	.populate('commentId','title content');    
};
exports.getCommentLikesByCommentId = async (req, res) => {
	await CommentLikesModel.find({ commentId: req.params.id }, (err, data) => {
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
	.populate('commentId','title content');    
};

exports.getWithQuery = async (req, res, next) => {

	try {
		const  query  = typeof req.body.query==="string" ?  JSON.parse(req.body.query) : req.body.query
	
		const response = await CommentLikesModel.find(query)
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
		.populate('commentId','title content');   

		res.json({status:200,message: 'Filtered CommentLikes', response }); 
	} catch (error) {
		next({ status: 404, message: error });
	}
}; 


  