(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('#textarea1').val('New Text');
    $('#textarea1').trigger('autoresize');
    $('select').formSelect();

  });
})(jQuery);
