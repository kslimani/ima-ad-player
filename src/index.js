import imaLoader from './ima-loader'
import ImaPlayer from './ima-player'
import {makeNum} from './utils'

// IMA ad player factory
function factory(options, cb) {
  imaLoader((success) => {
    if (! success) {
      return cb(null, new Error('Failed to load IMA SDK'))
    }

    cb(new ImaPlayer(options), null)
  }, makeNum(options.timeout, 6000), !!options.debug)
}

// Make VPAID modes available before player instanciation (read only)
factory.vpaidMode = Object.freeze(ImaPlayer.vpaidMode)

export { factory as default }
