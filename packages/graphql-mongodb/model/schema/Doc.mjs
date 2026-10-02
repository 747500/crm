
import mongoose from 'mongoose'


const schema = new mongoose.Schema(
	{
		user: mongoose.Types.ObjectId
	},
	{
		discriminatorKey: 'kind',
	    timestamps: {
	        createdAt: 'ctime',
	        updatedAt: 'mtime'
	 	}
	}
);

export default schema
