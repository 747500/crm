
import mongoose from 'mongoose'


const schema = new mongoose.Schema(
    {
        contract: {
            title: String,
            description: String,
        },
        property: mongoose.Types.ObjectId,
        person: [ mongoose.Types.ObjectId ],
    },
    //docSchemaOptions
)

export default schema
