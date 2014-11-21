var path = require('path'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    htmlparser = require("htmlparser2");

function create_theme_base(dest) {
    fs.writeFile(path.join(dest, 'header.php'), '', function(err) {
        if (err) throw err;
    });

    fs.writeFile(path.join(dest, 'index.php'), '', function(err) {
        if (err) throw err;
    });

    fs.writeFile(path.join(dest, 'footer.php'), '', function(err) {
        if (err) throw err;
    });

    fs.writeFile(path.join(dest, 'style.css'), '', function(err) {
        if (err) throw err;
    });
}

function write_to(dest, theme_file, data) {
    fs.writeFile(path.join(dest, theme_file+'.php'), data, function(err) {
        if (err) throw err;
    });
}

module.exports = {
    process: function(file, dest) {

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        fs.readFile(file, 'utf8', function(err, data) {
            var theme_file = null;
            var is_index = false;
            data = data.trim();

            if (err) {
                return console.log(err);
            }

            if (/index\.html$/g.test(file)) {
                console.log('"index.html" detected.\n Generating the base theme...');
                create_theme_base(dest);
                is_index = true;
            }

            $ = cheerio.load(data);

            if (is_index) {
                // removing innecesary tags
                $('meta[charset]').remove();
                $('title').remove();

                // writing header
                header  = '<!DOCTYPE html>\n';
                header += '<html <?php language_attributes(); ?>>\n';
                header += '<head>\n';
                header += ' <meta charset="<?php bloginfo( \'charset\' ); ?>" />\n';
                header += ' <link rel="profile" href="http://gmpg.org/xfn/11" />\n';
                header += ' <link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>" type="text/css" media="screen" />\n';
                header += ' <link rel="pingback" href="<?php bloginfo( \'pingback_url\' ); ?>" />\n';
                header += ' <?php if ( is_singular() && get_option( \'thread_comments\' ) ) wp_enqueue_script( \'comment-reply\' ); ?>\n';
                header += $('head').html()+'\n';
                header += ' <?php wp_head(); ?>\n';
                header += '</head>\n';
                header += '<body>\n';
                if ($('header')) {
                    header += '<header>\n';
                    header += $('header').html()+'\n';    
                    header += '</header>\n';
                }

                // update header file
                write_to(dest, 'header', header);

                _index = $('body').clone();
                $('header', _index).remove();
                $('footer', _index).remove();
                index  = '<?php get_header(); ?>';
                index += _index.html();
                index += '<?php get_footer(); ?>';

                // update the index file
                write_to(dest, 'index', index);

                footer  = $('footer').html()+'\n';
                footer += '<?php wp_footer(); ?>\n';
                footer += '</body>\n';
                footer += '</html>';

                // update footer file
                write_to(dest, 'footer', footer);
             }

        });
    }
};
