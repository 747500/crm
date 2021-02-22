import mongoose from 'mongoose'

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

const docSchemaOptions = {
	discriminatorKey: 'kind',
    timestamps: {
        createdAt: 'ctime',
        updatedAt: 'mtime'
    }
}

const DocSchema = new mongoose.Schema(
	{
		time: Date
	},
	docSchemaOptions
);

DocSchema.virtual('fts').get(function (a) {
    const fts = []

//    console.log('doc>', this)

    Object.keys(this._doc).map(k => {
        if ('kind' === k)
            return

        if ('string' === typeof this[k]) {
            fts.push(this._doc[k])
        }
    })

//    console.log('\t', fts)

    return fts.join(' ')
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
            passport: String,
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
        ownerId: mongoose.Types.ObjectId,
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
	Doc,
	Person,
	Property,
	Contract
}
