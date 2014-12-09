var path = require('path'),
    fs = require('fs'),
    wrench = require('wrench'),
    ncp = require('ncp').ncp,
    cheerio = require('cheerio'),
    htmlparser = require("htmlparser2")
    ;

var juanito_styles = [];
var juanito_scripts = [];

function generateBaseTheme(dest) {
    writeTo(dest, 'index', '');
    writeTo(dest, 'header', '');
    writeTo(dest, 'footer', '');
};

function generateThemeStyle(dest, opts) {
    style  = '/*\r\n';
    if (opts) {
        if (opts.theme_name) {
        style += 'Theme Name: ' + opts.theme_name + '\r\n';
        }
        if (opts.theme_uri) {
            style += 'Theme URI: ' + opts.theme_uri + '\r\n';
        }
        if (opts.author) {
            style += 'Author: ' + opts.author + '\r\n';
        }
        if (opts.author_uri) {
            style += 'Author URI: ' + opts.author_uri + '\r\n';
        }
        if (opts.description) {
            style += 'Description: ' + opts.description + '\r\n';
        }
        if (opts.version) {
            style += 'Version: ' + opts.version + '\r\n';
        }
        if (opts.license) {
            style += 'License: ' + opts.license + '\r\n';
        }
        if (opts.license_uri) {
            style += 'License URI: ' + opts.license_uri + '\r\n';
        }
        if (opts.tags) {
            style += 'Tags: ' + opts.tags + '\r\n';
        }
        style += '\r\n';
    }
    style += 'Theme created with juanito\r\n';
    style += 'https://github.com/alvaroveliz/juanito\r\n';
    style += '*/\r\n';

    for (s in juanito_styles) {
        style += '@import url(\''+juanito_styles[s]+'\');';
    }

    writeTo(dest, 'style', style);
}

function generateFunctions(dest, options) {
    functions = '<?php\r\n'+
        '/** \r\n' +
        ' * functions.php\r\n' +
        ' * by juanito\r\n' +
        ' */\r\n' +
        '\r\n' +
        'function theme_init() {\r\n' +
        '    theme_support();\r\n' +
        '    theme_menus();\r\n' +
        '    theme_sidebars();\r\n' +
        '}\r\n\r\n';

    functions += 'add_action(\'init\', \'theme_init\');\r\n\r\n';

    // Theme support
    functions += 'function theme_support() {\r\n';

    if (options.postThumbnails) {
        functions += '    add_theme_support(\'post-thumbnails\');\r\n';
    }

    if (options.postFormats) {
        functions += '    add_theme_support(\'post-formats\');\r\n';
    }

    if (options.customBackground) {
        functions += '    add_theme_support(\'custom-background\');\r\n';
    }

    if (options.customHeader) {
        functions += '    add_theme_support(\'custom-header\');\r\n';
    }

    if (options.autoFeedLinks) {
        functions += '    add_theme_support(\'automatic-feed-links\');\r\n';
    }

    if (options.html5) {
        functions += '    add_theme_support(\'html5\');\r\n';
    }

    if (options.titleTag) {
        functions += '    add_theme_support(\'title-tag\');\r\n';
    }

    functions += '}\r\n\r\n';

    writeTo(dest, 'functions', functions);
}

function generateThemeMenus(dest, menus)
{   
    functions  = '\r\n';
    functions += 'function theme_menus() {\r\n';
    if (menus.length > 0) {
        menus.each(function(m, menu) {
            menu_name = $(menu).attr('data-menu');
            
            console.log('Generating menu : '+menu_name);    

            functions += '    register_nav_menu(\''+menu_name+'\', \''+menu_name+'\');\r\n';
        });
    }

    functions += '}\r\n\r\n';

    writeTo(dest, 'functions', functions, true);
}

function generateThemeSidebars(dest, sidebars)
{
    functions  = '\r\n';
    functions += 'function theme_sidebars() {\r\n';
    if (sidebars.length > 0) {
        sidebars.each(function(m, menu) {
            sidebar_name = $(menu).attr('data-sidebar');
            
            console.log('Generating sidebar : '+sidebar_name);    

            functions += '    $args[\'name\'] = \'Sidebar '+sidebar_name+'\';\r\n';
            functions += '    $args[\'id\']   = \''+sidebar_name+'\';\r\n';
            functions += '    register_sidebar($args);\r\n';
        });
    }

    functions += '}\r\n\r\n';

    writeTo(dest, 'functions', functions, true);
}

function writeTo(dest, theme_file, data, append) {
    ext = (theme_file == 'style') ? 'css' : 'php';
    append = (typeof(append) == 'undefined') ? false : append;

    if (append) {
        fs.appendFile(path.join(dest, theme_file + '.' + ext), data, function(err) {
            if (err) throw err;
        });    
    } else {
        fs.writeFile(path.join(dest, theme_file + '.' + ext), data, function(err) {
            if (err) throw err;
        });    
    }
};

function parseFile(file, dest, theme_opts) {
    console.log('> Parsing file: ' + file);
    fs.readFile(file, 'utf8', function(err, data) {
        var theme_file = null;
        var is_index = false;

        if (err) {
            return console.log(err);
        }

        if (/index\.html$/g.test(file)) {
            console.log('>> "index.html" detected.\r\nGenerating base theme...');
            generateBaseTheme(dest);
            is_index = true;
        }

        $ = cheerio.load(data);

        if (is_index) {
            // removing innecesary tags
            $('meta[charset]').remove();
            $('title').remove();

            // Generate menus
            generateThemeMenus(dest, $('[data-menu]'));

            if ($('[data-menu]').length > 0) {
                $('[data-menu]').each(function(m, menu) {
                    menu_name = $(menu).attr('data-menu');
                    menu_tpl  = "\r\n<?php \r\n";
                    menu_tpl += "    $opts['theme_location'] = '"+menu_name+"';\r\n";
                    menu_tpl += "    wp_nav_menu($opts);\r\n";
                    menu_tpl += "?>\r\n";
                    $(this).html(menu_tpl);
                });
            }

            // Generate sidebars
            generateThemeSidebars(dest, $('[data-sidebar]'));

            if ($('[data-sidebar]').length > 0) {
                $('[data-sidebar]').each(function(s, sidebar) {
                    sidebar_name = $(sidebar).attr('data-sidebar');
                    sidebar_tpl  = '\r\n<?php if (!dynamic_sidebar(\''+sidebar_name+'\')): ?>\r\n';
                    sidebar_tpl += $(this).html();
                    sidebar_tpl += '<?php endif; ?>\r\n';
                    $(this).html(sidebar_tpl);
                });
            }

            // Parsing styles and generate theme styles
            $('link[rel=stylesheet]').each(function(i, item){
                juanito_styles.push(item.attribs.href);
            }).remove();

            generateThemeStyle(dest, theme_opts);

            // Parsing Javascript Files
            $('script[src]').each(function(i, item){
                juanito_scripts.push(item.attribs.src);
            });

            // writing header
            header = '<!DOCTYPE html>\r\n';
            header += '<html <?php language_attributes(); ?>>\r\n';
            header += '<head>\r\n';
            header += ' <meta charset="<?php bloginfo( \'charset\' ); ?>" />\r\n';
            header += ' <link rel="profile" href="http://gmpg.org/xfn/11" />\r\n';
            header += ' <link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>" type="text/css" media="screen" />\r\n';
            header += ' <link rel="pingback" href="<?php bloginfo( \'pingback_url\' ); ?>" />\r\n';
            header += ' <?php if ( is_singular() && get_option( \'thread_comments\' ) ) wp_enqueue_script( \'comment-reply\' ); ?>\r\n';
            header += $('head').html();
            header += ' <?php wp_head(); ?>\r\n';
            header += '</head>\r\n';
            header += '<body>\r\n';
            if ($('header')) {
                header += '<header>\r\n';
                header += $('header').html() + '\r\n';
                header += '</header>\r\n';
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

            footer = '<footer>\r\n';
            footer += $('footer').html() + '\r\n';
            for (j in juanito_scripts)
            {
                footer += '<script src="'+juanito_scripts[j]+'" />\r\n';
            }
            footer += '</footer>\r\n';

            footer += '<?php wp_footer(); ?>\r\n';
            footer += '</body>\r\n';
            footer += '</html>';

            // update footer file
            writeTo(dest, 'footer', footer);
        } else {
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
                page = '<?php get_header(); ?>';
                page += _page.html();
                page += '<?php get_footer(); ?>';
                writeTo(dest, page_name, page);
            } else if (/single\.html$/g.test(file)) {
                _single = $('body').clone();
                $('header', _single).remove();
                $('footer', _single).remove();
                single = '<?php get_header(); ?>';
                single += _single.html();
                single += '<?php get_footer(); ?>';
                writeTo(dest, 'single', single);
            }
        }
    });
};

function checkDirectoryContents(source, dest) {
    console.log('Checking contents of : ' + source);

    fs.readdir(source, function(err, files) {
        if (err) throw err;

        for (f in files) {
            processFileOrFolder(source, dest, files[f]);
        }
    })
};

function processFileOrFolder(source, dest, filefolder) {
    source_file = source + '/' + filefolder;
    dest_file = dest + '/' + filefolder;
    stats = fs.statSync(source_file, function(err, stats) {
        if (err) throw err;
    });

    if (stats.isFile()) {
        if (/(.*)\.html$/.test(source_file)) {
            parseFile(source_file, dest);
        }
    } else if (stats.isDirectory()) {
        ncp(source_file, dest_file, function(err){
            if (err) { throw err; }
        });
    }
};

module.exports = {
    process: function(program, theme_opts) {
        var source = program.source;
        var dest = program.destination;

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
    
        generateFunctions(dest, program);

        fs.stat(source, function(err, stats) {
            if (err) throw err;

            if (stats.isFile()) {
                parseFile(source, dest, theme_opts);
            } else if (stats.isDirectory()) {
                checkDirectoryContents(source, dest);
            }
        });

    }
};
