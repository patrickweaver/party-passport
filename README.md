# party-passport

A client-only "passport" for a Christmas party. Guests visit stations, take a selfie at each, and the photo is saved into their passport with a station stamp on top.

No server and no build step: open `index.html` from any static host. The live camera needs HTTPS (or `localhost`); otherwise it falls back to the phone's camera app via a file input.

## How it works

- `stations.js`: station list. Each station has a name, camera instructions, an optional follow-up question, and its own stamp SVG drawn in `currentColor`.
- `app.js`: rendering, camera, question form, and storage.
- Photos are center-cropped to 640×640 JPEG data URLs and saved with everything else in `localStorage` (`party-passport:v1`).
- Each passport gets one stamp ink color at random on first load: dark red 40%, dark green 40%, Christmas-light yellow 20%. Stamp rotation and offset are randomized per stamp.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```
