# Google IMA video ad player

Yet another [Google IMA HTML5 SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/quickstart) video ad player.

## Quick usage

```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/ima-ad-player@latest/dist/ima-ad-player.min.js"></script>
</head>
```

```javascript
// Ad player assumes the ad display container and video element are correctly positioned and sized
var videoElement = document.querySelector('.a-video-element');
var adContainer = document.querySelector('.a-display-container-element');

ImaAdPlayer({
  video: videoElement,
  displayContainer: adContainer,
  tag: 'https://myadserver.com/path/to/vast/tag.xml',
  vpaidMode: 2,
  locale: 'fr',
  maxDuration: 30000,
  // nonLinearMaxDuration: 8000,
  // restoreVideo: true,
  // adsRequestOptions: {
  //   vastLoadTimeout: 10000,
  // },
  // adsRenderingOptions: {
  //   loadVideoTimeout: 10000,
  // },
  // timeout: 2000,
  // debug: true,
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
  player.play();
});
```
