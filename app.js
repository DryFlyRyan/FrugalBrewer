console.log('doc loading');

$(document).ready(function() {
  console.log('doc ready');

  var workingData = [];
  var fermentables = JSON.parse(localStorage.getItem('fermentables'));
  var fermentablesFiltered = JSON.parse(localStorage.getItem('fermentablesFiltered'));



  var requestFunction = function(startPage, stopPage, source) {

    var currentPage = startPage;
    var lastPage = stopPage;
    var destination = source;
    if (typeof destination !== 'string') {
      console.log('requestFunction(source) must be a string');
      destination = source.toString();
    }
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/' + destination + '/?key=166f0b6348fdccde864dc9aecb3d50bb&p='+ (currentPage).toString()).done(function(data) {
      workingData = workingData.concat(data.data);
      // console.log(workingData)
      currentPage += 1;
      if (currentPage <= lastPage) {
        requestFunction(currentPage, lastPage, destination);
      } else {
        fermentables = workingData;
        localStorage.setItem(destination, JSON.stringify(fermentables));
        // console.log(JSON.parse(localStorage.getItem('fermentables')));
        filterData(fermentables, fermentablesFiltered, "potential", 'fermentables');
      }
    });
  };

  var filterData = function(sourceArray, filteredArray, filterCriteria, categoryName) {
    console.log("filterData called");
    // var criteria = JSON.parse(filterCriteria);
    var workingArray = [];
    for (var i = 0; i < sourceArray.length; i++) {
      var target = JSON.parse("[{sourceArray[i]." + filterCriteria + "}]")
      if (target) {
        workingArray = workingArray.concat(sourceArray[i]);
      }
    }
    filteredArray = workingArray;
    localStorage.setItem(categoryName + 'Filtered', JSON.stringify(workingArray));
    optionsAppender(filteredArray, categoryName);
  };

  var optionsAppender = function (sourceArray, categoryName) {
    console.log('optionsAppender Called');
    var target = $(document).find('#'+ categoryName + '-selector').children('optgroup');
    for(var i = 0; i < sourceArray.length; i++) {
      var name = sourceArray[i].name;
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
        requestFunction(pageNumber+1, totalPages, 'fermentables');
      }
    });
  }

  if (fermentablesFiltered) {
    optionsAppender();
  }






});
