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
	discriminatorKey: 'kind'
}

const DocSchema = new mongoose.Schema(
	{
		time: Date
	},
	docSchemaOptions
);

DocSchema.index(
    {
        'firstName': 'text',
        'lastName': 'text',
        'middleName': 'text',
        'description': 'text',
        'address': 'text'

    }, {
        name: 'doc_text'
    }
)

const Doc = mongoose.model('Doc', DocSchema)

// --------------------------------------------------------------------------

const PersonSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        middleName: String,
        birthDay: Date,
        passport: Text
    },
    docSchemaOptions
)

PersonSchema.index({ '$**': 'text' }, { name: 'person_text' })

const Person = Doc.discriminator(
	'person',
    PersonSchema
)

// --------------------------------------------------------------------------

const PropertySchema = 	new mongoose.Schema(
	{
		address: String,
		description: Text,
	},
	docSchemaOptions
)

PropertySchema.index({'$**': 'text'}, { name: 'property_text' })

const Property = Doc.discriminator(
	'property',
    PropertySchema
)

// --------------------------------------------------------------------------

const ContractSchema = new mongoose.Schema(
    {
        title: String,
        description: Text,
        property: mongoose.Types.ObjectId,
        person: [ mongoose.Types.ObjectId ],
    },
    docSchemaOptions
)

ContractSchema.index({'$**': 'text'}, { name: 'contract_text' })

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
