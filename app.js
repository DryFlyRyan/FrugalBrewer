console.log('doc loading');

$(document).ready(function() {
  console.log('doc ready');

  var workingDataFermentables = [];
  var fermentables = JSON.parse(localStorage.getItem('fermentables'));
  var fermentablesFiltered = JSON.parse(localStorage.getItem('fermentablesFiltered'));

  var workingDataHops = [];
  var hops = JSON.parse(localStorage.getItem('hops'));
  var hopsFiltered = JSON.parse(localStorage.getItem('hopsFiltered'));


  var requestFunction = function(startPage, stopPage, sourceArray, filteredArray, workingArray, filterCriteria, categoryName) {

    var currentPage = startPage;
    var lastPage = stopPage;
    var destination = categoryName;
    if (typeof destination !== 'string') {
      destination = categoryName.toString();
    }
    console.log('loop ', currentPage);

    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/' + destination + '/?key=166f0b6348fdccde864dc9aecb3d50bb&p='+ (currentPage).toString()).done(function(data) {
      workingArray = workingArray.concat(data.data);
      // console.log(workingData)
      currentPage += 1;
      if (currentPage <= lastPage) {
        requestFunction(currentPage, lastPage, sourceArray, filteredArray, workingArray, filterCriteria, categoryName);
      } else {
        sourceArray = workingArray;
        localStorage.setItem(destination, JSON.stringify(sourceArray));
        // console.log(JSON.parse(localStorage.getItem('fermentables')));
        filterData(sourceArray, filteredArray, filterCriteria, categoryName);
      }
    });
  };

  var filterData = function(sourceArray, filteredArray, filterCriteria, categoryName) {
    console.log("filterData called");
    var workingArray = [];
    for (var i = 0; i < sourceArray.length; i++) {
      if (sourceArray[i].hasOwnProperty(filterCriteria)) {
        workingArray = workingArray.concat(sourceArray[i]);
      }
    }
    filteredArray = workingArray;
    localStorage.setItem(categoryName + 'Filtered', JSON.stringify(filteredArray));
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
    console.log('loop 1');
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      console.log('data delivered!');
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      console.log("pageNumber = ", pageNumber);
      workingDataFermentables = workingDataFermentables.concat(data.data);
      // console.log(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, fermentables, fermentablesFiltered, workingDataFermentables, 'potential', 'fermentables');
      }
    });
  } else {
    optionsAppender(fermentables, 'fermentables');
  }

  if (!hops) {
    console.log('loop 1');
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/hops/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      console.log(data);
      console.log('data delivered!');
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      console.log("pageNumber = ", pageNumber);
      workingDataHops = workingDataHops.concat(data.data);
      // console.log(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, hops, hopsFiltered, workingDataHops, 'alphaAcidMin', 'hops');
      }
    });
  } else {
    optionsAppender(hops, 'hops');
  }

  // $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/hops/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
  // }).done(function(data){
  //   console.log(data);
  // });







});
