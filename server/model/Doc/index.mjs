
import mongoose from 'mongoose'

import DocSchema from './Doc.mjs'
import PersonSchema from './Person.mjs'
import PropertySchema from './Property.mjs'
import ContractSchema from './Contract.mjs'


const Doc = mongoose.model('Doc', DocSchema)

const Person = Doc.discriminator('person', PersonSchema)
const Property = Doc.discriminator('property', PropertySchema)
const Contract = Doc.discriminator('contract', ContractSchema)

export {
	Doc,
	Person,
	Property,
	Contract
}
