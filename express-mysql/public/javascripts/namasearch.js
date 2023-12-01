$(document).ready(function() {
    $('#nama').on('keyup', function() {
      $.ajax({
        type: 'GET',
        url: '/santri/search',
        data: {
          term: $(this).val()
        },
        success: function(data) {
          $('#suggestions').html(data);
        }
      });
    });
  });