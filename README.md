# Segata.live

A recreation of the Sega Saturn CD Player UI in Javascript using three.js, React.

This is more or less a creative coding exercise done as quickly and sloppily as possible, so before digging into the source be warned: `Abandon Hope All Ye Who Enter Here`

## Getting Started

1. `npm install` to install dependencies
2. `npm start` to start webpack-dev-server
3. Start jammin' out at `localhost:3000`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Changelog

### Performance
- Eliminated per-frame heap allocations in audio-reactive cube renderer
- Scenes pause rendering when off-screen or tab is backgrounded
- Removed redundant GLTF model network request (load once, clone)
- Merged StereoAnalyser into existing animation loop (removed extra rAF)
- Replaced react-beautiful-dnd with native HTML5 drag-and-drop (~45KB saved)
- Deferred image preloading until after user interaction
- Removed deprecated Universal Analytics script
- Frame-rate-independent star animation via delta time
- Fixed event listener leaks and redundant DOM writes

### Features
- Added boot animation (fullscreen GIF on page load, skippable)
- Added 90s TV channel overlay (CH 3 / CH 4 static → AV)
- Added System Settings menu (About, Memory Manager, Action Replay)
- Added Memory Manager with BIOS list and Cartridge Memory panels
- Added Action Replay interface (Start Game, Select Cheats, Memory Manager, Credits)
- Auto-skip "Click to Start" screen (init logic preserved for future intro animation)
- Globe button renamed from "About" to "Settings"
- Top-middle button ("Coming Soon") cycles TV channels
