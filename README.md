# Juanito, the helper

### Juanito will help you create a WordPress theme just by using your HTML files

[![NPM](https://nodei.co/npm/juanito.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/juanito/)[![NPM](https://nodei.co/npm-dl/juanito.png)](https://nodei.co/npm/juanito/)

**Simple Usage**:

  `juanito -s <source> -d <destination>`

**Parameters**:
<pre>
  -h, --help                       output usage information
  -V, --version                    output version number
  -s, --source [source]            Set template source (required)
  -d, --destination [destination]  Set template destination folder (required)
  -i, --ignore-configuration       Ignore theme configuration
  -T, --post-thumbnails            Add post thumbnail support
  -F, --post-formats               Add post formats support
  -B, --custom-background          Add custom background support
  -H, --custom-header              Add custom header support
  -L, --auto-feed-links            Add automatic feed links support
  -5, --html5                      Add HTML5 support
  -T, --title-tag                  Add title tag support
</pre>

**Support using data-* atributtes**
  * `data-menu="name"` for Menus.
    * Ex. `<nav data-menu="main_menu"><ul><li>...</li></nav>`
  * `data-sidebar="name"`for Sidebars
    * Ex. `<aside data-sidebar="right_sidebar"><ul><li>...</li></aside>`
  * `data-loop="name"` for The Loop
    * Ex. `<article data-loop="last">...</article>`

**Example 1 (Filename)**:

  `juanito -s examples/example1/index.html -d theme`

**Example 2 (Directory)**:

  `juanito -s examples/example8 -d theme8 -i`

  ![Example 2](https://raw.githubusercontent.com/alvaroveliz/juanito/master/examples/juanito_example.gif)

**Install**

  `npm -g install juanito`

**Roadmap**

  - [x] `archive.php` support
  - [x] Image files support `<img src="" />`
  - [x] `sidebar.php` support
  - [x] `functions.php` default configuration
  - [x] Menu support
  - [x] Sidebar support
  - [x] "The Loop" recognizing via `data-tags`
  - [x] Custom pages support
  - [x] Custom Javascript and stylesheet files support
  - 

**Documentation**

- [Check Out Our Wiki](https://github.com/alvaroveliz/juanito/wiki)
