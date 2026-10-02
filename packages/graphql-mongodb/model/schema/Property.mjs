
import mongoose from 'mongoose'


const schema = new mongoose.Schema(
	{
        property: {
            address: String,
            price: String,
            description: String,
        },
        owner: mongoose.Types.ObjectId,
        mainPicture: mongoose.Types.ObjectId,
	}
)

export default schema
