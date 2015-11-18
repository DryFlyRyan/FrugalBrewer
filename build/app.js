// console.log('doc loading');

$(document).ready(function() {
  console.log('doc ready');

  var workingDataFermentables = [];
  var fermentables = JSON.parse(localStorage.getItem('fermentables'));
  var fermentablesFiltered = JSON.parse(localStorage.getItem('fermentablesFiltered'));
  var fermentablesOptions = [];

  var workingDataHops = [];
  var hops = JSON.parse(localStorage.getItem('hops'));
  var hopsFiltered = JSON.parse(localStorage.getItem('hopsFiltered'));
  var hopsOptions = [];

  var workingDataYeasts = [];
  var yeasts = JSON.parse(localStorage.getItem('yeasts'));
  var yeastsFiltered = JSON.parse(localStorage.getItem('yeastsFiltered'));

  var workingDataAdjuncts = [];
  var adjuncts = JSON.parse(localStorage.getItem('adjuncts'));
  var adjunctsFiltered = JSON.parse(localStorage.getItem('adjunctsFiltered'));

  var workingDataStyles = [];
  var styles = JSON.parse(localStorage.getItem('styles'));
  var stylesFiltered = JSON.parse(localStorage.getItem('stylesFiltered'));



  var requestFunction = function(startPage, stopPage, sourceArray, filteredArray, workingArray, filterCriteria, categoryName) {

    var currentPage = startPage;
    var lastPage = stopPage;
    var destination = categoryName;
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
        filterData(sourceArray, filteredArray, filterCriteria, categoryName);
      }
    }).fail(function(response) {
      console.log("Fail Log: ", response);
    });
  };

  var filterData = function(sourceArray, filteredArray, filterCriteria, categoryName) {
    console.log("filterData called");
    var workingArray = [];
    for (var i = 0; i < sourceArray.length; i++) {
      if (sourceArray[i].hasOwnProperty(filterCriteria)) {
        if (categoryName === 'styles') {
          workingArray = workingArray.concat(sourceArray[i].name);
        } else {
          workingArray = workingArray.concat(sourceArray[i]);
        }
      }
    }
    filteredArray = workingArray;
    localStorage.setItem(categoryName + 'Filtered', JSON.stringify(filteredArray));
    optionsAppender(filteredArray, categoryName);
  };

  var optionsAppender = function (sourceArray, categoryName) {
    // console.log('optionsAppender Called');
    var target = $(document).find('#'+ categoryName + '-selector').children('optgroup');

    for(var i = 0; i < sourceArray.length; i++) {

      if (categoryName !== 'yeasts') {
      var name = sourceArray[i].name;
      $(target).append('<option>' + name + '</option>');
      } else {
      var supplier = sourceArray[i].supplier;
      var productId = sourceArray[i].productId;
      var name = sourceArray[i].name;
      var format = sourceArray[i].yeastFormat;
      var type = sourceArray[i].yeastType;
      $(target).append('<option>' + name + ' - ' + supplier + ' ' + productId + ' - ' + format + ' ' + type + ' yeast' + '</option>');

      }
    }
  };

  // var autocompleteOptionsHops = function (originArray, destinationArray) {
  //   var workingArray = [];
  //   for (var i = 0; i < originArray.length; i++) {
  //     workingArray.push(originArray[i].name);
  //   }
  //   destinationArray = workingArray;
  //   console.log(destinationArray);
  // };

  if (!fermentables) {
    // console.log('loop 1');
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      // console.log('data delivered!');
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      // console.log("pageNumber = ", pageNumber);
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
    // console.log('loop 1');
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/hops/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      // console.log(data);
      // console.log('data delivered!');
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      // console.log("pageNumber = ", pageNumber);
      workingDataHops = workingDataHops.concat(data.data);
      // console.log(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, hops, hopsFiltered, workingDataHops, 'alphaAcidMin', 'hops');
      }
    });
  } else {
    optionsAppender(hopsFiltered, 'hops');
  }

  // // autocompleteOptionsHops(hopsFiltered, hopsOptions);
  //
  // $('#hops-selector').autocomplete({
  //   source: hopsOptions
  // });


  if (!yeasts) {
    // console.log('loop 1');
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/yeasts/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      // console.log(data);
      // console.log('data delivered!');
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      console.log('number of yeast pages = ', totalPages);
      // console.log("pageNumber = ", pageNumber);
      workingDataYeasts = workingDataYeasts.concat(data.data);
      // console.log(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, yeasts, yeastsFiltered, workingDataYeasts, 'productId', 'yeasts');
      }
    });
  } else {
    optionsAppender(yeastsFiltered, 'yeasts');
  }

  if (!adjuncts) {
    console.log('loop 1');
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/adjuncts/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      // console.log(data);
      // console.log('data delivered!');
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      console.log('Number of Adjunct Pages: ', totalPages);
      // console.log("pageNumber = ", pageNumber);
      workingDataAdjuncts = workingDataAdjuncts.concat(data.data);
      // console.log(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, adjuncts, adjunctsFiltered, workingDataAdjuncts, 'name', 'adjuncts');
      }
    });
  } else {
    optionsAppender(adjunctsFiltered, 'adjuncts');
  }


  //This one had to be freaking different ...

  if (!styles) {
    console.log('loop 1');
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/styles/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      workingDataAdjuncts = workingDataAdjuncts.concat(data.data);
      requestFunction(1, 1, styles, stylesFiltered, workingDataStyles, 'ibuMin', 'styles');
    });
  } else {
    optionsAppender(stylesFiltered, 'styles');
  }



  $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/styles/?key=166f0b6348fdccde864dc9aecb3d50bb&p=3', function() {
  }).done(function(data){
    console.log(data);
  });





});
