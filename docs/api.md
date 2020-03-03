# Ad player API

## destroy()

Destroy the ad player instance. It stop and cleanup all internal instances and created DOM elements.

```javascript
player.destroy()
```

## ended()

Signals the [video content is finished](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsLoader#contentComplete). This will allow to play post-roll ads (if any).

```javascript
player.ended()
```

## initAdDisplayContainer()

Initialize the [ad display container](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdDisplayContainer#initialize). This method __must__ be called as the result of a user action.

It is automaticalled called by play() method, but may be usefull to call it before play() to store user interaction.

```javascript
player.initAdDisplayContainer()
```

## off(name[, cb])

Remove one or all event listener(s).

| Name | Type | Description |
| ---  | --- | --- |
| name | string | The event name |
| cb | Function | Optional listener callback function |

```javascript
player.off('ad_begin', function(o) {/* ... */})

player.off('ad_begin') // Unbind all listeners
```

## on(name, cb)

Add an event listener.

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

## play()

Start the ad player. This method __must__ be called as the result of a user action (if autoplay not permitted).

```javascript
player.play()
```

## request([options])

Request ads from ad server. It is usefull, for example, to pre-request ads when autoplay is not allowed.

| Name | Type | Description |
| ---  | --- | --- |
| options | object | Optional [ads request properties](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRequest#properties) defined in the IMA SDK documentation |

```javascript
player.request()

player.request({vastLoadTimeout: 10000}) // Note: it overrides ads request properties set with "adsRequestOptions" configuration option
```

## resize(width, height)

Signal the ad player to [resize the current ad](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsManager#resize).

| Name | Type | Description |
| ---  | --- | --- |
| width | integer | The new width |
| height | integer | The new height |

```javascript
player.resize(320, 240)
```

## setAdWillAutoPlay(autoPlay)

Same as `adWillAutoPlay` [configuration option](config.md).

```javascript
player.setAdWillAutoPlay(false)
```

## setAdWillPlayMuted(muted)

Same as `adWillPlayMuted` [configuration option](config.md).

```javascript
player.setAdWillPlayMuted(true)
```

## setContinuousPlayback(continuousPlayback)

Same as `continuousPlayback` [configuration option](config.md).

```javascript
player.setContinuousPlayback(true)
```

## setVolume(volume)

[Set the volume](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsManager#setVolume) for the current ad.

| Name | Type | Description |
| ---  | --- | --- |
| volume | number | Number value between 0 (mute) and 1 (loudest) |

```javascript
player.setVolume(0.5)
```

## stop()

[Stop](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsManager#stop) the ad player.

```javascript
player.stop()
```
