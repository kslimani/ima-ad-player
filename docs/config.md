# Ad player Configuration options

| Name | Type | Required | Description |
| ---  | :---: | :---: | --- |
| adsRenderingOptions | object | no | The [ads rendering settings properties](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRenderingSettings#properties) defined in the IMA SDK documentation. (will override default settings) |
| adsRequestOptions | object | no | The [ads request properties](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRequest#properties) defined in the IMA SDK documentation. (will override default settings) |
| adWillAutoPlay | boolean | no | [Tell the SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRequest#setAdWillAutoPlay) if ad player is started as the result of a user action. (default is true) |
| adWillPlayMuted | boolean | no | [Tell the SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRequest#setAdWillPlayMuted) if ad player is started while muted. (default is false) |
| clickTrackingElement | HTMLElement | no | Optional video ad click HTML element. (see also [AdDisplayContainer](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdDisplayContainer#AdDisplayContainer) `opt_clickTrackingElement` argument) |
| continuousPlayback | boolean | no | [Tell the SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRequest#setContinuousPlayback) if ad player intends to continuously play the content videos one after another. (default is to not tell the SDK) |
| debug | boolean | no | Lazy load the debug version of the IMA SDK library if set to true. (default is false) |
| displayContainer | HTMLElement | __yes__ | The HTML element to display the ads in. (must be already inserted into the DOM) |
| locale | string | no | The [locale](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.ImaSdkSettings#setLocale) (language) in which to display UI elements. (default is to not set locale) |
| maxDuration | integer | no | The maximum duration in milliseconds an ad is displayed. (default is none) |
| nonLinearMaxDuration | integer | no | The maximum duration in milliseconds a non-linear ad is displayed. (default is none, default observed duration is 45 seconds) |
| restoreVideo | boolean | no | [Tell the SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRenderingSettings#restoreCustomPlaybackStateOnAdBreakComplete) if custom playback content video state must be restored. (default is false) |
| tag | string | __yes__ | The VAST Ad tag URL. |
| timeout | integer | no | The duration in milliseconds to wait for the IMA SDK library to be loaded. (default is 6000) |
| video | HTMLVideoElement | __yes__ | HTML Video element (content video element) |
| vpaidMode | integer | no | The [VPAID playback mode](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima#.VpaidMode) : `ImaAdPlayer.vpaidMode.DISABLED`, `ImaAdPlayer.vpaidMode.ENABLED` and `ImaAdPlayer.vpaidMode.INSECURE`. (default is to not set VPAID mode. IMA SDK default is ENABLED) |

## Advanced configuration example

```javascript
// Ad player assumes the ad display container and video element are correctly positioned and sized
var videoElement = document.querySelector('.a-video-element');
var adContainer = document.querySelector('.a-display-container-element');
// var clickTrackingElement = document.querySelector('.optional-click-tracking-element');

ImaAdPlayer({
  video: videoElement,
  displayContainer: adContainer,
  tag: 'https://myadserver.com/path/to/vast/tag.xml',
  vpaidMode: ImaAdPlayer.vpaidMode.INSECURE,
  locale: 'fr',
  maxDuration: 30000,
  nonLinearMaxDuration: 8000,
  // restoreVideo: true,
  adsRequestOptions: {
    vastLoadTimeout: 10000,
  },
  adsRenderingOptions: {
    loadVideoTimeout: 10000,
    useStyledLinearAds: true,
    useStyledNonLinearAds: true,
  },
  timeout: 2000,
  // debug: true,
  // clickTracking: clickTrackingElement,
  // adWillAutoPlay: false, // Default is true
  // adWillPlayMuted: true, // Default is false
  // continuousPlayback: true, // Default is undefined
}, function(player, error) {
  if (error) {
    // Ad player creation failed
    return console.log(error);
  }

  player.on('ad_begin', function(o) {
    // Pause content video
  });

  player.on('ad_end', function(o) {
    // Play or resume content video

    /**
     * o.name is event name
     * o.data is event object (may equals undefined)
     * o.target is ad player instance
     */
     console.log(o);
  });

  // Must be done via a user interaction (if autoplay not permitted)
  // player.initAdDisplayContainer()
  player.play();
});
```
