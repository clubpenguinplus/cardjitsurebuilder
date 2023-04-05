# Card Jitsu Re-builder

Scripts to re-build assets for Card Jitsu.

## Pre-requisites

-   A working installation of [Node.js](https://nodejs.org/en/)
-   A working and licensed copy of [TexturePacker](https://www.codeandweb.com/texturepacker)
-   A working copy of Adobe Flash CS6/Adobe Animate

## Usage

-   Start by installing the node modules

```js
npm install
```

-   Then, run the JSFL script (`export.jsfl`) to extract the assets from the FLAs. It will ask for the location to input from and the location of the output. The input should be `./flas` as that is where the FLAs are located by default. The output should be `./raw` as that is what other scripts are set for by default.
-   This will likely take many hours to complete.
-   Once the extraction is complete, run the (`data.jsfl`) file to extract the layer data from the FLAs. Same as above, it will ask for input and output folders. These should be `./flas` for input and `./output` for the output.

-   Next, run the `mask.js` script to correct positioning of any exported masks. This is a one-time fix for the masks that were exported incorrectly.

```js
node mask.js
```

-   After this, run the `repack.js` script to pack the assets into spritesheets. This will take a long time to complete.

```js
node repack.js
```

-   Finally, run the `trim.js` script to trim and get correct position data for the sprites, to reduce memory usage in game.

```js
node trim.js
```
