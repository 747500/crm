
function fts (a) {
    const fts = []

    //console.log('* FTS Doc:', this._doc)

    const walk = (o) => {

        Object.keys(o).map(k => {
            //console.log('>', k, typeof o[k])

            if ('kind' === k) {
                return
            }

            if ('fts' === k) {
                return
            }

            if ('string' === typeof o[k]) {
                fts.push(o[k])
                return
            }

            if ('object' !== typeof o[k]) {
                return
            }

            if (k === this._doc.kind) {
                walk(o[k])
                return
            }
        })

    }

    walk(this._doc)

    //console.log('* fts:', fts)

    return fts
}

export default fts
