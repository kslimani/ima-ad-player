# Google IMA video ad player

Yet another [Google IMA HTML5 SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/quickstart) video ad player.

## Quick usage

```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/ima-ad-player@latest/dist/ima-ad-player.min.js"></script>
</head>
```

```javascript
var adVideo = document.querySelector('.a-video-element');
var adContainer = document.querySelector('.a-display-container-element');

ImaAdPlayer({
  video: adVideo,
  displayContainer: adContainer,
  tag: 'https://myadserver.com/path/to/vast/linear/tag.xml',
  vpaidMode: 2,
  locale: 'fr',
  maxDuration: 30000,
  // events: { error: function(e) { console.log(e); }, ad_error: function(e) { console.log(e); } },
  // restoreVideo: true,
  // timeout: 2000,
  // debug: true,
}, function(player, error) {
  if (error) {
    // Ad player creation failed
    return console.log(error);
  }

  // Must be done via a user action on mobile devices
  player.play();
});
```

Note: ad player assumes the display container and video element are correctly positioned and sized.
