
import mongoose from 'mongoose'


const ContractSchema = new mongoose.Schema(
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

export default ContractSchema
