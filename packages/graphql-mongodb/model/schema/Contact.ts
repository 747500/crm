
import mongoose from 'mongoose'


const schema = new mongoose.Schema(
    {
        data: String,
        description: String
    }
)

export default schema
