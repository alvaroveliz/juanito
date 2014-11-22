#! /usr/bin/env node

var path = require('path'),
    pkg = require(path.join(__dirname, '../package.json')),
    parser = require('../lib/parser'),
    program = require('commander')
    ;

program
    .version(pkg.version)
    .option('-d, --dest <destination>', 'Destination folder')
    .parse(process.argv)
    ;

if (!process.argv[2]) {
    console.log('Error: you have to specify a filename or folder');
    return false;
}

if (!program.dest) {
    console.log('Error: you have to specify a destination folder name');
    return false;
}

parser.process(process.argv[2], program.dest);    




