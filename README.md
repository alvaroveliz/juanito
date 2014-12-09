# Juanito, the helper

### Juanito will help you to create a Wordpress Theme just using your html files

**Simple Usage**:

  `juanito -s <source> -d <destination>`

**Parameters**:
<pre>
  -h, --help                       output usage information
  -V, --version                    output the version number
  -s, --source [source]            Set the template source (required)
  -d, --destination [destination]  Set the template destination folder (required)
  -i, --ignore-configuration       Ignore the theme configuration
  -T, --post-thumbnails            Add post thumbnail support
  -F, --post-formats               Add post formats support
  -B, --custom-background          Add custom background support
  -H, --custom-header              Add custom header support
  -L, --auto-feed-links            Add automatic feed links support
  -5, --html5                      Add HTML5 support
  -T, --title-tag                  Add title tag support
</pre>

**Example 1 (Filename)**:

  `juanito -s examples/example1/index.html -d theme`

**Example 2 (Directory)**:

  `juanito -s examples/example4 -d theme4`
  
  ![Example 2](https://raw.githubusercontent.com/alvaroveliz/juanito/master/examples/juanito_example.gif)

**Install**

  `npm -g install juanito`

**Support using data-* atributtes**
  * `data-menu="name"` for Menus. 
    * Ex: `<nav data-menu="main_menu"><ul><li>...</li></nav>`

**Roadmap**

  - [x] `functions.php` default configuration
  - [x] Menu support
  - [ ] Sidebar support
  - [ ] "The Loop" recognizing via `data-tags`
  - [x] Custom pages support
  - [x] Custom javascript and stylesheet files support

*This is a beta version*
