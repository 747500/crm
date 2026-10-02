
import fs from 'fs'

import moment from 'moment'
import async from 'async'

import CONFIG from '../config.mjs'

function Messages (msg) {

    const fromId = msg.from.id
    const userFolder = `${CONFIG.telegram.loggerDir}/${fromId}`
    const ts = moment().format('YYYY-MM-DD')
    const userHistoryFile = `${userFolder}/${ts}`

	console.log('* logger.Messages: ', msg)

    async.waterfall(
        [
            cb => {
                fs.mkdir(
                    userFolder,
                    {
                        recursive: true,
                        mode: 0o700
                    },
                    err => {
						if (err && 'EEXIST' === err.code) {
							cb()
							return
						}
						cb(err)
					}
                )
            },
            cb => {
                fs.appendFile(
                    userHistoryFile,
                    JSON.stringify({
                        timestamp: moment(),
                        message: msg,
                    }, false, 2) + '\n',
                    {
                        encoding: 'utf8',
                        mode: 0o640,
                        flag: 'a',
                    },
                    err => cb(err)
                )
            }
        ],
        err => {
            if (err) {
                console.error('* Message Logger:', err)
            }
        }
    )
}

export {
	Messages
}
