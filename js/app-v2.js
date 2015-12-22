$(document).ready(function() {

  function Recipe(name) {
    this.name=name;
    this.ingredientsArray = [];
  }

  //Ingredient & Recipe Arrays
  var recipeArray =JSON.parse(localStorage.getItem('recipeArray'));
  var styles=JSON.parse(localStorage.getItem('styles'));
  var brewtype=JSON.parse(localStorage.getItem('brewtype'));
  var ingredients=JSON.parse(localStorage.getItem('ingredients'))

  //API Calls

  var key='166f0b6348fdccde864dc9aecb3d50bb';

  function apiBuilder(key,category,filterCriteria) {
    var pageNumber;
    var totalPages;
    var workingArray = []
    if (pageNumber <= totalPages || !pageNumber) {
      apiCall(key,category,pageNumber).then(function(data) {
        pageNumber = data.currentPage + 1
        totalPages = data.numberOfPages
        return filterData(data, filterCriteria)
      }).then(function(data) {
        workingArray.push(data)
        apiBuilder(key,category,filterCriteria)
      })
    } else {
      if (category === 'styles') {
        styles.push(workingArray)
      } else {
        ingredients.push(workingArray)
      }
    }
  }

  function apiCall(key,category, pageNumber) {
    if (pageNumber) {
      return new Promise(resolve,reject){
        $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/' + category + '/?key=' + key + '&p=' + pageNumber);
      }
    } else {
      return new Promise(resolve,reject){
        $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/' + category + '/?key=' + key);
    }
  }

  function filterData(data, filterCriteria) {
    return new Promise(resolve, reject){
      var workingArray = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].hasOwnProperty(filterCriteria)) {
          workingArray.push(data[i])
        }
      }
      return workingArray
    }
  }

});
