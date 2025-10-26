**Mux Player** is a drop-in component that you can put in your web application to play Mux assets. Mux Player supports:

- on-demand assets
- live streams
- low-latency live streams
- DVR mode for live or low-latency live streams

Mux Player can be used as a web component (`<mux-player>` from `@mux/mux-player`), as a React component (`<MuxPlayer />` from `@mux/mux-player-react`), or as a web embed (`<iframe src="https://player.mux.com/{playbackId}">`)

Mux Player is fully-featured video player for content hosted by Mux Video. Mux Player is fully integrated with Mux Data without any extra configuration. Mux Player provides a responsive UI based on video player dimensions and stream type, automatic thumbnail previews and poster images, and modern video player capabilities (fullscreen, picture-in-picture, Chromecast, AirPlay).

## [Quick start](#quick-start)

Here are some examples of Mux Player in action.

## [HTML element](#html-element)

Install with either npm, yarn or load Mux Player from the hosted script.

### [NPM](#npm)

copy

```
npm install @mux/mux-player@latest
```

### [Yarn](#yarn)

copy

```
yarn add @mux/mux-player@latest
```

### [Hosted](#hosted)

copy

```
<script src="https://cdn.jsdelivr.net/npm/@mux/mux-player" defer></script>
```

### [Example HTML element implementation](#example-html-element-implementation)

copy

```
<script src="https://cdn.jsdelivr.net/npm/@mux/mux-player" defer></script>
<mux-player
  playback-id="EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
  metadata-video-title="Test VOD"
  metadata-viewer-user-id="user-id-007"
></mux-player>
```

When using the HTML element version of Mux Player, you will see the `Player Software` in Mux Data come through as `mux-player`.

## [HTML Embed](#html-embed)

### [Example HTML embed implementation](#example-html-embed-implementation)

copy

```
<iframe
  src="https://player.mux.com/EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs?metadata-video-title=Test%20VOD&metadata-viewer-user-id=user-id-007"
  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  allowfullscreen="true"
></iframe>
```

When using the HTML embed version of Mux Player, you will see the `Player Software` in Mux Data come through as `mux-player-iframe`.

## [React](#react)

You will need to select one of the package options below. Both examples will automatically update the player. You can always anchor the package to a specific version if needed.

### [NPM](#npm-1)

copy

```
npm install @mux/mux-player-react@latest
```

### [Yarn](#yarn-1)

copy

```
yarn add @mux/mux-player-react@latest
```

### [Example React implementation](#example-react-implementation)

import MuxPlayer from "@mux/mux-player-react";

export default function App() {

return (

<MuxPlayer

playbackId\="a4nOgmxGWg6gULfcBbAa00gXyfcwPnAFldF8RdsNyk8M"

metadata\={{

video_id: "video-id-54321",

video_title: "Test video title",

viewer_user_id: "user-id-007",

}}

/>

);

}

Refresh preview

Open on CodeSandboxOpen Sandbox

When using the React version of Mux Player, you will see the `Player Software` in Mux Data come through as `mux-player-react`.

## [Adaptive controls](#adaptive-controls)

As shown in the examples above, the available controls will adjust based on your video's stream type, live or on-demand.

Mux Player will also take into account the size that the player is being displayed at, regardless of the browser window size, and will selectively hide controls that won't fit in the UI.

In the latest version of Mux Player stream type is automatically set and you don't need to manually provide this. Player themes other than the default theme that need to know what the stream type is may need it defined to avoid the player having a delay in showing the correct controls. In this instance, you would set `stream-type` (`streamType` in React) to either `on-demand` or `live` so that the UI can adapt before any information about the video is loaded.

The following will also appear in some use cases based on support detection:

- [AirPlay](https://www.apple.com/airplay/)
- [Chromecast](https://store.google.com/us/product/chromecast). Requires an extra step, see the [customize look and feel](/docs/guides/player-customize-look-and-feel) guide.
- Fullscreen
- Picture-in-picture button
- Volume controls

#### Core functionality

Understand the features and core functionality of Mux Player

[Read the guide](/docs/guides/player-core-functionality)

#### Integrate Mux Player

Interate Mux Player in your web application. See examples in popular front end frameworks.

[Read the guide](/docs/guides/player-integrate-in-your-webapp)

#### Customize the look and feel

Customize Mux Player to match your brand

[Read the guide](/docs/guides/player-customize-look-and-feel)

## [Set accent color for your brand](#set-accent-color-for-your-brand)

The default accent color of the player is Mux pink `#fa50b5`. You should override this with your brand color. Use the `accent-color` HTML attribute or `accentColor` React prop.

copy

```
<mux-player
  playback-id="EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
  accent-color="#ea580c"
  metadata-video-title="Test VOD"
  metadata-viewer-user-id="user-id-007"
></mux-player>
```

For React:

copy

```
<MuxPlayer
  playbackId="EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
  accentColor="#ea580c"
  metadata={{
    videoTitle: "Test VOD",
    ViewerUserId: "user-id-007"
  }}
/>
```
