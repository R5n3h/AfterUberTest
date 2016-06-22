var googleMap = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA8RhH3mvTAKbW432W909RfDPi_6B9CMY8&address={0}";

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(document).ready(function(){
    var $cont = $('#estimates-container');
    var $items = $cont.find('.items');

    $('#formRideRate').submit(function(e){
        e.preventDefault();
        $('#loading').show();

        var url = $(this).attr('action');
        var data = JSON.stringify($(this).serializeObject());

        $cont.hide();
        $items.html('');

        $.ajax({
          type: 'POST',
          url: url,
          data: data,
          contentType: 'application/json;charset=UTF-8',
          dataType: 'json',
          success: function(data, status) {
            $('#loading').hide();
            if (!data) {
                console.error('Cannot find any estimates');
            }

            var items = data.items;
            items.forEach(function(item, i) {
                var itemHtml = "<div class='thumbnail'><div class='caption item'><h4>{0}</h4><p>{1}</p></div></div>".format(item.name, item.price);
                $items.append(itemHtml);
            });
            $cont.fadeIn(500);
          },
          error: function(err) {
            $('#loading').hide();
            console.log(err);
          }
        });
    });

    $('#start_address').change(function(e){
        var address = encodeURIComponent($(this).val());
        setGeometry('start_address', address);
    });

    $('#end_address').change(function(e){
        var address = encodeURIComponent($(this).val());
        setGeometry('end_address', address);
    });

    var setGeometry = function(v, address) {
        var url = googleMap.format(address);
        $.ajax({
          type: 'GET',
          url: url,
          dataType: 'json',
          success: function(data, status) {
            if (!data)
                return;

            var results = data.results;
            if (!results)
                return;

            var result = results.pop();
            var geometry = result.geometry;

            var location = geometry.location;
            if (v == 'start_address') {
                $('#start_latitude').val(location.lat);
                $('#start_longitude').val(location.lng);
            }
            else if (v == 'end_address') {
                $('#end_latitude').val(location.lat);
                $('#end_longitude').val(location.lng);
            }
        }
        });
    };
});