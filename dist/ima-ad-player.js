(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ImaAdPlayer"] = factory();
	else
		root["ImaAdPlayer"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNumeric = isNumeric;
exports.makeNum = makeNum;
exports.makeDefault = makeDefault;
exports.isFunction = isFunction;

// utils.js
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function makeNum(value, fallback) {
  return isNumeric(value) ? value + 0 : fallback;
}

function makeDefault(value, defaultValue) {
  return value === undefined ? defaultValue : value;
}

function isFunction(value) {
  return typeof value === 'function';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _imaLoader = _interopRequireDefault(__webpack_require__(2));

var _imaPlayer = _interopRequireDefault(__webpack_require__(3));

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// IMA ad player factory
function _default(options, cb) {
  (0, _imaLoader.default)(function (success) {
    if (!success) {
      return cb(null, new Error('Failed to load IMA SDK'));
    }

    cb(new _imaPlayer.default(options), null);
  }, (0, _utils.makeNum)(options.timemout, 6000), !!options.debug);
}

module.exports = exports.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// ima-loader.js
function _default(cb) {
  var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6000;
  var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var win = window,
      doc = document,
      el = 'script',
      timer = null;

  var onLoad = function onLoad(r) {
    win.clearTimeout(timer);
    if (typeof cb === 'function') cb(r);
  };

  if (win.google && win.google.ima) {
    return onLoad(true);
  }

  var first = doc.getElementsByTagName(el)[0];
  var script = doc.createElement(el);
  script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3' + (debug ? '_debug' : '') + '.js';
  script.async = true;
  if (typeof cb === 'function') script.onload = function () {
    onLoad(true);
  };
  first.parentNode.insertBefore(script, first);

  if (timeout) {
    timer = win.setTimeout(function () {
      onLoad(false);
    }, timeout);
  }
}

module.exports = exports.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = __webpack_require__(0);

var _observable = _interopRequireDefault(__webpack_require__(4));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ImaPlayer =
/*#__PURE__*/
function () {
  function ImaPlayer(options) {
    _classCallCheck(this, ImaPlayer);

    this._configure(options);

    this._evt = new _observable.default(); // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.ImaSdkSettings.setVpaidMode

    google.ima.settings.setVpaidMode(this._vpaidMode); // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.ImaSdkSettings.setLocale

    if (this._o.locale) {
      google.ima.settings.setLocale(this._o.locale);
    } // Assumes the display container and video element are correctly positioned and sized
    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/#html


    this._adDisplayContainer = new google.ima.AdDisplayContainer(this._o.displayContainer, this._o.video);
  }

  _createClass(ImaPlayer, [{
    key: "_configure",
    value: function _configure(o) {
      this._o = {
        displayContainer: o.displayContainer,
        video: o.video,
        tag: o.tag
      };
      this._o.vpaidMode = (0, _utils.makeNum)(o.vpaidMode, 0);

      if (o.maxDuration) {
        this._o.maxDuration = (0, _utils.makeNum)(o.maxDuration, undefined);
      } // Assumes by default that the playback is consented by user


      this._o.adWillAutoPlay = !!(0, _utils.makeDefault)(o.adWillAutoPlay, true);
      this._o.adWillPlayMuted = !!(0, _utils.makeDefault)(o.adWillPlayMuted, false); // Default is to tell the SDK NOT to save and restore content video state

      this._o.restoreVideo = !!(0, _utils.makeDefault)(o.restoreVideo, false);
    }
  }, {
    key: "on",
    value: function on(name, cb) {
      this._evt.subscribe(name, cb);
    }
  }, {
    key: "off",
    value: function off(name) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (cb === null) {
        this._evt.unsubscribeAll(name);
      } else {
        this._evt.unsubscribe(name, cb);
      }
    }
  }, {
    key: "play",
    value: function play() {
      if (this._o.video && this._o.video.load) {
        this._o.video.load();
      } // Must be done via a user action on mobile devices


      this._adDisplayContainer.initialize();

      this._requestAd();
    }
  }, {
    key: "resize",
    value: function resize(width, height) {
      if (this._adsManager) {
        // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsManager.resize
        this._adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
      }
    }
  }, {
    key: "setVolume",
    value: function setVolume(volume) {
      if (this._adsManager) {
        // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsManager.setVolume      
        this._adsManager.setVolume(volume);
      }
    }
  }, {
    key: "_makeAdsLoader",
    value: function _makeAdsLoader() {
      var _this = this;

      this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer);

      this._adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, function (e) {
        _this._onAdsManagerLoaded(e);
      });

      this._adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (e) {
        _this._onAdError(e);
      });
    }
  }, {
    key: "_requestAd",
    value: function _requestAd() {
      if (!this._adsLoader) {
        this._makeAdsLoader();
      }

      var adsRequest = new google.ima.AdsRequest();
      adsRequest.adTagUrl = this._o.tag;
      adsRequest.linearAdSlotWidth = this._o.video.offsetWidth;
      adsRequest.linearAdSlotHeight = this._o.video.offsetHeight;
      adsRequest.nonLinearAdSlotWidth = this._o.video.offsetWidth;
      adsRequest.nonLinearAdSlotHeight = this._o.video.offsetHeight;
      adsRequest.setAdWillAutoPlay(this._o.adWillAutoPlay);
      adsRequest.setAdWillPlayMuted(this._o.adWillPlayMuted); // The requestAds() method triggers _onAdsManagerLoaded() or _onAdError()

      this._adsLoader.requestAds(adsRequest);
    }
  }, {
    key: "_destroyAdsManager",
    value: function _destroyAdsManager() {
      if (this._adsManager) {
        this._adsManager.destroy();

        delete this._adsManager;
      }
    }
  }, {
    key: "_bindAdsManagerEvents",
    value: function _bindAdsManagerEvents() {
      var _this2 = this;

      this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function (e) {
        _this2._onAdError(e);
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function () {
        _this2._dispatch('content_resume_requested');

        _this2._endAd();
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function () {
        _this2._dispatch('content_pause_requested');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, function () {
        _this2._dispatch('loaded');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, function () {
        _this2._dispatch('click');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.IMPRESSION, function () {
        _this2._dispatch('impression');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, function (e) {
        if (!e.getAd().isLinear()) {
          _this2._dispatch('error', new Error('Non-linear ad is not supported'));

          return _this2._stopAd();
        } else {
          _this2._o.maxDuration && _this2._startMaxDurationTimer();
        }

        _this2._dispatch('started');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE, function () {
        _this2._dispatch('first_quartile');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.MIDPOINT, function () {
        _this2._dispatch('midpoint');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE, function () {
        _this2._dispatch('third_quartile');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, function () {
        _this2._dispatch('complete');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, function () {
        _this2._dispatch('paused');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.RESUMED, function () {
        _this2._dispatch('resumed');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, function () {
        _this2._dispatch('skipped');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED, function () {
        _this2._dispatch('volume_changed');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED, function () {
        _this2._dispatch('volume_muted');
      });

      this._adsManager.addEventListener(google.ima.AdEvent.Type.USER_CLOSE, function () {
        _this2._dispatch('user_close');
      });
    }
  }, {
    key: "_onAdsManagerLoaded",
    value: function _onAdsManagerLoaded(adsManagerLoadedEvent) {
      var adsRenderingSettings = new google.ima.AdsRenderingSettings();
      adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = this._o.restoreVideo;

      this._destroyAdsManager();

      this._adsManager = adsManagerLoadedEvent.getAdsManager(this._o.video, adsRenderingSettings);

      this._bindAdsManagerEvents();

      this._playAd();
    }
  }, {
    key: "_stopAd",
    value: function _stopAd() {
      this._dispatch('ad_stop');

      if (this._adsManager) {
        // Signal ads manager to stop and get back to content
        this._adsManager.stop();
      } else {
        this._endAd();
      }
    }
  }, {
    key: "_onMaxDuration",
    value: function _onMaxDuration() {
      this._dispatch('error', new Error('Maximum duration of ' + this._o.maxDuration + ' ms reached'));

      this._stopAd();
    }
  }, {
    key: "_startMaxDurationTimer",
    value: function _startMaxDurationTimer() {
      var _this3 = this;

      this._maxDurationTimer = setTimeout(function () {
        _this3._onMaxDuration();
      }, this._o.maxDuration);
    }
  }, {
    key: "_resetMaxDurationTimer",
    value: function _resetMaxDurationTimer() {
      if (typeof this._maxDurationTimer === 'number') {
        clearTimeout(this._maxDurationTimer);
        this._maxDurationTimer = undefined;
      }
    }
  }, {
    key: "_onAdError",
    value: function _onAdError(adErrorEvent) {
      // google.ima.AdErrorEvent : https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdErrorEvent
      // google.ima.AdError : https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdError
      // console.log('onAdError: ' + adErrorEvent.getError())
      this._dispatch('ad_error', adErrorEvent);

      this._endAd();
    }
  }, {
    key: "_playAd",
    value: function _playAd() {
      try {
        this._end = false;

        this._dispatch('ad_play');

        this._adsManager.init(this._o.video.offsetWidth, this._o.video.offsetHeight, google.ima.ViewMode.NORMAL);

        this._adsManager.start();
      } catch (e) {
        // console.log('adsManager catched error', e)
        this._dispatch('error', e);

        this._endAd();
      }
    }
  }, {
    key: "_dispatch",
    value: function _dispatch(name, e) {
      this._evt.notify(name, {
        name: name,
        data: e,
        target: this
      });
    }
  }, {
    key: "_endAd",
    value: function _endAd() {
      if (this._end) {
        return;
      }

      this._end = true;

      this._resetMaxDurationTimer();

      this._dispatch('ad_end');
    }
  }, {
    key: "_vpaidMode",
    get: function get() {
      if (this._o.vpaidMode === 0) {
        return google.ima.ImaSdkSettings.VpaidMode.DISABLED;
      }

      if (this._o.vpaidMode > 1) {
        return google.ima.ImaSdkSettings.VpaidMode.INSECURE;
      }

      return google.ima.ImaSdkSettings.VpaidMode.ENABLED;
    }
  }]);

  return ImaPlayer;
}();

exports.default = ImaPlayer;
module.exports = exports.default;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// observable.js
var Observable =
/*#__PURE__*/
function () {
  function Observable() {
    _classCallCheck(this, Observable);

    this.observers = {};
  }

  _createClass(Observable, [{
    key: "subscribe",
    value: function subscribe(n, f) {
      if (!this.observers[n]) {
        this.observers[n] = [];
      }

      this.observers[n].push(f);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(n, f) {
      if (!this.observers[n]) {
        return;
      }

      var i = this.observers[n].indexOf(f);

      if (i == -1) {
        return;
      }

      this.observers[n].splice(i, 1);
    }
  }, {
    key: "unsubscribeAll",
    value: function unsubscribeAll(n) {
      if (this.observers[n]) {
        delete this.observers[n];
      }
    }
  }, {
    key: "notify",
    value: function notify(n, e) {
      if (this.observers[n]) {
        this.observers[n].forEach(function (o) {
          return o(e);
        });
      }
    }
  }]);

  return Observable;
}();

exports.default = Observable;
module.exports = exports.default;

/***/ })
/******/ ]);
});