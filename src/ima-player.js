// ima-player.js

import {makeNum, makeDefault} from './utils'
import Observable from './observable'

export default class ImaPlayer {
  constructor(options) {
    this._configure(options)
    this._evt = new Observable()

    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.ImaSdkSettings.setVpaidMode
    google.ima.settings.setVpaidMode(this._vpaidMode)

    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.ImaSdkSettings.setLocale
    if (this._o.locale) {
      google.ima.settings.setLocale(this._o.locale)
    }

    // Assumes the display container and video element are correctly positioned and sized
    // https://developers.google.com/interactive-media-ads/docs/sdks/html5/#html
    this._adDisplayContainer = new google.ima.AdDisplayContainer(this._o.displayContainer, this._o.video)
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

    // Assumes by default that the playback is consented by user
    this._o.adWillAutoPlay = !!makeDefault(o.adWillAutoPlay, true)
    this._o.adWillPlayMuted = !!makeDefault(o.adWillPlayMuted, false)

    // Default is to tell the SDK NOT to save and restore content video state
    this._o.restoreVideo =  !!makeDefault(o.restoreVideo, false)
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

    if (this._o.video && this._o.video.load) {
      this._o.video.load()
    }

    // Must be done via a user action on mobile devices
    this._adDisplayContainer.initialize()
    this._requestAd()
  }

  resize(width, height) {
    if (this._adsManager) {
      // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsManager.resize
      this._adsManager.resize(width, height, google.ima.ViewMode.NORMAL)
    }
  }

  setVolume(volume) {
    if (this._adsManager) {
      // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsManager.setVolume      
      this._adsManager.setVolume(volume)
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

  _requestAd() {
    if (! this._adsLoader) {
      this._makeAdsLoader()
    }

    let adsRequest = new google.ima.AdsRequest()
    adsRequest.adTagUrl = this._o.tag
    adsRequest.linearAdSlotWidth = this._o.video.offsetWidth
    adsRequest.linearAdSlotHeight = this._o.video.offsetHeight
    adsRequest.nonLinearAdSlotWidth = this._o.video.offsetWidth
    adsRequest.nonLinearAdSlotHeight = this._o.video.offsetHeight

    adsRequest.setAdWillAutoPlay(this._o.adWillAutoPlay)
    adsRequest.setAdWillPlayMuted(this._o.adWillPlayMuted)

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

    this._adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, (e) => {
      this._dispatch('content_resume_requested', e)
      this._endAd()
    })

    this._adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, (e) => {
      if (! e.getAd().isLinear()) {
        this._dispatch('error', new Error('Non-linear ad is not supported'))

        return this.stop()
      } else {
        this._o.maxDuration && this._startMaxDurationTimer()
      }

      this._dispatch('started', e)
    })

    let adEvents = {
      'ad_break_ready': google.ima.AdEvent.Type.AD_BREAK_READY,
      'ad_buffering': google.ima.AdEvent.Type.AD_BUFFERING,
      'ad_metadata': google.ima.AdEvent.Type.AD_METADATA,
      'ad_progress': google.ima.AdEvent.Type.AD_PROGRESS,
      'all_ads_completed': google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      'click': google.ima.AdEvent.Type.CLICK,
      'complete': google.ima.AdEvent.Type.COMPLETE,
      'content_pause_requested': google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
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

    for (let adEvent in adEvents) {
      this._adsManager.addEventListener(adEvents[adEvent], (e) => {
        this._dispatch(adEvent, e)
      })
    }
  }

  _onAdsManagerLoaded(adsManagerLoadedEvent) {
    let adsRenderingSettings = new google.ima.AdsRenderingSettings()
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = this._o.restoreVideo

    this._destroyAdsManager()
    this._adsManager = adsManagerLoadedEvent.getAdsManager(this._o.video, adsRenderingSettings)
    this._bindAdsManagerEvents()
    this._playAd()
  }

  stop() {
    this._dispatch('ad_stop')
    if (this._adsManager) {
      // Signal ads manager to stop and get back to content
      this._adsManager.stop()
    } else {
      this._endAd()
    }
  }

  _onMaxDuration() {
    this._dispatch('error', new Error('Maximum duration of ' + this._o.maxDuration + ' ms reached'))
    this.stop()
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
    // google.ima.AdErrorEvent : https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdErrorEvent
    // google.ima.AdError : https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdError
    // console.log('onAdError: ' + adErrorEvent.getError())
    this._dispatch('ad_error', adErrorEvent)
    this._endAd()
  }

  _playAd() {
    try {
      this._end = false
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
    this._resetMaxDurationTimer()
    this._dispatch('ad_end')
  }
}
