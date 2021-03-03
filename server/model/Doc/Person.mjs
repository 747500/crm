
import mongoose from 'mongoose'


const ContactSchema = new mongoose.Schema(
    {
        data: String,
        description: String
    }
)

const PersonSchema = new mongoose.Schema(
    {
        person: {
            firstName: String,
            lastName: String,
            middleName: String,
            birthDay: Date,
            comments: String,
            contact: [ ContactSchema ],
        },
        mainPicture: mongoose.Types.ObjectId,
    },
)

export default PersonSchema
