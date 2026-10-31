# Animation setup

`@erp/miniapp-ui` does not bundle `tw-animate-css`. If your mini app needs Radix
enter/exit keyframe animations (dialogs, overlays), add it yourself:

```css
@import "tw-animate-css";
```

(as `miniapp-hr` does) until the library optionally re-exports animation helpers.
