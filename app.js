console.log('doc loading');

$(document).ready(function() {
  console.log('doc ready');

  var workingData = [];
  var fermentables = JSON.parse(localStorage.getItem('fermentables'));
  var filteredFermentables = JSON.parse(localStorage.getItem('filteredFermentables'));

  var parseFermentables = function() {
    var workingArray = [];
    for (var i = 0; i < fermentables.length; i++) {
      if (fermentables[i].potential) {
        workingArray = workingArray.concat(fermentables[i]);
      }
    }
    localStorage.setItem('filteredFermentables', JSON.stringify( workingArray));
  };

  var requestFunction = function(startPage, stopPage) {
    var currentPage = startPage;
    var lastPage = stopPage;
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb&p='+ (currentPage).toString()).done(function(data) {
      workingData = workingData.concat(data.data);
      // console.log(workingData)
      currentPage += 1;
      if (currentPage <= lastPage) {
        requestFunction(currentPage, lastPage);
      } else {
        localStorage.setItem('fermentables', JSON.stringify(workingData));
        // console.log(JSON.parse(localStorage.getItem('fermentables')));
      }
    });
  };

  var fermentablesOptions = function () {
    var target = $(document).find('#fermentables-selector').children('optgroup');
    for(var i = 0; i < filteredFermentables.length; i++) {
      var name = filteredFermentables[i].name;
      console.log(name);
      $(target).append('<option>' + name + '</option>');
    }
  };

  if (!fermentables) {
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      workingData = workingData.concat(data.data);
      // console.log(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages);
      } else {
        localStorage.setItem('fermentables', JSON.stringify(workingData));
      }
    });
  } else {
    console.log(JSON.parse(localStorage.getItem('fermentables')));
    parseFermentables();

    fermentablesOptions();

  }








});
