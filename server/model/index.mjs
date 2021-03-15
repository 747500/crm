
import mongoose from 'mongoose'


import * as types from './types/index.mjs'
import * as schema from './schema/index.mjs'
import * as virtuals from './virtuals/index.mjs'


//
//  Types
//
mongoose.Schema.Types.Text = types.Text


//
//  Virtuals
//
schema.Doc.virtual('fts').get(virtuals.fts)


//
//  Models
//
const User = mongoose.model('User', schema.User)

const Doc = mongoose.model('Doc', schema.Doc)
const Person = Doc.discriminator('person', schema.Person)
const Property = Doc.discriminator('property', schema.Property)
const Contract = Doc.discriminator('contract', schema.Contract)


export {
    User,
    Doc,
    Person,
    Property,
    Contract,
}

export default {
    User,
    Doc,
    Person,
    Property,
    Contract,
}
