
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

import User from './User.mjs'

import { Doc, Person, Property, Contract } from './Doc/index.mjs'

// --------------------------------------------------------------------------

export default {
    User,
	Doc,
	Person,
	Property,
	Contract
}
