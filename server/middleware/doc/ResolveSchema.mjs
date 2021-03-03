
import model from '../../model/index.mjs'

const ResolveSchema = (req, res, next) => {

	const sName = req.params.schema || req.body.kind

	const sel = {
		'person': model.Person,
		'property': model.Property,
		'contract': model.Contract
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
