export default `

	type User {
		id: ID!,
		name: String!,
		notifyBirthdayAt: String,
		notifyTelegramId: String,
		ctime: String!,
		mtime: String,
		version: String,
	},

	interface Doc {
		id: ID!,
		ctime: String!,
		mtime: String!,
		version: String,
	},

	type PersonContactData {
		_id: ID,
		data: String,
		description: String
	},

	type PersonData {
		firstName: String,
		middleName: String,
		lastName: String,
		birthDay: String,
		comments: String,
		contact: [PersonContactData!],
	}

	type Person implements Doc {
		id: ID!,
		ctime: String!,
		mtime: String!,
		version: String,
		person: PersonData,
	},

	type PropertyData {
		address: String,
		price: String,
		description: String,
	},

	type Property implements Doc {
		id: ID!,
		ctime: String!,
		mtime: String!,
		version: String,
		property: PropertyData,
		owner: String,
		mainPicture: String,
	},

	type ContractData {
		title: String,
		description: String,
	},

	type Contract implements Doc {
		id: ID!,
		ctime: String!,
		mtime: String!,
		version: String,
		contract: ContractData,
	},

	union Docs = Person | Property | Contract,

	type Query {

		user(id: ID!): User,
		users(notified: Boolean): [User],

		doc(id: ID!): Docs,
		docs: [Docs],

	}

`;
