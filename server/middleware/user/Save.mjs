

const Save = (req, res, next) => {

	console.log('* mw.users.Save input\n', req.User.toObject())

	req.User.save()
	.then((result) => {
		console.log('* mw.users.Save result\n', result)
		next()
	})
	.catch(next)

}



export default Save
