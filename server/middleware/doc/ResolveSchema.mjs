
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
		res.status(400).send({
			status: 400,
			message: `Unknown Schema: "${sName}"`
		})
		return
	}

	next()
}

export default ResolveSchema
