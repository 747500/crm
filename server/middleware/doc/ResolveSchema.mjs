
import models from '../../db_schema.mjs'

const ResolveSchema = (req, res, next) => {

	const sName = req.params.schema || req.body.kind

	const sel = {
		'person': models.Person,
		'property': models.Property,
		'contract': models.Contract
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
