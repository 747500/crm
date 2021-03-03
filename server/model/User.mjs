
import mongoose from 'mongoose'


const UserSchemaOptions = {
	discriminatorKey: 'kind',
    timestamps: {
        createdAt: 'ctime',
        updatedAt: 'mtime'
    }
}

const UserSchema = new mongoose.Schema(
	{
		name: String
	},
	UserSchemaOptions
);

const User = mongoose.model('User', UserSchema)

export default User
