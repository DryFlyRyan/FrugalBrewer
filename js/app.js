// console.log('doc loading');

  $(document).ready(function() {

  // Recipe Array

  var workingRecipeIndex = null;

  // This is the list of stored recipes on LocalStorage
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

  // This is the list of added recipes from this session
  var recipeList = [];

  // This is a recipe array used to total ingredients --- Defunct
  // var totalArray = [
  //   {
  //     fermentablesArray: [],
  //     hopsArray: [],
  //     yeastsArray: [],
  //     adjunctsArray: []
  //   }
  // ];



  // Recipe Object Prototype

  function Recipe(name) {
    this.name = name;
    this.ingredients = [];
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

  // Master Ingredients List //
    // This is the master list of the filtered ingredients //

  var ingredientsMasterList = [];



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
        // if (categoryName === 'styles') {
        //   workingArray = workingArray.concat(sourceArray[i].name);
        // } else {
          workingArray = workingArray.concat(sourceArray[i]);
        // }
      }
    }
    filteredArray = workingArray;
    localStorage.setItem(categoryName + 'Filtered', JSON.stringify(filteredArray));
    optionsAppender(filteredArray, categoryName);
  };

  var optionsAppender = function (sourceArray, categoryName) {
    console.log('Adding', categoryName);
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
      $(target).append('<option data-id="'+id+'" data-name="'+fullName+'" data-source="'+categoryName+'">' + name + ' - ' + supplier + ' ' + productId + ' - ' + format + ' ' + type + ' yeast' + '</option>');

      }
    }
  };

  // Get Requests from BreweryDB -- Runs if the data
  // doesn't exist in localstorage else it adds filtered
  // data to dropdowns in recipe builder

  // ** CANDIDATE FOR REVAMPING WITH PROMISES ** //
  // ** CANDIDATE FOR REFACTORING ** //

  if (!fermentables) {
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      workingDataFermentables = workingDataFermentables.concat(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, fermentables, fermentablesFiltered, workingDataFermentables, 'potential', 'fermentables');
      }
    });
  } else {
    optionsAppender(fermentablesFiltered, 'fermentables');
  }

  if (!hops) {
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/hops/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      workingDataHops = workingDataHops.concat(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, hops, hopsFiltered, workingDataHops, 'alphaAcidMin', 'hops');
      }
    });
  } else {
    optionsAppender(hopsFiltered, 'hops');
  }


  if (!yeasts) {
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/yeasts/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      console.log('number of yeast pages = ', totalPages);
      workingDataYeasts = workingDataYeasts.concat(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, yeasts, yeastsFiltered, workingDataYeasts, 'productId', 'yeasts');
      }
    });
  } else {
    optionsAppender(yeastsFiltered, 'yeasts');
  }

  if (!adjuncts) {
    console.log('Adjuncts loop 1');
    $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/adjuncts/?key=166f0b6348fdccde864dc9aecb3d50bb', function() {
    }).done(function(data){
      var pageNumber = data.currentPage;
      var totalPages = data.numberOfPages;
      console.log('Number of Adjunct Pages: ', totalPages);
      workingDataAdjuncts = workingDataAdjuncts.concat(data.data);
      if (pageNumber < totalPages) {
        requestFunction(pageNumber+1, totalPages, adjuncts, adjunctsFiltered, workingDataAdjuncts, 'name', 'adjuncts');
      }
    });
  } else {
    console.log("adjuncts else");
    optionsAppender(adjunctsFiltered, 'adjuncts');
  }

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

  // Redoing IDs due to Duplicates in API Data //
    // Only touches filtered arrays //

  var newId = 1;

  var idRevamp = function (targetArray, type) {
    for (var i = 0; i < targetArray.length; i++) {
      targetArray[i].id = newId;
      targetArray[i].fbType = type;
      newId += 1;
      ingredientsMasterList.push(targetArray[i]);
    }
  };

  idRevamp(fermentablesFiltered, "fermentable");
  idRevamp(hopsFiltered, "hops");
  idRevamp(yeastsFiltered, "yeasts");
  idRevamp(adjunctsFiltered, "adjuncts");
  idRevamp(stylesFiltered, "style");

  console.log(ingredientsMasterList);

  var idTest = function(targetArray) {
    for (var i = 1; i < targetArray.length; i++) {
      if (targetArray[i].id - targetArray[i-1].id !== 1) {
        console.log("Target ID = ", targetArray[i].id, "Prev ID = ", targetArray[i-1].id);
      } else {
        console.log("IDs are consecutive");
      }
    }
  };

  //
  // RECIPE BUTTON WORKFLOW
  //

  $('#new-recipe-btn').on('click', function () {
    $('#recipe-search, #new-recipe-btn').fadeOut('slow', function () {
      $('#name-box').fadeIn('slow', function() {
        $('#name-box').show();
      });
    });
  });

  //
  // NEW RECIPE ADDITION WORKFLOW
  //

  // Working Arrays and Objects for Recipe WORKFLOW

  var workingRecipe = new Recipe();

  // Sutmit Name for New Recipe

  $('#name-submit').on('click', function () {
    var recipeName = $('#name-input').val();
    var unique = true;

    for (var i = 0; i < recipeArray.length; i++) {
      if (recipeName === recipeArray[i].name) {
        unique = false;
      }
    }

    $('.start-btn').on('click', function() {
      $('#recipe-frontpage, #new-recipe-btn, #recipe-search').show();
      $('#name-box').hide();
      $('#new-recipe').hide();
    });

    if (unique && recipeName.length) {
      console.log("namebox value: ", recipeName);
      workingRecipe = new Recipe(recipeName);

      // ** Changing to Array Reading Formula ** //

      // $('#builder-name').append('<h4 id="name-display">'+ recipeName + '</h4>');
      // $('#recipe-frontpage').fadeOut('slow', function () {
      //   $('#new-recipe').fadeIn();
      //   $('#recipe-builder').css("opacity", "1");
      // });  
    } else if (!unique){
      alert("That name is already taken, please choose another.");
    } else if (recipeName.length < 1) {
      alert("No name detected. Please enter some characters.");
    } else {
      console.log("This is failing for some reason and I don't know why.");
    }
  });

  // Click Handlers for Adding Ingredients



  // var ingredientAdd = function (ingredientId, ingredientName, targetId, ingredientQty, ingredientUnits) {
  //   if (ingredientQty && ingredientUnits) {
  //     $(targetId).append(
  //       '<span class="builder-span" data-id="'+ingredientId+'">'+ingredientName+' - ' + ingredientQty + ' ' + ingredientUnits + '</span></br>'
  //     );
  //   } else {
  //     $(targetId).append(
  //       '<span class="builder-span" data-id="'+ingredientId+'">'+ingredientName+'</span></br>'
  //     );
  //   }
  // };

  $('a').click(function (event) {
    console.log(event.target);
    if ($(this).attr('id')) {
      console.log('if statement');

      var targetObject = workingRecipe;
      var workingQuantity = null;
      var workingUnits = null;

      var destinationObject = targetObject.ingredientsArray[targetObject.ingredientsArray.length - 1];

      var localSelectId = $(this).closest('div').find('option:selected').attr('data-id');

      var localSelectName = $(this).closest('div').find('option:selected').attr('data-name');

      var result = $.grep(ingredientsMasterList, function(e){ return e.id == localSelectId; });

      if (result.length === 1) {
        result = result[0];
      } else if (result.length === 0 ){
        console.log("result not found in ingredientsMasterList");
      } else {
        console.log("multiple results found");
      }

      if ($(this).attr('id') === 'brewtype-submit') {
        targetObject.brewtype = result;

      } else if ($(this).attr('id') === 'styles-submit') {
        targetObject.styles = result;

      } else if ($(this).attr('id') === 'fermentables-submit') {

        workingQuantity = $(this).closest('div').find('#fermentables-qty').val();

        workingUnits = $('#fermentables-units').find('option:selected').attr('data-name');

        if (workingQuantity) {
          targetObject.ingredientsArray.push(result);
          destinationObject.quantity = workingQuantity;
          destinationObject.units = workingUnits;
       } else {
         alert("Please enter a quantity.");
       }

      } else if ($(this).attr('id') === 'hops-submit') {

        workingQuantity = $(this).closest('div').find('#hops-qty').val();

        workingUnits = $('#hops-units').find('option:selected').attr('data-name');

        if (workingQuantity) {
          targetObject.ingredientsArray.push(result);
          destinationObject.quantity = workingQuantity;
          destinationObject.units = workingUnits;
       } else {
         alert("Please enter a quantity.");
       }

      } else if ($(this).attr('id') === 'yeasts-submit') {

        workingQuantity = $(this).closest('div').find('#yeasts-qty').val();

        workingUnits = $('#yeasts-units').find('option:selected').attr('data-name');

        if (workingQuantity) {
          targetObject.ingredientsArray.push(result);
          destinationObject.quantity = workingQuantity;
          destinationObject.units = workingUnits;
       } else {
         alert("Please enter a quantity.");
       }

      } else if ($(this).attr('id') === 'adjuncts-submit') {

        workingQuantity = $(this).closest('div').find('#adjuncts-qty').val();

        workingUnits = $('#adjuncts-units').find('option:selected').attr('data-name');

        if (workingQuantity) {
          targetObject.ingredientsArray.push(result);
          destinationObject.quantity = workingQuantity;
          destinationObject.units = workingUnits;
       } else {
         alert("Please enter a quantity.");
       }

      }
    }
    console.log(workingRecipe);
  });

  // Description & Notes Handlers

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



  // Submit Recipe

  $("#recipe-submit").on('click', function () {
    var targetRecipe = recipeArray[workingRecipeIndex];
    targetRecipe.description = $('#description-box').val();
    targetRecipe.notes = $('#notes-box').val();

    if (targetRecipe.styles && targetRecipe.brewtype) {
      console.log(targetRecipe.description);
      console.log(targetRecipe.notes);
      localStorage.setItem('recipeArray', JSON.stringify(recipeArray));
      console.log(recipeArray);
      $('#recipe-builder').css("opacity", "0").find('.refreshable').empty();
      $('#new-recipe').hide(function () {
        $('#recipe-frontpage').fadeIn('slow');
      });
      $('#name-box').fadeOut();
      $('#name-input').val('');
      $('#recipe-frontpage, #new-recipe-btn, #recipe-search').fadeIn();
      $('#recipe-list-container').css("opacity", "1");
      $('#recipe-list').css("opacity", "1");
      $('#shopping-list').css("opacity", "1");
      recipeList.push(targetRecipe);
      appendRecipe();
      ingredientLister();
    } else if (!targetRecipe.styles) {
      alert("What style is this beer?");
    } else if (!targetRecipe.brewtype) {
      alert("How do you plan to do this?");
    } else {
      alert("Something went wrong and I don't know what. You should feel bad.");
    }
  });

  var appendRecipe = function () {
    $('#recipe-list').empty();
    for (var i = 0; i < recipeList.length; i++) {
      var recipeName = recipeList[i].name;
      var recipeStyle = recipeList[i].styles;

      $('#recipe-list').append(
        '<span>' + recipeName + ' - ' + recipeStyle + '</span></br>'
      );
    }
  };

  // var ingredientPoster = function (targetObject) {
  //   for (var f = 0; f < targetObject.fermentablesArray; f++) {
  //     var targetFermentable = targetObject.fermentablesArray[f];
  //     if (totalArray.fermentablesArray.indexOf(targetFermentable))
  //   }
  // }

  var ingredientLister = function () {
    console.log('listing ingredients');
    for (var i = 0; i < recipeList.length; i++)
      var targetRecipe = recipeList[i];

      //fermentables
      for (var f = 0; f < targetRecipe.fermentablesArray.length; f++) {
      console.log('writing fermentables');

      // $('#sl-fermentables').empty();

      var targetId = targetRecipe.fermentablesArray[f].id;

      var targetQty = targetRecipe.fermentablesArray[f].quantity;

      var targetName = targetRecipe.fermentablesArray[f].name;

      var targetUnits = targetRecipe.fermentablesArray[f].units;

      var onPageId = targetId+targetName;
      var onPageQty = targetQty+targetName;

      console.log(targetQty);

      console.log(targetId);
      console.log(targetName);
      console.log(targetUnits);
      console.log(onPageId);

      console.log(onPageQty);

        // if ($('#'+onPageId).length) {
        //   console.log('id matched');
        //   var originalAmt = $('#'+onPageId+'q').data('qty');
        //   var updatedAmt = originalAmt + targetQty;
        //   $('#'+onPageQty+'q').data('qty', updatedAmt);
        // } else {
          // console.log('id not found');
          $('#sl-fermentables').append(
            '<span id="'+onPageId+'"data-id="'+ targetId + '">'+ targetName +' - </span>' +
            '<span id="'+onPageId+'q"data-qty="' + targetQty + '">' + targetQty+ ' ' + targetUnits + '</span></br>'

          );
        // }
      }

      for (var h = 0; h < targetRecipe.hopsArray.length; h++) {
      console.log('writing hops');

      // $('#sl-fermentables').empty();

      var targetId = targetRecipe.hopsArray[h].id;

      var targetQty = targetRecipe.hopsArray[h].quantity;

      var targetName = targetRecipe.hopsArray[h].name;

      var targetUnits = targetRecipe.hopsArray[h].units;

      var onPageId = targetId+targetName;
      var onPageQty = targetQty+targetName;

      console.log(targetQty);

      console.log(targetId);
      console.log(targetName);
      console.log(targetUnits);
      console.log(onPageId);

      console.log(onPageQty);

        // if ($('#'+onPageId).length) {
        //   console.log('id matched');
        //   var originalAmt = $('#'+onPageId+'q').data('qty');
        //   var updatedAmt = originalAmt + targetQty;
        //   $('#'+onPageQty+'q').data('qty', updatedAmt);
        // } else {
          // console.log('id not found');
          $('#sl-hops').append(
            '<span id="'+onPageId+'"data-id="'+ targetId + '">'+ targetName +' - </span>' +
            '<span id="'+onPageId+'q"data-qty="' + targetQty + '">' + targetQty+ ' ' + targetUnits + '</span></br>'

          );
        // }
      }

      for (var g = 0; g < targetRecipe.yeastsArray.length; g++) {
      console.log('writing yeasts');

      // $('#sl-fermentables').empty();

      var targetId = targetRecipe.yeastsArray[g].id;

      var targetQty = targetRecipe.yeastsArray[g].quantity;

      var targetName = targetRecipe.yeastsArray[g].name;

      var targetUnits = targetRecipe.yeastsArray[g].units;

      var onPageId = targetId+targetName;
      var onPageQty = targetQty+targetName;

      console.log(targetQty);

      console.log(targetId);
      console.log(targetName);
      console.log(targetUnits);
      console.log(onPageId);

      console.log(onPageQty);

        // if ($('#'+onPageId).length) {
        //   console.log('id matched');
        //   var originalAmt = $('#'+onPageId+'q').data('qty');
        //   var updatedAmt = originalAmt + targetQty;
        //   $('#'+onPageQty+'q').data('qty', updatedAmt);
        // } else {
          // console.log('id not found');
          $('#sl-yeasts').append(
            '<span id="'+onPageId+'"data-id="'+ targetId + '">'+ targetName +' - </span>' +
            '<span id="'+onPageId+'q"data-qty="' + targetQty + '">' + targetQty+ ' ' + targetUnits + '</span></br>'

          );
        // }
      }

      for (var a = 0; a < targetRecipe.adjunctsArray.length; a++) {
      console.log('writing adjuncts');

      // $('#sl-adjuncts').empty();

      var targetId = targetRecipe.ajunctsArray[f].id;

      var targetQty = targetRecipe.adjunctsArray[f].quantity;

      var targetName = targetRecipe.adjunctsArray[f].name;

      var targetUnits = targetRecipe.adjunctsArray[f].units;

      var onPageId = targetId+targetName;
      var onPageQty = targetQty+targetName;

      console.log(targetQty);

      console.log(targetId);
      console.log(targetName);
      console.log(targetUnits);
      console.log(onPageId);

      console.log(onPageQty);

        // if ($('#'+onPageId).length) {
        //   console.log('id matched');
        //   var originalAmt = $('#'+onPageId+'q').data('qty');
        //   var updatedAmt = originalAmt + targetQty;
        //   $('#'+onPageQty+'q').data('qty', updatedAmt);
        // } else {
          // console.log('id not found');
          $('#sl-adjuncts').append(
            '<span id="'+onPageId+'"data-id="'+ targetId + '">'+ targetName +' - </span>' +
            '<span id="'+onPageId+'q"data-qty="' + targetQty + '">' + targetQty+ ' ' + targetUnits + '</span></br>'

          );
        // }
      }



  };

});
