
import { Person, Property, Contract } from '../../model/index.mjs'

const ResolveSchema = (req, res, next) => {

	const sName = req.params.schema || req.body.kind

	const sel = {
		'person': Person,
		'property': Property,
		'contract': Contract
	}

	res.locals.Schema = sel[sName]
	res.locals.kind = sName

	if (! res.locals.Schema ) {
		next(Error(`Undefined Schema: ${sName}`))
		return
	}

	next()
}

export default ResolveSchema
