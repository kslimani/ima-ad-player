
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
  // Ad scenario is beginning (pause & disable buttons)
  this._o.adPlayer.on('ad_begin', function(e) {
    this._o.stopAdButton.disabled = false;
    this._bindVideoEnded(false);
    this._disableControls();
    this.pause();
  }.bind(this));

  // "content_resume_requested" may not be triggered on errors
  this._o.adPlayer.on('ad_end', function(e) {
    this._o.stopAdButton.disabled = true;
    this._bindVideoEnded(true);
    this._enableControls();

    // Avoid video to starts over after a post-roll
    if (! this._ended) {
      this.play();
    } else {
      // May happen with iOS 10+ device
      if (this._src !== this._o.videoElement.src) {
        this._setSrc(this._src, function() {
          this._log('src restored');
        }.bind(this));
      }
    }
  }.bind(this));
};

VideoPlayer.prototype._setSrc = function(src, next) {
  var eh = function() {
    this._o.videoElement.removeEventListener('loadedmetadata', eh, false)
    this._o.videoElement.removeEventListener('error', eh, false)
    next()
  }.bind(this);

  // Enable video element to "capture" user interaction
  this._o.videoElement.addEventListener('loadedmetadata', eh, false)
  this._o.videoElement.addEventListener('error', eh, false)
  this._o.videoElement.src = src
  this._o.videoElement.load()
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
