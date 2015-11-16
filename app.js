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
      console.log(data);
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      localStorage.setItem('fermentables' + pageNumber.toString(), JSON.stringify(data));
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages);
      }
    });
  }

  var requestFunction = function(startPage, stopPage) {
    var currentPage = startPage;
    var lastPage = stopPage;
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb&p='+ (currentPage).toString()).done(function(data) {
      localStorage.setItem('fermentables' + currentPage.toString(), JSON.stringify(data));
      currentPage += 1;
      if (currentPage <= lastPage) {
        requestFunction(currentPage, lastPage);
      }
    });
  };

});
