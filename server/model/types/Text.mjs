
import mongoose from 'mongoose'

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

export default Text
