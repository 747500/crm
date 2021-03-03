
import mongoose from 'mongoose'

const schema = new mongoose.Schema(
	{
		name: String
	},
	{
		discriminatorKey: 'kind',
	    timestamps: {
	        createdAt: 'ctime',
	        updatedAt: 'mtime'
	    }
	}
)

export default schema
