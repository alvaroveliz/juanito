var path = require('path'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    htmlparser = require("htmlparser2");

function generateBaseTheme(dest) {
    writeTo(dest, 'index', '');
    writeTo(dest, 'header', '');
    writeTo(dest, 'footer', '');
    writeTo(dest, 'functions', '');
};

function generateThemeStyle(dest, opts)
{
    style  = '/*\n';
    if (opts.theme_name) {
        style += 'Theme Name: '+opts.theme_name+'\n';
    }
    if (opts.theme_uri) {
        style += 'Theme URI: '+opts.theme_uri+'\n';
    }
    if (opts.author) {
        style += 'Author: '+opts.author+'\n';
    }
    if (opts.author_uri) {
        style += 'Author URI: '+opts.author_uri+'\n';
    }
    if (opts.description) {
        style += 'Description: '+opts.description+'\n';   
    }
    if (opts.version) {
        style += 'Version: '+opts.version+'\n';   
    }
    if (opts.license) {
        style += 'License: '+opts.license+'\n';   
    }
    if (opts.license_uri) {
        style += 'License URI: '+opts.license_uri+'\n';   
    }
    if (opts.tags) {
        style += 'Tags: '+opts.tags+'\n';   
    }
    style +=  '*/\n';
    writeTo(dest, 'style', style);
}

function writeTo(dest, theme_file, data) {
    ext = (theme_file == 'style') ? 'css' : 'php';
    fs.writeFile(path.join(dest, theme_file + '.' + ext), data, function(err) {
        if (err) throw err;
    });
};

function parseFile(file, dest) {
    console.log('> Parsing file: ' + file);
    fs.readFile(file, 'utf8', function(err, data) {
        var theme_file = null;
        var is_index = false;

        if (err) {
            return console.log(err);
        }

        if (/index\.html$/g.test(file)) {
            console.log('>> "index.html" detected.\nGenerating base theme...');
            generateBaseTheme(dest);
            is_index = true;
        }

        $ = cheerio.load(data);

        if (is_index) {
            // removing innecesary tags
            $('meta[charset]').remove();
            $('title').remove();

            // writing header
            header = '<!DOCTYPE html>\n';
            header += '<html <?php language_attributes(); ?>>\n';
            header += '<head>\n';
            header += ' <meta charset="<?php bloginfo( \'charset\' ); ?>" />\n';
            header += ' <link rel="profile" href="http://gmpg.org/xfn/11" />\n';
            header += ' <link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>" type="text/css" media="screen" />\n';
            header += ' <link rel="pingback" href="<?php bloginfo( \'pingback_url\' ); ?>" />\n';
            header += ' <?php if ( is_singular() && get_option( \'thread_comments\' ) ) wp_enqueue_script( \'comment-reply\' ); ?>\n';
            header += $('head').html() + '\n';
            header += ' <?php wp_head(); ?>\n';
            header += '</head>\n';
            header += '<body>\n';
            if ($('header')) {
                header += '<header>\n';
                header += $('header').html() + '\n';
                header += '</header>\n';
            }

            // update header file
            writeTo(dest, 'header', header);

            _index = $('body').clone();
            $('header', _index).remove();
            $('footer', _index).remove();
            index = '<?php get_header(); ?>';
            index += _index.html();
            index += '<?php get_footer(); ?>';

            // update the index file
            writeTo(dest, 'index', index);

            footer = $('footer').html() + '\n';
            footer += '<?php wp_footer(); ?>\n';
            footer += '</body>\n';
            footer += '</html>';

            // update footer file
            writeTo(dest, 'footer', footer);
        }
        else {
            // page detection
            if (/page(.*)\.html$/g.test(file)) {
                page_name = 'page';
                custom_page_name = /page(.*)\.html$/g.exec(file);
                if (typeof(custom_page_name) == 'object') {
                    page_name += custom_page_name[1];
                }

                _page = $('body').clone();
                $('header', _page).remove();
                $('footer', _page).remove();
                page  = '<?php get_header(); ?>';
                page += _page.html();
                page += '<?php get_footer(); ?>';
                writeTo(dest, page_name, page);
            }
            else if (/single\.html$/g.test(file)) {
                _single = $('body').clone();
                $('header', _single).remove();
                $('footer', _single).remove();
                single  = '<?php get_header(); ?>';
                single += _single.html();
                single += '<?php get_footer(); ?>';
                writeTo(dest, 'single', single);
            }
        }
    });
};

function checkDirectoryContents(directory, dest) {
    console.log('Checking contents of : ' + directory);

    fs.readdir(directory, function(err, files) {
        if (err) throw err;

        for (f in files) {
            if (/(.*)\.html$/.test(files[f])) {
                realfile = directory + '/' + files[f];
                parseFile(realfile, dest);
            }
        }
    })
};

module.exports = {
    process: function(source, dest, themeOpts) {

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        if (themeOpts) {
            generateThemeStyle(dest, themeOpts);    
        }

        fs.stat(source, function(err, stats) {
            if (err) throw err;

            if (stats.isFile()) {
                parseFile(source, dest);
            } else if (stats.isDirectory()) {
                checkDirectoryContents(source, dest);
            }
        });
    }
};
