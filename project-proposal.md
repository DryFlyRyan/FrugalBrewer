Proposal for Front End Project

Summary:

The project will be based around the idea of making it possible to gauge brewing cost per batch given a certain beer or wine recipe. The idea is to allow homebrewers to plan their batches ahead of time and purchase ingredients in bulk, ultimately choosing recipes that are varied, but will allow users to share foundational ingredients and purchase a minimal amount of additional ingredients for each batch.

Version Planning:

V.1.0.0 Goals —

Recipes:

-Form inputs allow users to manually enter recipes
-Allow users to save recipes using LocalStorage
-Validate data using an autocomplete for included products
-API that will pull recipes from established recipe sites and/or webservices set up by Galvanize
-JS/JQ based equations to calculate the basic specs of the recipe (e.g ABV, Wort Water, OG/FG, etc.)
-Rating system for recipes

Pricing and Suggestion Engine:

-Suggestion system for recipes based on ingredients needed in previous recipes (e.g. find recipes that have a similar makeup with few added ingredients, ideally based on cost)
-Pull pricing data from Amazon

Monetization:

-Integrate Amazon shopping cart for selected items
-Implement a bulk add for checkout
-Create section showing brewing tutorials as videos, which are ideally searchable
-Create section with brewing resources featuring additional products such as hard goods, books / ebooks, accessories, etc.

Technologies:

-HTML written without framework
-SASS for CSS
-Responsive Design
-JQuery for DOM Manipulation
-LocalStorage for Local Information
-Amazon API
-API’s for Recipes (either public if it suffices, or GSchool webservices)
