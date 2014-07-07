$(document).ready(function(){
  var active_map;
  findUser();

  $('#address_submit').on('click', function(event){
    findAddress();
  })
});


function findUser() {
  if (navigator.geolocation){
    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      var data = {latitude: latitude, longitude: longitude};

      updatePage(data, 'Your Current Location')
    };
    navigator.geolocation.getCurrentPosition(success);
  }
}

function findAddress(){
  var address = $('#address').val();
  $('#address').val('')
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': address + 'chicago'}, function(results, status){
    var lat = results[0].geometry.location.k;
    var lng = results[0].geometry.location.B;
    data = {latitude: lat, longitude: lng};
    updatePageFromAddress(data, address);
  });
}

function updatePage(data, location) {
  $.post('/load_region', data, function(response){ 
    $('#active_map').append(response)
  });

  postCurrentLocation(data, location);
  $.post('/current_position', data, function(response){ 
    $('.copy p:first-child').html('The Next Street Cleaning<br>For ' + location + ' Is:<br>' + response.next_sweep);
    var days = response.sweep_days;
    str = "<h3>Next Cleaning: " + response.next_sweep + "</h3><h3>Street Cleaning Days</h3><ul>";
    for (var i=0; i<days.length; i++) {
      str += '<li>' + days[i] + '</li>';
    }
    $('.cleaning_col').html(str + '</ul>');
  }, 'JSON');
}

function updatePageFromAddress(data, location) {
  $.post('/load_region_from_address', data, function(response){ 
    $('#active_map').replaceWith(response)
  });

  postCurrentLocation(data, location);
}

function postCurrentLocation(data, location) {
  $.post('/current_position', data, function(response){ 
    $('.copy p:first-child').html('Next Street Cleaning<br>For ' + location + ' Is:<br>' + response.next_sweep);

    $('#next').html("<h3>Next Cleaning: " + response.next_sweep);
      
    str = "</h3><h3>Street Cleaning Days</h3><ul>"
    $('.copy p:first-child').html('The Next Street Cleaning<br>For ' + location + ' Is:<br>' + response.next_sweep);
    var days = response.sweep_days;
    if (days.length > 0) {
      for (var i=0; i<days.length; i++) {
        str += '<li>' + days[i] + '</li>';
      }
    } else {
      str += '<li>none</li>';
    }
    $('#future').html(str + '</ul>');
  }, 'JSON');
}