// ima-player.js

import {makeNum, makeDefault} from './utils'
import Observable from './observable'

/* global google */

export default class ImaPlayer {
  constructor(options) {
    this._configure(options)
    this._evt = new Observable()
    this._adRequesting = false
    this._adRequested = false

    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.ImaSdkSettings#setVpaidMode
    google.ima.settings.setVpaidMode(this._vpaidMode)

    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.ImaSdkSettings#setLocale
    if (this._o.locale) {
      google.ima.settings.setLocale(this._o.locale)
    }

    // Assumes the display container and video element are correctly positioned and sized
    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/#html
    this._adDisplayContainer = new google.ima.AdDisplayContainer(this._o.displayContainer, this._o.video, this._o.clickTracking)
    this._adDisplayContainerInit = false
  }

  _configure(o) {
    this._o = {
      displayContainer: o.displayContainer,
      video: o.video,
      tag: o.tag,
    }
    this._o.vpaidMode = makeNum(o.vpaidMode, 0)

    if (o.maxDuration) {
      this._o.maxDuration = makeNum(o.maxDuration, undefined)
    }

    // Default is undefined
    this._o.locale = o.locale

    // Default is undefined or alternative video ad click element
    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdDisplayContainer
    this._o.clickTracking = o.clickTracking

    // Default is undefined or object
    this._o.adsRequestOptions = o.adsRequestOptions

    // Default is undefined or object
    this._o.adsRenderingOptions = o.adsRenderingOptions

    // Default is to let IMA SDK handle non-linear display duration
    this._o.nonLinearMaxDuration = makeNum(o.nonLinearMaxDuration, -1)

    // Assumes by default that the playback is consented by user
    this._o.adWillAutoPlay = !!makeDefault(o.adWillAutoPlay, true)
    this._o.adWillPlayMuted = !!makeDefault(o.adWillPlayMuted, false)

    // Default is undefined
    this._o.continuousPlayback = o.continuousPlayback

    // Default is to tell the SDK NOT to save and restore content video state
    this._o.restoreVideo =  !!makeDefault(o.restoreVideo, false)
  }

  _setProperties(target, properties) {
    for (let prop in properties) {
      if (typeof target[prop] !== 'undefined') {
        target[prop] = properties[prop]
      }
    }
  }

  get _vpaidMode() {
    if (this._o.vpaidMode === 0) {
      return google.ima.ImaSdkSettings.VpaidMode.DISABLED
    }

    if (this._o.vpaidMode > 1) {
      return google.ima.ImaSdkSettings.VpaidMode.INSECURE
    }

    return google.ima.ImaSdkSettings.VpaidMode.ENABLED
  }

  on(name, cb) {
    this._evt.subscribe(name, cb)
  }

  off(name, cb = null) {
    if (cb === null) {
      this._evt.unsubscribeAll(name)
    } else {
      this._evt.unsubscribe(name, cb)
    }
  }

  play() {
    this._dispatch('ad_play_intent')
    this._adPlayIntent = true
    this.initAdDisplayContainer()
    this._requestAd()
  }

  request(options) {
    this._dispatch('ad_request_intent', options)
    this._requestAd(options)
  }

  resize(width, height) {
    if (this._adsManager) {
      // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsManager#resize
      this._adsManager.resize(width, height, google.ima.ViewMode.NORMAL)
    }
  }

  setVolume(volume) {
    if (this._adsManager) {
      // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsManager#setVolume
      this._adsManager.setVolume(volume)
    }
  }

  setAdWillAutoPlay(autoPlay) {
    this._o.adWillAutoPlay = autoPlay
  }

  setAdWillPlayMuted(muted) {
    this._o.adWillPlayMuted = muted
  }

  setContinuousPlayback(continuousPlayback) {
    this._o.continuousPlayback = continuousPlayback
  }

  stop() {
    this._dispatch('ad_stop_intent')
    this._stop()
  }

  ended() {
    // Signals the video content is finished.
    // This will allow to play post-roll ads (if any)
    this._adsLoader && this._adsLoader.contentComplete()
  }

  initAdDisplayContainer() {
    // Must be done via a user interaction
    if (! this._adDisplayContainerInit) {
      this._adDisplayContainer.initialize()
      this._adDisplayContainerInit = true
    }
  }

  destroy(unsubscribeEvents = true) {
    if (! this._end) {
      this._resetMaxDurationTimer()
      unsubscribeEvents && this._evt.unsubscribeAll()
      this._adsManager && this._adsManager.stop()
    }

    this._destroyAdsManager()
    this._adsLoader && this._adsLoader.destroy()
    this._adDisplayContainer && this._adDisplayContainer.destroy()
  }

  _stop() {
    this._dispatch('ad_stop')
    if (this._adsManager) {
      // Signal ads manager to stop and get back to content
      this._adsManager.stop()
    } else {
      this._endAd()
    }
  }

  _makeAdsLoader() {
    this._adsLoader = new google.ima.AdsLoader(this._adDisplayContainer)

    this._adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (e) => {
        this._onAdsManagerLoaded(e)
      }
    )

    this._adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      (e) => {
        this._onAdError(e)
      }
    )
  }

  _requestAd(options) {
    this._end = false

    // Check if ad request is pending
    if (this._adRequesting) {
      // Ad will autostart if play method called
      return
    }

    // Check if ad already requested (pre-request)
    if (this._adRequested) {
      // Start ad only if play method called
      if (this._adPlayIntent) {
        this._playAd()
      }

      return
    }

    this._adRequesting = true

    if (! this._adsLoader) {
      this._makeAdsLoader()
    }

    let adsRequest = new google.ima.AdsRequest()

    // Set ad request default settings
    adsRequest.adTagUrl = this._o.tag
    adsRequest.linearAdSlotWidth = this._o.video.offsetWidth
    adsRequest.linearAdSlotHeight = this._o.video.offsetHeight
    adsRequest.nonLinearAdSlotWidth = this._o.video.offsetWidth
    adsRequest.nonLinearAdSlotHeight = this._o.video.offsetHeight
    adsRequest.setAdWillAutoPlay(this._o.adWillAutoPlay)
    adsRequest.setAdWillPlayMuted(this._o.adWillPlayMuted)

    if (this._o.continuousPlayback !== undefined) {
      // undefined = "0", false = "1", true = "2"
      adsRequest.setContinuousPlayback(this._o.continuousPlayback)
    }

    // Assumes that ad request options is an object with ads request properties
    // defined in the IMA SDK documentation (will override default settings)
    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRequest
    let adsRequestOptions = options ? options : this._o.adsRequestOptions
    if (adsRequestOptions) {
      this._setProperties(adsRequest, adsRequestOptions)
    }

    this._dispatch('ad_request', adsRequest)

    // The requestAds() method triggers _onAdsManagerLoaded() or _onAdError()
    this._adsLoader.requestAds(adsRequest)
  }

  _destroyAdsManager() {
    if (this._adsManager) {
      this._adsManager.destroy()
      delete this._adsManager
    }
  }

  _bindAdsManagerEvents() {
    this._adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e) => {
      this._onAdError(e)
    })

    this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, (e) => {
      this._end = false
      this._dispatch('content_pause_requested', e)
      this._dispatch('ad_begin') // "content_pause_requested" event alias
    })

    this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, (e) => {
      this._dispatch('content_resume_requested', e)
      this._endAd()
    })

    this._adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, (e) => {
      this._dispatch('started', e)

      let ad = e.getAd()

      if (ad.isLinear()) {
        this._o.maxDuration && this._startMaxDurationTimer()
      } else {
        // Signal non-linear ad scenario
        let duration = this._o.nonLinearMaxDuration
        this._dispatch('ad_non_linear', {ad, duration})

        // By default, IMA SDK will automatically close non-linear ad (after 45 seconds ?)
        if (this._o.nonLinearMaxDuration > 0) {
          setTimeout(() => {
            this._adsManager && this._adsManager.stop()
          }, this._o.nonLinearMaxDuration)
        }

        // Ends to play/resume content video
        this._endAd()
      }
    })

    let adEvents = {
      'ad_break_ready': google.ima.AdEvent.Type.AD_BREAK_READY,
      'ad_buffering': google.ima.AdEvent.Type.AD_BUFFERING,
      'ad_metadata': google.ima.AdEvent.Type.AD_METADATA,
      'ad_progress': google.ima.AdEvent.Type.AD_PROGRESS,
      'all_ads_completed': google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      'click': google.ima.AdEvent.Type.CLICK,
      'complete': google.ima.AdEvent.Type.COMPLETE,
      'duration_change': google.ima.AdEvent.Type.DURATION_CHANGE,
      'first_quartile': google.ima.AdEvent.Type.FIRST_QUARTILE,
      'impression': google.ima.AdEvent.Type.IMPRESSION,
      'interaction': google.ima.AdEvent.Type.INTERACTION,
      'linear_changed': google.ima.AdEvent.Type.LINEAR_CHANGED,
      'loaded': google.ima.AdEvent.Type.LOADED,
      'log': google.ima.AdEvent.Type.LOG,
      'midpoint': google.ima.AdEvent.Type.MIDPOINT,
      'paused': google.ima.AdEvent.Type.PAUSED,
      'resumed': google.ima.AdEvent.Type.RESUMED,
      'skippable_state_changed': google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED,
      'skipped': google.ima.AdEvent.Type.SKIPPED,
      'third_quartile': google.ima.AdEvent.Type.THIRD_QUARTILE,
      'user_close': google.ima.AdEvent.Type.USER_CLOSE,
      'volume_changed': google.ima.AdEvent.Type.VOLUME_CHANGED,
      'volume_muted': google.ima.AdEvent.Type.VOLUME_MUTED,
    }

    // Not documented, may be unavailable in the future
    google.ima.AdEvent.Type.AD_CAN_PLAY && (adEvents.ad_can_play = google.ima.AdEvent.Type.AD_CAN_PLAY)
    google.ima.AdEvent.Type.VIEWABLE_IMPRESSION && (adEvents.viewable_impression = google.ima.AdEvent.Type.VIEWABLE_IMPRESSION)

    for (let adEvent in adEvents) {
      this._adsManager.addEventListener(adEvents[adEvent], (e) => {
        this._dispatch(adEvent, e)
      })
    }
  }

  _onAdsManagerLoaded(adsManagerLoadedEvent) {
    this._dispatch('ads_manager_loaded', adsManagerLoadedEvent)

    // Create default ads rendering settings
    let adsRenderingSettings = new google.ima.AdsRenderingSettings()
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = this._o.restoreVideo

    // Assumes that ads rendering options is an object with ads rendering settings properties
    // defined in the IMA SDK documentation (will override default settings)
    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRenderingSettings
    if (this._o.adsRenderingOptions) {
      this._setProperties(adsRenderingSettings, this._o.adsRenderingOptions)
    }

    this._dispatch('ads_rendering_settings', adsRenderingSettings)

    this._destroyAdsManager()
    this._adsManager = adsManagerLoadedEvent.getAdsManager(this._o.video, adsRenderingSettings)
    this._bindAdsManagerEvents()

    this._dispatch('ads_manager', this._adsManager)

    // Ad is ready to be played
    this._adRequesting = false
    this._adRequested = true

    if (this._adPlayIntent) {
      this._playAd()
    }
  }

  _onMaxDuration() {
    this._dispatch('error', new Error('Maximum duration of ' + this._o.maxDuration + ' ms reached'))
    this._stop()
  }

  _startMaxDurationTimer() {
    this._maxDurationTimer = setTimeout(() => { this._onMaxDuration() }, this._o.maxDuration)
  }

  _resetMaxDurationTimer() {
    if (typeof this._maxDurationTimer === 'number') {
      clearTimeout(this._maxDurationTimer)
      this._maxDurationTimer = undefined
    }
  }

  _onAdError(adErrorEvent) {
    // google.ima.AdErrorEvent : https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdErrorEvent
    // google.ima.AdError : https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdError
    // console.log('onAdError: ' + adErrorEvent.getError())
    this._dispatch('ad_error', adErrorEvent)
    this._endAd()
  }

  _playAd() {
    try {
      this._dispatch('ad_play')

      this._adsManager.init(
        this._o.video.offsetWidth,
        this._o.video.offsetHeight,
        google.ima.ViewMode.NORMAL
      )
      this._adsManager.start()
    } catch (e) {
      // console.log('adsManager catched error', e)
      this._dispatch('error', e)
      this._endAd()
    }
  }

  _dispatch(name, e) {
    this._evt.notify(name, {
      name: name,
      data: e,
      target: this,
    })
  }

  _endAd() {
    if (this._end) {
      return
    }

    this._end = true
    this._adPlayIntent = false
    this._adRequesting = false
    this._adRequested = false
    this._resetMaxDurationTimer()
    this._dispatch('ad_end')
  }
}
