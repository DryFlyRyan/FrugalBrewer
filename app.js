console.log('doc loading');

$(document).ready(function() {
  console.log('doc ready');
  var fermentablesWorking = '';
  var fermentables = localStorage.getItem('fermentables');
  var parsedFermentables = null;
  var hello = "hello world";


  if (!fermentables) {
    var fermentList = '';
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
      console.log('requested');
    }).done(function(data){
      // fermentables = localStorage.setItem('fermentables', JSON.stringify(data));
      fermentablesWorking = JSON.stringify(data);
      console.log(data);
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      console.log(totalPages);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages);
      }
    });
  }

  var requestFunction = function(startPage, stopPage) {
    var currentPage = startPage;
    var lastPage = stopPage;
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb&p='+ (currentPage).toString()).done(function(data) {
      currentPage += 1;
      console.log(data);
      fermentablesWorking = fermentablesWorking + JSON.stringify(data);
      // console.log(fermentablesWorking);
      if (currentPage <= lastPage) {
        requestFunction(currentPage, lastPage);
      }
      else {

        localStorage.setItem('fermentables', fermentablesWorking);
      }
    });

  };

  if (fermentables) {
    parsedFermentables = JSON.parse(fermentables);
  }
  console.log('fermentables', JSON.parse(fermentables));
  // console.log(parsedFermentables);

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
