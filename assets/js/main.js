$(document).ready(function(){
    $('#left-menu').affix({
          offset: {
            top: 400
          }
    });

    $(document.body).scrollspy({
        target: '#nav-left',
        offset: 100
    });
});