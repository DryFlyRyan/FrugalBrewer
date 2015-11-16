console.log('doc loading');

$(document).ready(function() {
  console.log('doc ready');

  var fermentables = JSON.parse(localStorage.getItem('fermentables'))

  if (!fermentables) {
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
      console.log('requested');
    }).done(function(data){
      fermentables = localStorage.setItem('fermentables', JSON.stringify(data))
      console.log(data);
    });
  }

  console.log(fermentables);

  // var hops = JSON.parse(localStorage.getItem())
  //
  // if (!hops) {
  //   $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/hops/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
  //     console.log('requested');
  //   }).done(function(data){
  //     hops = localStorage.setItem('hops', JSON.stringify(data))
  //   });
  // }



});
