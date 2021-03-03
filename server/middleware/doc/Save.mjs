

const docSave = (req, res, next) => {

	const doc = res.locals.Doc

	//console.log('* docSave input\n', doc.toObject())

	doc.save()
	.then((result) => {
		//console.log('* docSave result\n', result)
		next()
	})
	.catch(next)

}



export default docSave
