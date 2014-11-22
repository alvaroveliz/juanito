#! /usr/bin/env node

var path = require('path'),
    pkg = require(path.join(__dirname, '../package.json')),
    parser = require('../lib/parser'),
    program = require('commander'),
    inquirer = require('inquirer')
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

inquirer.prompt([
        {
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
        }
    ], 
    function(answers){
        parser.process(process.argv[2], program.dest, answers);
    }
);



