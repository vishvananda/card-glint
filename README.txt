card-glint 0.2.2

Serve this directory with an HTTP server (for example python3 -m http.server).
Open index.html for a working example. file:// URLs cannot load WASM reliably.

Import createRenderer from ./browser.js. Keep the JS chunks and renderer_bg.wasm
together: the WASM core requires its matching JavaScript/WebGL2 host. No Node,
Rust compiler, bundler, model weights or external artwork is needed at runtime.
The optional showcase.js and art/ are original, repository-licensed examples.

Types, architecture and game-pack API: https://github.com/vishvananda/card-glint
