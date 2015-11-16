console.log('doc loading');

$(document).ready(function() {
  console.log('doc ready');

  var fermentables = JSON.parse(localStorage.getItem('fermentables'))

  if (!fermentables) {
    var fermentList = '';
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
      console.log('requested');
    }).done(function(data){
      // fermentables = localStorage.setItem('fermentables', JSON.stringify(data));
      fermentList = fermentList + JSON.stringify(data);
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      console.log(totalPages);
      if (pageNumber < totalPages) {
        for (var i = pageNumber+1; i <= totalPages; i++) {
          console.log(i);
          $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb&p='+ (i).toString(), function () {
            console.log('serverStatus');
            console.log('requesting page', i);
          }).done(function(data){
            console.log('returning page', i);
          });
        }
      }
    });
  }

  var requestFunction = function(startPage, stopPage) {
    var currentPage = startPage;
    var lastPage = stopPage;
    $.get($.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb&p='+ (currentPage).toString()).done(function(data) {
      currentPage += 1
      console.log(data);
      if (currentPage <= lastPage) {
        requestFunction(currentPage, lastPage);
      }
      else {
        return false;
      }
    })
  }



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
