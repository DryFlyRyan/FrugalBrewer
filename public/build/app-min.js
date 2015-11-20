$(document).ready(function(){function e(e){this.name=e,this.fermentablesArray=[],this.hopsArray=[],this.yeastsArray=[],this.adjunctsArray=[]}var t=null,a=JSON.parse(localStorage.getItem("recipeArray")),o=[];a||(a=[{name:"test recipe",fermentablesArray:[],hopsArray:[],yeastsArray:[],adjunctsArray:[]}],localStorage.setItem("recipeArray",JSON.stringify(a)));var s=[],n=JSON.parse(localStorage.getItem("fermentables")),r=JSON.parse(localStorage.getItem("fermentablesFiltered")),i=[],c=JSON.parse(localStorage.getItem("hops")),l=JSON.parse(localStorage.getItem("hopsFiltered")),d=[],p=JSON.parse(localStorage.getItem("yeasts")),u=JSON.parse(localStorage.getItem("yeastsFiltered")),y=[],f=JSON.parse(localStorage.getItem("adjuncts")),g=JSON.parse(localStorage.getItem("adjunctsFiltered")),b=[],h=JSON.parse(localStorage.getItem("styles")),m=JSON.parse(localStorage.getItem("stylesFiltered")),v=function(e,t,a,o,s,n,r){var i=e,c=t,l=r;console.log("loop ",i),$.get("https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/"+l+"/?key=166f0b6348fdccde864dc9aecb3d50bb&p="+i.toString()).done(function(e){s=s.concat(e.data),i+=1,c>=i?v(i,c,a,o,s,n,r):(a=s,localStorage.setItem(l,JSON.stringify(a)),S(a,o,n,r))}).fail(function(e){console.log("Fail Log: ",e)})},S=function(e,t,a,o){console.log("filterData called");for(var s=[],n=0;n<e.length;n++)e[n].hasOwnProperty(a)&&(s=s.concat(e[n]));t=s,localStorage.setItem(o+"Filtered",JSON.stringify(t)),w(t,o)},w=function(e,t){console.log("Adding",t);for(var a=$(document).find("#"+t+"-selector").children(".api-destination"),o=0;o<e.length;o++){var s=e[o].id,n=e[o].name;if("yeasts"!==t)$(a).append('<option data-id="'+s+'" data-name="'+n+'" data-source="'+t+'">'+n+"</option>");else{var r=e[o].supplier,i=e[o].productId,c=e[o].yeastFormat,l=e[o].yeastType,d=n+" - "+r+" "+i+" - "+c+" "+l+" yeast";$(a).append('<option data-id="'+s+'" data-name="'+d+'" data-source="'+t+'">'+n+" - "+r+" "+i+" - "+c+" "+l+" yeast</option>")}}};n?w(r,"fermentables"):$.get("https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/fermentables/?key=166f0b6348fdccde864dc9aecb3d50bb",function(){}).done(function(e){var t=e.currentPage,a=e.numberOfPages;s=s.concat(e.data),a>t&&v(t+1,a,n,r,s,"potential","fermentables")}),c?w(l,"hops"):$.get("https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/hops/?key=166f0b6348fdccde864dc9aecb3d50bb",function(){}).done(function(e){var t=e.currentPage,a=e.numberOfPages;i=i.concat(e.data),a>t&&v(t+1,a,c,l,i,"alphaAcidMin","hops")}),p?w(u,"yeasts"):$.get("https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/yeasts/?key=166f0b6348fdccde864dc9aecb3d50bb",function(){}).done(function(e){var t=e.currentPage,a=e.numberOfPages;console.log("number of yeast pages = ",a),d=d.concat(e.data),a>t&&v(t+1,a,p,u,d,"productId","yeasts")}),f?(console.log("adjuncts else"),w(g,"adjuncts")):(console.log("Adjuncts loop 1"),$.get("https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/adjuncts/?key=166f0b6348fdccde864dc9aecb3d50bb",function(){}).done(function(e){var t=e.currentPage,a=e.numberOfPages;console.log("Number of Adjunct Pages: ",a),y=y.concat(e.data),a>t&&v(t+1,a,f,g,y,"name","adjuncts")})),h?w(m,"styles"):(console.log("loop 1"),$.get("https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/styles/?key=166f0b6348fdccde864dc9aecb3d50bb",function(){}).done(function(e){y=y.concat(e.data),v(1,1,h,m,b,"ibuMin","styles")}));var A=function(e,t,a,o,s){o&&s?$(a).append('<span class="builder-span" data-id="'+e+'">'+t+" - "+o+" "+s+"</span></br>"):$(a).append('<span class="builder-span" data-id="'+e+'">'+t+"</span></br>")};$("a").click(function(e){if(console.log(e.target),$(this).attr("id")){console.log("if statement");var o=a[t],s=$(this).closest("div").find("option:selected").attr("data-id"),n=$(this).closest("div").find("option:selected").attr("data-name");if("brewtype-submit"===$(this).attr("id"))A(s,n,"#builder-type"),o.brewtype=n;else if("styles-submit"===$(this).attr("id"))A(s,n,"#builder-style"),o.styles=n;else if("fermentables-submit"===$(this).attr("id")){var i=$(this).closest("div").find("#fermentables-qty").val(),c=$("#fermentables-units").find("option:selected").attr("data-name");if(console.log(i),console.log(c),i&&c){A(s,n,"#builder-fermentables",i,c);var d=I(r,s);o.fermentablesArray.push(d),o.fermentablesArray.quantity=i,o.fermentablesArray.units=c,localStorage.setItem("recipeArray",JSON.stringify(a)),console.log(a)}else alert("Please enter a quantity.")}else if("hops-submit"===$(this).attr("id")){var p=$(this).closest("div").find("#hops-qty").val(),y=$("#hops-units").find("option:selected").attr("data-name");if(console.log(p),console.log(y),p&&y){A(s,n,"#builder-hops",p,y);var f=I(l,s);o.hopsArray.push(f),o.hopsArray.quantity=p,o.hopsArray.units=y,localStorage.setItem("recipeArray",JSON.stringify(a)),console.log(a)}else alert("Please enter a quantity.")}else if("yeasts-submit"===$(this).attr("id")){var g=$(this).closest("div").find("#yeasts-qty").val(),b=$("#yeasts-units").find("option:selected").attr("data-name");if(console.log(g),console.log(b),g&&b){A(s,n,"#builder-yeasts",g,b);var h=I(u,s);o.yeastsArray.push(h),o.yeastsArray.quantity=g,o.yeastsArray.units=b,localStorage.setItem("recipeArray",JSON.stringify(a)),console.log(a)}else alert("Please enter a quantity.")}else if("adjuncts-submit"===$(this).attr("id")){var m=$(this).closest("div").find("#adjuncts-qty").val(),v=$("#adjuncts-units").find("option:selected").attr("data-name");if(console.log(m),console.log(v),m&&v){A(s,n,"#builder-adjuncts",m,v);var S=I(adjunctsadjunctsFiltered,s);o.adjunctsadjunctsArray.push(S),o.adjunctsArray.quantity=m,o.adjunctsArray.units=v,localStorage.setItem("recipeArray",JSON.stringify(a)),console.log(a)}else alert("Please enter a quantity.")}}});var I=function(e,t){console.log("searching!");for(var a=t,o=0;o<e.length;o++)if(e[o].id==a)return e[o]};$("#description-box").on("keyup keydown keypress",function(e){var t=$("#description-box").val();console.log(t),$("#directions-display").text(t)}),$("#notes-box").on("keyup keydown keypress",function(e){var t=$("#notes-box").val();console.log(t),$("#notes-display").text(t)}),$("#new-recipe-btn").on("click",function(){$("#recipe-search, #new-recipe-btn").fadeOut("slow",function(){$("#name-box").fadeIn("slow",function(){$("#name-box").show()})})}),$("#name-submit").on("click",function(){for(var o=$("#name-input").val(),s=!0,n=0;n<a.length;n++)o===a[n].name&&(s=!1);if($(".start-btn").on("click",function(){$("#recipe-frontpage, #new-recipe-btn, #recipe-search").show(),$("#name-box").hide(),$("#new-recipe").hide()}),s&&o.length){console.log("namebox value: ",o);var r=new e(o);t=a.length,a.push(r),$("#builder-name").append('<h4 id="name-display">'+o+"</h4>"),$("#recipe-frontpage").fadeOut("slow",function(){$("#new-recipe").fadeIn(),$("#recipe-builder").css("opacity","1")}),console.log(a),localStorage.setItem("recipeArray",JSON.stringify(a))}else s?o.length<1?alert("No name detected. Please enter some characters."):console.log("This is failing for some reason and I don't know why."):alert("That name is already taken, please choose another.")}),$("#recipe-submit").on("click",function(){var e=a[t];e.description=$("#description-box").val(),e.notes=$("#notes-box").val(),e.styles&&e.brewtype?(console.log(e.description),console.log(e.notes),localStorage.setItem("recipeArray",JSON.stringify(a)),console.log(a),$("#recipe-builder").css("opacity","0").find(".refreshable").empty(),$("#new-recipe").hide(function(){$("#recipe-frontpage").fadeIn("slow")}),$("#name-box").fadeOut(),$("#name-input").val(""),$("#recipe-frontpage, #new-recipe-btn, #recipe-search").fadeIn(),$("#recipe-list-container").css("opacity","1"),$("#recipe-list").css("opacity","1"),$("#shopping-list").css("opacity","1"),o.push(e),O()):e.styles?e.brewtype?alert("Something went wrong and I don't know what. You should feel bad."):alert("How do you plan to do this?"):alert("What style is this beer?")});var O=function(){$("#recipe-list").empty();for(var e=0;e<o.length;e++){var t=o[e].name,a=o[e].styles;$("#recipe-list").append("<span>"+t+" - "+a+"</span></br>")}}});