
import mongoose from 'mongoose'


const PropertySchema = new mongoose.Schema(
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

export default PropertySchema
