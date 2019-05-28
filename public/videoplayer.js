
// A simple video player
function VideoPlayer(options) {
  this._o = options;
  this._initialPlay = true
  this._ended = false
  this._src = this._o.videoElement.src
  this._init();
}

VideoPlayer.prototype._log = function(m) {
  console.log('[VIDEO PLAYER] ' + m);
};

VideoPlayer.prototype._init = function() {
  this._onPause = function () {
    this._o.playButton.disabled = false;
    this._o.pauseButton.disabled = true;
  }.bind(this);

  this._onPlaying = function () {
    this._o.playButton.disabled = true;
    this._o.pauseButton.disabled = false;
  }.bind(this);

  this._onEnded = function () {
    this._log('ended event');
    this._ended = true

    // Signal ad player that playback completed
    this._o.adPlayer.ended()

    // Reset ad scenario
    this._initialPlay = true
  }.bind(this);

  // Video play button
  this._o.playButton.addEventListener('click', function() {
    this.play();
  }.bind(this));

  // Video pause button
  this._o.pauseButton.addEventListener('click', function() {
    this.pause();
  }.bind(this));

  // Ad stop button
  this._o.stopAdButton.addEventListener('click', function() {
    this._o.adPlayer.stop()
  }.bind(this));

  // Ad overlay click handler
  this._o.adOverlay.addEventListener('click', function() {
    // Must be done via a user action on mobile devices
    this.play();
  }.bind(this));

  this._bindVideoEnded(true);
  this._bindAdPlayerEvents();
};

VideoPlayer.prototype.showOverlay = function() {
  this._o.adOverlay.style.visibility = 'visible';
  this._o.playButton.disabled = false;
  this._o.pauseButton.disabled = true;
  this._overlayVisible = true
}

VideoPlayer.prototype._enableControls = function() {
  this._o.videoElement.addEventListener('pause', this._onPause, false);
  this._o.videoElement.addEventListener('playing', this._onPlaying, false);
  if (this._o.videoElement.paused) {
    this._onPause();
  } else {
    this._onPlaying();
  }
};

VideoPlayer.prototype._disableControls = function() {
  this._o.videoElement.removeEventListener('pause', this._onPause, false);
  this._o.videoElement.removeEventListener('playing', this._onPlaying, false);
  this._o.playButton.disabled = true;
  this._o.pauseButton.disabled = true;
};

VideoPlayer.prototype._bindVideoEnded = function(enabled) {
  if (enabled) {
    this._o.videoElement.addEventListener('ended', this._onEnded, false);
  } else {
    this._o.videoElement.removeEventListener('ended', this._onEnded, false);
  }
};

VideoPlayer.prototype._bindAdPlayerEvents = function() {
  this._o.adPlayer.on('ad_error', function(e) {
    this._adError = true;
  }.bind(this));

  // Ad scenario is beginning (pause video & update controls)
  this._o.adPlayer.on('ad_begin', function(e) {
    this._adError = false;
    this._o.stopAdButton.disabled = false;
    this._bindVideoEnded(false);
    this._disableControls();
    this._pauseTime = this._o.videoElement.currentTime;
    this.pause();
  }.bind(this));

  // Ad scenario has ended (play or resume video & update controls)
  this._o.adPlayer.on('ad_end', function(e) {
    this._o.stopAdButton.disabled = true;
    this._bindVideoEnded(true);
    this._enableControls();

    // Avoid video to starts over after a post-roll
    if (this._ended) {
      this._restoreContentIfMissing();
    } else {
      this._restoreContentIfMissing(function() {
        this.play();
      }.bind(this));
    }
  }.bind(this));
};

VideoPlayer.prototype._iOS10Plus = function() {
  var version = [0, 0, 0];

  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }

  return version[0] >= 10;
}

VideoPlayer.prototype._adErrorWithIos10Plus = function() {
  // With iOS10+, video content may not properly restored when an ad error occured
  return this._adError && this._iOS10Plus();
}

VideoPlayer.prototype._restoreContentIfMissing = function(next) {
  if (this._contentRestored() && ! this._adErrorWithIos10Plus()) {
    next && next();
  } else {
    this._setSrc(this._src, function() {
      // Check for seek after mid-roll
      if (this._pauseTime > 1 && ! this._ended) {
        this._seek(this._pauseTime, next);
      } else {
        next && next();
      }
    }.bind(this));
  }
}

VideoPlayer.prototype._contentRestored = function() {
  return this._src === this._o.videoElement.src
}

VideoPlayer.prototype._setSrc = function(src, next) {
  var eh = function() {
    this._o.videoElement.removeEventListener('loadedmetadata', eh, false)
    this._o.videoElement.removeEventListener('error', eh, false)
    next && next()
  }.bind(this);

  this._o.videoElement.addEventListener('loadedmetadata', eh, false)
  this._o.videoElement.addEventListener('error', eh, false)
  this._log('restore src to ' + src)
  this._o.videoElement.src = src
  this._o.videoElement.load()
};

VideoPlayer.prototype._seek = function(seekTime, next) {
  if (this._o.videoElement.seekable.length) {
    if (this._o.videoElement.seekable.end(0) > seekTime) {
      this._log('seek to ' + seekTime)
      this._o.videoElement.currentTime = seekTime;
      next && next();
    }
  } else {
    setTimeout(function() {
      this._seek(seekTime, next);
    }.bind(this), 100);
  }
};

VideoPlayer.prototype.preloadAd = function() {
  // pre-request ad (usefull when autoplay is not allowed)
  this._o.adPlayer.request(/* {vastLoadTimeout: 8000} */)
};

VideoPlayer.prototype.play = function() {
  this._log('play');

  // Hide overlay (if visible)
  if (this._overlayVisible) {
    this._o.adOverlay.style.visibility = 'hidden';
    this._overlayVisible = false
  }

  if (this._initialPlay) {
    this._initialPlay = false;
    this._ended = false

    // Start ad scenario on initial play
    this._o.adPlayer.play()
  } else {
    this._o.videoElement.play();
  }
};

VideoPlayer.prototype.pause = function() {
  this._log('pause');
  this._o.videoElement.pause();
};
