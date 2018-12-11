import imaLoader from './ima-loader'
import ImaPlayer from './ima-player'
import {makeNum} from './utils'

// IMA ad player factory
export default function (options, cb) {
  imaLoader((success) => {
    if (! success) {
      return cb(null, new Error('Failed to load IMA SDK'))
    }

    cb(new ImaPlayer(options), null)
  }, makeNum(options.timemout, 6000), !!options.debug)
}
