

function Errors (prefix){

	return err => {

		console.error('!', prefix, err)

	}
}


export {
	Errors,
}
