#!/usr/bin/env node

function text_rgb(rgb) {
    const red = rgb[0];
    const green = rgb[1];
    const blue = rgb[2];
    const encoded = 0x1000000 + (0x10000 * red) + (0x100 * green) + blue;
    return '#' + encoded.toString(16).substr(1);
}

// const rotations = [ 30, 90, 120 ]; // degrees
function vector(angle, radius) {
    const offset = (angle === 30) ? [1, 2] : (angle === 90) ? [2, 0] : (angle === 120) ? [1, -2] : null;
    offset.forEach(function(value, i) { offset[i] *= radius; });
    return offset;
}

// const safe = [ 3, 6, 9, 12, 15 ];
function colorspace(angle_index, strength) {
    const rgb = [ 0, 0, 0 ];
    rgb[angle_index] = strength;
    const text = text_rgb(rgb);
    return text;
}

function generate() {
    const cells = [];
    const center = [ 13, 14 ];
    const rotations = [ 30, 90, 120 ]; // degrees
    const safe = [ 3, 6, 9, 12, 15 ]; // center@0 implied, ignore white
    safe.forEach(function(value, i) { safe[i] = value * 0x11; });

    const black = "#000000";
    const entry = { xyloc: center , colors: [ black ] }; // black center
    cells.push(entry);
    console.log("angle:", 0, "radius:", 0, "xyloc:", center, "color:", black);

    // both positive and negative (+180?)
    // hex complement for negative color
    rotations.forEach(function(angle, i) {
        safe.forEach(function(radius, j) {
            const offset =  vector(angle, j + 1);
            var x = center[0] + offset[0];
            var y = center[1] + offset[1];
            const color = colorspace(i, radius);
            const xyloc = [ x, y ];
            const entry = { xyloc: xyloc, colors: [ color ] };
            cells.push(entry);
            console.log("angle:", angle, "radius:", j + 1, "xyloc:", xyloc, "color:", color);
        });
    });
    return cells;
}

function main() {
    const fname = "radial-palette.json";
    const items = generate();
    const wrapper = { version: 2, items: items };
    const json_text = JSON.stringify(wrapper, null, 4);
    // console.log(json_text);

    // or 'fs.write()' or 'fs.createWriteStream()'
    const fs = require('fs');
    fs.writeFile(fname, json_text, 'utf-8', function(err) {
        if (!err) return;
        console.log(err);
        process.exit(1);
    }); 
    console.log(fname);
}

main();
