
import mongoose from 'mongoose'

import Contact from './Contact.mjs'


const schema = new mongoose.Schema(
    {
        person: {
            firstName: String,
            lastName: String,
            middleName: String,
            birthDay: Date,
            comments: String,
            contact: [ Contact ],
        },
        mainPicture: mongoose.Types.ObjectId,
    },
)

export default schema
