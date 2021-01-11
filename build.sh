#!/bin/sh

rollup lib/zip.js --file dist/zip.js --format umd --name "zip"
rollup lib/zip-fs.js --file dist/zip-fs.js --format umd --name "zip"

rollup lib/zip.js --file dist/zip.min.js --format umd --name "zip" --plugin terser
rollup lib/zip-fs.js --file dist/zip-fs.min.js --format umd --name "zip" --plugin terser
terser lib/z-worker.js > dist/z-worker.js
terser lib/deflate.js > dist/deflate.js
terser lib/inflate.js > dist/inflate.js
terser lib/crypto.js > dist/crypto.js