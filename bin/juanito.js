#! /usr/bin/env node

var path = require('path'),
    pkg = require(path.join(__dirname, '../package.json')),
    parser = require('../lib/parser'),
    program = require('commander'),
    inquirer = require('inquirer');

program
    .version(pkg.version)
    .option('-s, --source [source]', 'Set the template source (required)')
    .option('-d, --destination [destination]', 'Set the template destination folder (required)')
    .option('-i, --ignore-configuration', 'Ignore the theme configuration')
    .option('-T, --post-thumbnails', 'Add post thumbnail support')
    .option('-F, --post-formats', 'Add post formats support')
    .option('-B, --custom-background', 'Add custom background support')
    .option('-H, --custom-header', 'Add custom header support')
    .option('-L, --auto-feed-links', 'Add automatic feed links support')
    .option('-5, --html5', 'Add HTML5 support')
    .option('-T, --title-tag', 'Add title tag support')
    .parse(process.argv);

if (!program.source) {
    console.log('Error: you have to specify a source filename or folder');
    return false;
}

if (!program.destination) {
    console.log('Error: you have to specify a destination folder name');
    return false;
}

if (!program.ignoreConfiguration) {
    inquirer.prompt([{
            type: 'input',
            name: 'theme_name',
            message: 'Please input the theme name'
        }, {
            type: 'input',
            name: 'theme_uri',
            message: 'Please input the theme uri'
        }, {
            type: 'input',
            name: 'author',
            message: 'Please input the theme author'
        }, {
            type: 'input',
            name: 'author_uri',
            message: 'Please input the theme author uri'
        }, {
            type: 'input',
            name: 'description',
            message: 'Please input the theme description'
        }, {
            type: 'input',
            name: 'version',
            message: 'Please input the theme version'
        }, {
            type: 'input',
            name: 'license',
            message: 'Please input the theme license'
        }, {
            type: 'input',
            name: 'license_uri',
            message: 'Please input the theme license uri'
        }, {
            type: 'input',
            name: 'tags',
            message: 'Please input the theme tags (comma separated)'
        }],
        function(themeOpts) {
            parser.process(program, themeOpts);
        }
    );
} else {
    parser.process(program);
}
