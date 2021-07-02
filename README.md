[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

# Google IMA video ad player

Yet another [Google IMA HTML5 SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5) video ad player.

## Getting started

Add the ad player script to your HTML :

```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/ima-ad-player@latest/dist/ima-ad-player.min.js"></script>
</head>
```

Then use the `ImaAdPlayer` factory to create ad player instance :

```javascript
ImaAdPlayer({
  video: document.querySelector('.a-video-element'),
  displayContainer: document.querySelector('.a-display-container-element'),
  tag: 'https://myadserver.com/path/to/vast/tag.xml',
}, function(player, error) {
  if (error) {
    // Ad player creation failed
    return console.log(error);
  }

  player.on('ad_begin', function() {
    // Pause content video
  });

  player.on('ad_end', function() {
    // Play or resume content video
  });

  // Must be done as the result of a user action (if autoplay not permitted)
  player.play();
});
```

The ad player assumes the [ad display container](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdDisplayContainer) and video element __are correctly positioned and sized__.

## Documentation

* ad player [configuration options](docs/config.md)
* ad player [events](docs/events.md)
* ad player [api](docs/api.md)

For a complete example see the HTML [development page](public/index.html).

## Autoplay

Ad player default behaviour is to assumes that `play()` method is called __when video is allowed to autostart__. _(ie: autoplay is permitted or called after user interaction)_

For that reason, default internal behaviour is to call `setAdWillAutoPlay(true)` and `setAdWillPlayMuted(false)` on IMA [AdsRequest](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRequest) instance.

It can be changed using `adWillAutoPlay` and `adWillPlayMuted` configuration options.

## Usage as Node.js external dependency

Add it to your project, for example, using NPM command :

```shell
$ npm install ima-ad-player
```

Then import and use ad player factory :

```javascript
import ImaAdPlayer from 'ima-ad-player'

ImaAdPlayer({
  // ...
}, function(player, error) {
  // ...
});
```

## About

This library is basically a wrapper on IMA SDK library. The goal is to provide a simple implementation which cover common ad scenarios.

I created this project because I needed to implement the IMA SDK in several other projects without having to duplicate the implementation code.

It is used in the following projects :

* [ad-inflow-modal](https://github.com/kslimani/ad-inflow-modal)
* [clappr-ima-plugin](https://github.com/kslimani/clappr-ima-plugin)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
