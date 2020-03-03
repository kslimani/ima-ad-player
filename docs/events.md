# Ad player events

All trigerred events are basically a mapping of IMA SDK [AdEvent](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdEvent) with additionnal custom events.

```javascript
ImaAdPlayer({
  // [...]
}, function(player, error) {

  player.on('first_quartile', function(o) {
    /**
     * o.name is event name
     * o.data is event object (may equals undefined)
     * o.target is ad player instance
     */
     console.log(o);
  });

});
```

## Ad player custom events

| Name | Description |
| ---  | --- |
| ad_begin | ad player is ready to play ad. (alias of "content_pause_requested" event) |
| ad_end | ad player has finished and video content can be played or resumed. |
| ad_non_linear | Signal non-linear ad display scenario. |
| ad_play | requested ad is attempted to be played. |
| ad_play_intent | ad player `play()` method is called. |
| ad_request | [AdsRequest](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRequest) instance is available. (but not requested yet) |
| ad_request_intent | ad player `request()` method is called. |
| ad_stop | ad player is stopping ad. |
| ad_stop_intent | ad player `stop()` method is called. |
| ads_manager | [AdsManager](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsManager) instance is available. (after ad request success) |
| ads_manager_loaded | [AdsManagerLoadedEvent](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsManagerLoadedEvent) instance is available. (after ad request success, before AdsManager creation) |
| ads_rendering_settings | [AdsRenderingSettings](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdsRenderingSettings) instance is available. |
| error | An error has occured. |

## IMA SDK mapped [event types](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/reference/js/ima.AdEvent#property)

| Name | Type |
| ---  | --- |
| ad_break_ready | google.ima.AdEvent.Type.AD_BREAK_READY |
| ad_buffering | google.ima.AdEvent.Type.AD_BUFFERING |
| ad_can_play | google.ima.AdEvent.Type.AD_CAN_PLAY |
| ad_error | google.ima.AdErrorEvent.Type.AD_ERROR |
| ad_metadata | google.ima.AdEvent.Type.AD_METADATA |
| ad_progress | google.ima.AdEvent.Type.AD_PROGRESS |
| all_ads_completed | google.ima.AdEvent.Type.ALL_ADS_COMPLETED |
| click | google.ima.AdEvent.Type.CLICK |
| complete | google.ima.AdEvent.Type.COMPLETE |
| content_pause_requested | google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED |
| content_resume_requested | google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED |
| duration_change | google.ima.AdEvent.Type.DURATION_CHANGE |
| first_quartile | google.ima.AdEvent.Type.FIRST_QUARTILE |
| impression | google.ima.AdEvent.Type.IMPRESSION |
| interaction | google.ima.AdEvent.Type.INTERACTION |
| linear_changed | google.ima.AdEvent.Type.LINEAR_CHANGED |
| loaded | google.ima.AdEvent.Type.LOADED |
| log | google.ima.AdEvent.Type.LOG |
| midpoint | google.ima.AdEvent.Type.MIDPOINT |
| paused | google.ima.AdEvent.Type.PAUSED |
| resumed | google.ima.AdEvent.Type.RESUMED |
| skippable_state_changed | google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED |
| skipped | google.ima.AdEvent.Type.SKIPPED |
| started | google.ima.AdEvent.Type.STARTED |
| third_quartile | google.ima.AdEvent.Type.THIRD_QUARTILE |
| user_close | google.ima.AdEvent.Type.USER_CLOSE |
| viewable_impression | google.ima.AdEvent.Type.VIEWABLE_IMPRESSION |
| volume_changed | google.ima.AdEvent.Type.VOLUME_CHANGED |
| volume_muted | google.ima.AdEvent.Type.VOLUME_MUTED |
