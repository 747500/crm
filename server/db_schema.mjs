import mongoose from 'mongoose'

//mongoose.Promise = global.Promise

// --------------------------------------------------------------------------

class Text extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'Text');
    }

    // `cast()` takes a parameter that can be anything. You need to
    // validate the provided `val` and throw a `CastError` if you
    // can't convert it.
    cast(val) {
        let _val = String(val);
        return _val;
    }
}

// Don't forget to add `Int8` to the type registry
mongoose.Schema.Types.Text = Text;

// --------------------------------------------------------------------------

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

// --------------------------------------------------------------------------

const docSchemaOptions = {
	discriminatorKey: 'kind',
    timestamps: {
        createdAt: 'ctime',
        updatedAt: 'mtime'
    }
}

const DocSchema = new mongoose.Schema(
	{
		user: mongoose.Types.ObjectId
	},
	docSchemaOptions
);

DocSchema.virtual('fts').get(function (a) {
    const fts = []

    //console.log('* FTS Doc:', this._doc)

    const walk = (o) => {

        Object.keys(o).map(k => {
            //console.log('>', k, typeof o[k])

            if ('kind' === k) {
                return
            }

            if ('fts' === k) {
                return
            }

            if ('string' === typeof o[k]) {
                fts.push(o[k])
                return
            }

            if ('object' !== typeof o[k]) {
                return
            }

            if (k === this._doc.kind) {
                walk(o[k])
                return
            }
        })

    }

    walk(this._doc)

    //console.log('* fts:', fts)

    return fts
})

const Doc = mongoose.model('Doc', DocSchema)

// --------------------------------------------------------------------------

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
            contact: [ContactSchema],
        },
        mainPicture: mongoose.Types.ObjectId,
    },
    docSchemaOptions
)

const Person = Doc.discriminator(
	'person',
    PersonSchema
)

// --------------------------------------------------------------------------

const PropertySchema = new mongoose.Schema(
	{
        property: {
            address: String,
            price: String,
            description: String,
        },
        owner: mongoose.Types.ObjectId,
        mainPicture: mongoose.Types.ObjectId,
	},
	docSchemaOptions
)

const Property = Doc.discriminator(
	'property',
    PropertySchema
)

// --------------------------------------------------------------------------

const ContractSchema = new mongoose.Schema(
    {
        contract: {
            title: String,
            description: String,
        },
        property: mongoose.Types.ObjectId,
        person: [ mongoose.Types.ObjectId ],
    },
    docSchemaOptions
)

const Contract = Doc.discriminator(
	'contract',
    ContractSchema
)


// --------------------------------------------------------------------------

//console.log(mongoose.modelSchemas)

export default {
    User,
	Doc,
	Person,
	Property,
	Contract
}
