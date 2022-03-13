# Ad player API

## configureAdsManager(content, adsRenderingSettings)

Same as [AdsManager.configureAdsManager()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#configureAdsManager) method.

## discardAdBreak()

Same as [AdsManager.discardAdBreak()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#discardAdBreak) method.

## destroy()

Destroy the ad player instance. It stop and cleanup all internal instances and created DOM elements.

```javascript
player.destroy()
```

## ended()

Signals the [video content is finished](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsLoader#contentComplete). This will allow to play post-roll ads (if any).

```javascript
player.ended()
```

## focus()

Same as [AdsManager.focus()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#focus) method.

## getAdSkippableState()

Same as [AdsManager.getAdSkippableState()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#getAdSkippableState) method.

This method returns __null__ if AdsManager instance is unavailable.

## getCuePoints()

Same as [AdsManager.getCuePoints()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#getCuePoints) method.

This method returns __null__ if AdsManager instance is unavailable.

## getRemainingTime()

Same as [AdsManager.getRemainingTime()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#getRemainingTime) method.

This method returns __null__ if AdsManager instance is unavailable.

## getVolume()

Same as [AdsManager.getVolume()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#getVolume) method.

This method returns __null__ if AdsManager instance is unavailable.

## initAdDisplayContainer()

Initialize the [ad display container](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdDisplayContainer#initialize). This method __must__ be called as the result of a user action.

It is automaticalled called by play() method, but may be usefull to call it before play() to store user interaction.

```javascript
player.initAdDisplayContainer()
```

## isCustomClickTrackingUsed()

Same as [AdsManager.isCustomClickTrackingUsed()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#isCustomClickTrackingUsed) method.

This method returns __null__ if AdsManager instance is unavailable.

## isCustomPlaybackUsed()

Same as [AdsManager.isCustomPlaybackUsed()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#isCustomPlaybackUsed) method.

This method returns __null__ if AdsManager instance is unavailable.

## off(name[, cb])

Remove one or all [event](events.md) listener(s).

| Name | Type | Description |
| ---  | --- | --- |
| name | string | The event name |
| cb | Function | Optional listener callback function |

```javascript
player.off('ad_begin', function(o) {/* ... */})

player.off('ad_begin') // Unbind all listeners
```

## on(name, cb)

Add an [event](events.md) listener.

| Name | type | Description |
| ---  | --- | --- |
| name | string | The event name |
| cb | Function | The listener callback function |

```javascript
player.on('ad_begin', function(o) {
    /**
     * o.name is event name
     * o.data is event object (may equals undefined)
     * o.target is ad player instance
     */
})
```

## pause()

Same as [AdsManager.pause()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#pause) method.

## play()

Start the ad player. This method __must__ be called as the result of a user action (if autoplay not permitted).

```javascript
player.play()
```

## request([options])

Request ads from ad server. It is usefull, for example, to pre-request ads when autoplay is not allowed.

| Name | Type | Description |
| ---  | --- | --- |
| options | object | Optional [ads request properties](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsRequest#properties) defined in the IMA SDK documentation |

```javascript
player.request()

// Overrides ads request properties set with "adsRequestOptions" configuration option
player.request({vastLoadTimeout: 10000})
```

## resize(width, height[, viewMode])

Signals the ad player to [resize the current ad](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#resize).

| Name | Type | Description |
| ---  | --- | --- |
| width | integer | The new width |
| height | integer | The new height |
| viewMode | integer | The optional new [view mode](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima#.ViewMode). (default is google.ima.ViewMode.NORMAL) |

```javascript
player.resize(320, 240)
```

## resume()

Same as [AdsManager.resume()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#resume) method.

## setAdWillAutoPlay(autoPlay)

Same as `adWillAutoPlay` [configuration option](config.md). This method must be called before play() or request().

```javascript
player.setAdWillAutoPlay(false)
```

## setAdWillPlayMuted(muted)

Same as `adWillPlayMuted` [configuration option](config.md). This method must be called before play() or request().

```javascript
player.setAdWillPlayMuted(true)
```

## setContinuousPlayback(continuousPlayback)

Same as `continuousPlayback` [configuration option](config.md). This method must be called before play() or request().

```javascript
player.setContinuousPlayback(true)
```

## setVolume(volume)

[Set the volume](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#setVolume) for the current ad.

| Name | Type | Description |
| ---  | --- | --- |
| volume | number | Number value between 0 (mute) and 1 (loudest) |

```javascript
player.setVolume(0.5)
```

## skip()

Same as [AdsManager.skip()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#skip) method.

## stop()

[Stop](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#stop) the ad player.

```javascript
player.stop()
```

## updateAdsRenderingSettings(adsRenderingSettings)

Same as [AdsManager.updateAdsRenderingSettings()](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsManager#updateAdsRenderingSettings) method.
