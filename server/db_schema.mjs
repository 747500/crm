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

const docSchema = new mongoose.Schema(
	{
		time: Date
	},
	docSchemaOptions
);

const Doc = mongoose.model('Doc', docSchema)

const Person = Doc.discriminator(
	'person',
	new mongoose.Schema(
		{
			firstName: String,
			lastName: String,
			middleName: String,
			birthDay: Date,
			passport: Text,
		},
		docSchemaOptions
	)
)

const Property = Doc.discriminator(
	'property',
	new mongoose.Schema(
		{
			address: String,
			description: Text,
		},
		docSchemaOptions
	)
)

const Contract = Doc.discriminator(
	'contract',
	new mongoose.Schema(
		{
			property: mongoose.Types.ObjectId,
			person: [ mongoose.Types.ObjectId ],
		},
		docSchemaOptions
	)
)

export default {
	Doc,
	Person,
	Property,
	Contract
}
