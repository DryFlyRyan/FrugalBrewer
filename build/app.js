// console.log('doc loading');

  $(document).ready(function() {

  // Recipe Array

  var workingRecipeIndex = null;

  var recipeArray = JSON.parse(localStorage.getItem('recipeArray'));

  if (!recipeArray) {
    recipeArray = [
      {
        name: "test recipe",
        fermentablesArray: [],
        hopsArray: [],
        yeastsArray: [],
        adjunctsArray: []
      }

    ];
    localStorage.setItem("recipeArray", JSON.stringify(recipeArray));
}

  // Recipe Object Proto

  function Recipe(name) {
    this.name = name;
    this.fermentablesArray = [];
    this.hopsArray = [];
    this.yeastsArray = [];
    this.adjunctsArray = [];
  }

  // Ingredient Arrays

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
    var target = $(document).find('#'+ categoryName + '-selector').children('.api-destination');

    for(var i = 0; i < sourceArray.length; i++) {
      var id = sourceArray[i].id;
      var name = sourceArray[i].name;

      if (categoryName !== 'yeasts') {
      $(target).append('<option data-id="'+id+'" data-name="'+name+'" data-source="'+categoryName+'">' + name + '</option>');
      } else {
      var supplier = sourceArray[i].supplier;
      var productId = sourceArray[i].productId;
      var format = sourceArray[i].yeastFormat;
      var type = sourceArray[i].yeastType;
      var fullName = name + ' - ' + supplier + ' ' + productId + ' - ' + format + ' ' + type + ' yeast';
      $(target).append('<option data-id="'+id+' data-name="'+fullName+'" data-source="'+categoryName+'">' + name + ' - ' + supplier + ' ' + productId + ' - ' + format + ' ' + type + ' yeast' + '</option>');

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
    optionsAppender(fermentablesFiltered, 'fermentables');
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



  // $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/styles/?key=166f0b6348fdccde864dc9aecb3d50bb&p=3', function() {
  // }).done(function(data){
  //   console.log(data);
  // });


  // Click Handlers for Adding Ingredients

  var ingredientAdd = function (ingredientId, ingredientName, categoryName, targetId) {

    $(targetId).append(
      '<span class="builder-span" data-id="'+ingredientId+'">'+ingredientName+'</span></br>'
    );

  };

  $('a').click(function (event) {
    console.log(event.target);
    if ($(this).attr('id')) {
      console.log('if statement');

      var targetObject = recipeArray[workingRecipeIndex];

      var ingredient = {};

      var localSelectId = $(this).closest('div').find('option:selected').attr('data-id');

      var localSelectName = $(this).closest('div').find('option:selected').attr('data-name');

      // var selection = localSelect[0].value;
      if ($(this).attr('id') === 'brewtype-submit') {
        ingredientAdd(localSelectId, localSelectName, "Type", "#builder-type");
        targetObject.brewtype = localSelectName;

      } else if ($(this).attr('id') === 'styles-submit') {
        ingredientAdd(localSelectId, localSelectName, "Style", "#builder-style");
        targetObject.styles = localSelectName;

      } else if ($(this).attr('id') === 'fermentables-submit') {
         ingredientAdd(localSelectId, localSelectName, "Fermentables", "#builder-fermentables");
         var fermentablesObject = objectFinder(fermentablesFiltered, localSelectId);
         targetObject.fermentablesArray.push(fermentablesObject);
         localStorage.setItem('recipeArray', JSON.stringify(recipeArray));
         console.log(recipeArray);

      } else if ($(this).attr('id') === 'hops-submit') {
        ingredientAdd(localSelectId, localSelectName, "Hops", "#builder-hops");

        var hopsObject = objectFinder(hopsFiltered, localSelectId);
        targetObject.hopsArray.push(hopsObject);
        localStorage.setItem('recipeArray', JSON.stringify(recipeArray));
        console.log(recipeArray);


      } else if ($(this).attr('id') === 'yeasts-submit') {
        console.log("local select name = ", localSelectName);
        console.log('local select id: ', localSelectId);
        ingredientAdd(localSelectId, localSelectName, "Yeast", "#builder-yeasts");

        var sourceObject = objectFinder(yeastsFiltered, localSelectId);
        targetObject.yeastsArray.push(sourceObject);
        localStorage.setItem('recipeArray', JSON.stringify(recipeArray));

        console.log(recipeArray);

      } else if ($(this).attr('id') === 'adjuncts-submit') {
        ingredientAdd(localSelectId, localSelectName, "Adjuncts", "#builder-adjuncts");

        var sourceObject = objectFinder(adjunctsFiltered, localSelectId);
        targetObject.adjunctsArray.push(sourceObject);
        localStorage.setItem('recipeArray', JSON.stringify(recipeArray));

        console.log(recipeArray);

      }
    }
  });

  var objectFinder = function (targetArray, id) {
    console.log('searching!');
    var searchCriteria = id;
    for (var i = 0; i < targetArray.length; i++) {
      if (targetArray[i].id == searchCriteria) {
        return targetArray[i];
      }
    }
  };

  $("#recipe-submit").on('click', function () {
    var targetRecipe = recipeArray[workingRecipeIndex];
    targetRecipe.description = $('#description-box').value;

    targetRecipe.notes = $('#description-box').value;
  });


  if (workingRecipeIndex) {
    $('#name-display').text(recipeArray[workingRecipeIndex].name);
  }
  // $('#name-box').on('keyup keydown keypress', function(event) {
  //   var input = $('#name-box').val();
  //   console.log(input);
  //   $('#name-display').text(input);
  // });

  $('#description-box').on('keyup keydown keypress', function(event) {
    var input = $('#description-box').val();
    console.log(input);
    $('#directions-display').text(input);
  });

  $('#notes-box').on('keyup keydown keypress', function(event) {
    var input = $('#notes-box').val();
    console.log(input);
    $('#notes-display').text(input);
  });


//   var heightEqualizer = function () {
//     var panels = $(document).getElementByClassName('panel');
//     var tallest = null;
//     $.each(panels, function() {
//       if ($(this).height() > $(tallest)) {
//         tallest = $(this).height();
//       } else {
//         $(this).height(tallest);
//       }
//     });
//  };


$('#name-submit').on('click', function () {
  var recipeName = $('#name-input').val();
  console.log("namebox value: ", recipeName);
  var newRecipe = new Recipe(recipeName);
  workingRecipeIndex = recipeArray.length;
  recipeArray.push(newRecipe);
  $('#recipe-frontpage').fadeOut('slow', function () {
    $('#new-recipe').fadeIn();
    $('#recipe-builder').css("opacity", "1");
  });
  console.log(recipeArray);
  localStorage.setItem('recipeArray', JSON.stringify(recipeArray));
});




$('#new-recipe-btn').on('click', function () {
  $('#recipe-search, #new-recipe-btn').fadeOut('slow', function () {
    $('#name-box').fadeIn();
  });
});


});
