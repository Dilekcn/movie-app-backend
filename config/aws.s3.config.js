const AWS = require('aws-sdk');
require('dotenv').config();
const Access_Key = process.env.Access_Key_ID;
const Secret_Key = process.env.Secret_Access_Key;
const Bucket_Name = process.env.Bucket_Name;
const uuid = require('uuid');
const fs = require('fs');

const S3 = new AWS.S3({
	accessKeyId: Access_Key,
	secretAccessKey: Secret_Key,
});
 
const uploadNewMedia = (req, res, callback) => {
	const file = __dirname + '/noImage.jpg';
	const data = fs.readFileSync(file); 
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files ? req.files.mediaId ? req.files.mediaId.data : data : data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json(err);  
		callback(data);
	}); 
}; 
const uploadNewMediaForTrailer = (req, res, callback) => {
	const file = __dirname + '/noImage.jpg';
	const data = fs.readFileSync(file); 
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files ? req.files.mediaUrl ? req.files.mediaUrl.data : data : data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json(err); 
		callback(data);
	}); 
}; 
 
const uploadUserBackgroundImage = async (req, res, callback) => {
	const file = __dirname + '/user-background-default-image.jpg'; 
	const data = fs.readFileSync(file);
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files ? req.files.backgroundImageId ? req.files.backgroundImageId.data : data : data,
		ContentType: 'image/JPG',
	};
	 await S3.upload(params, async (err, data) => {
		if (err) return res.json(err);
		callback(data)
	});	
};  
  
const uploadNewBanner = (req, res, callback) => {
	const file = __dirname + '/noImage.jpg';
	const data = fs.readFileSync(file);
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files ? req.files.bannerId.data : data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json(err);
		callback(data);
	});
};

const uploadNewLogo = (req, res, callback) => {
	const file = __dirname + '/noImage.jpg';
	const data = fs.readFileSync(file);
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files ? req.files.logo.data : data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json(err);
		callback(data);
	});
};

const updateMedia = (req, res, mediaKey, callback) => {
	if (req.files) {
		if(req.files.mediaId) {
			const params = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: req.files ? req.files.mediaId.data : null,
				ContentType: 'image/JPG',
			};
			S3.upload(params, (err, data) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(data);
			});
		}
	} else {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
		};

		S3.getObject(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });

			const updateParams = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: data.Body,
				ContentType: 'image/JPG',
			};
			S3.upload(updateParams, (err, updateData) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(updateData);
			});
		});
	}
};

const updateBackgroundImage = (req, res, mediaKey, callback) => {
	if (req.files) {
		if(req.files.backgroundImageId) {
			const params = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: req.files.backgroundImageId ? req.files.backgroundImageId.data : null,
				ContentType: 'image/JPG',
			};
			S3.upload(params, (err, data) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(data);
			});
		}
	} else {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
		};

		S3.getObject(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });

			const updateParams = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: data.Body,
				ContentType: 'image/JPG',
			};
			S3.upload(updateParams, (err, updateData) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(updateData);
			});
		});
	}
};

const updateBanner = (req, res, mediaKey, callback) => {
	if (req.files) {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
			Body: req.files ? req.files.bannerId.data : null,
			ContentType: 'image/JPG',
		};
		S3.upload(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });
			callback(data);
		});
	} else {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
		};

		S3.getObject(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });

			const updateParams = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: data.Body,
				ContentType: 'image/JPG',
			};
			S3.upload(updateParams, (err, updateData) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(updateData);
			});
		});
	}
};

const updateLogo = (req, res, mediaKey, callback) => {
	if (req.files) {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
			Body: req.files ? req.files.logo.data : null,
			ContentType: 'image/JPG',
		};
		S3.upload(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });
			callback(data);
		});
	} else {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
		};

		S3.getObject(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });

			const updateParams = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: data.Body,
				ContentType: 'image/JPG',
			};
			S3.upload(updateParams, (err, updateData) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(updateData);
			});
		});
	}
};

const deleteMedia = (mediaKey) => {
	const params = {
		Bucket: Bucket_Name,
		Key: mediaKey,
	};

	S3.deleteObject(params).promise();
};

module.exports = {
	uploadNewMedia,
	uploadNewBanner,
	uploadNewLogo,
	updateMedia,
	updateBanner,
	updateLogo,
	deleteMedia,
	uploadUserBackgroundImage,
	updateBackgroundImage,
	uploadNewMediaForTrailer
};
