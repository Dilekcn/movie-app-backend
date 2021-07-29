const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorysSchema = new Schema(
	{
		name: { type: String,unique:true },
		description: { type: String },
		movieCount: { type: Number },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('category', CategorysSchema);
