$(document).ready(function() {

  console.log('Running JQuery/JS');

  function Recipe(name) {
    this.name=name;
    this.ingredientsArray=[];
  }

  //Ingredient & Recipe Arrays
  var recipeArray= JSON.parse(localStorage.getItem('recipeArray')) || [];
  var styles= JSON.parse(localStorage.getItem('styles')) || [];
  var brewtype= JSON.parse(localStorage.getItem('brewtype')) || [];
  var ingredients= JSON.parse(localStorage.getItem('ingredients')) || [];

  //API Call Functions

  var key='166f0b6348fdccde864dc9aecb3d50bb';

// Api Calls

  var testApi = 'https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb';


function apiCall(key, page, totalPages) {
  var pageNumber = page || 1;
  var totalPages = totalPages || 1;
   $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=' + key + '&p=' + pageNumber)
   var request;
  .then(function(data) {
    console.log(data);
    totalPages = data.numberOfPages;
    if (pageNumber <= totalPages) {
      apiCall(key, pageNumber + 1, totalPages)
    }
  })
}

// function apiCallInner(key, page) {
//   var request = $.get('https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=' + key + '&p=' + page)
//   return request;
// }

apiCallInitial(key)

// apiCallInitial(key)
// .then(function(data) {
//   var lastPage = data.numberOfPages
//   var promiseList = []
//   for (var i = 2; i <= lastPage; i++) {
//     promiseList.push(apiCallInner(key, i))
//   }
//   return Promise.all(promiseList)
// }).then(function(data) {
//   console.log('second then');
//   console.log(data);
// })





// if (!ingredients.length) {
//   console.log("calling api");
//   apiCallInitial(key)
//   .then(function(data) {
//     console.log('attempted api call');
//     console.log(data);
//   })
//   .catch(function(err) {
//     console.log(err);
//   })
// }

});
