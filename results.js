var zipCode = "" //grab from url string
var stateCode = "" //grab from url string

//investigate URLSearchParams technique using LiveServer
var params = window.location.search.replace("?", "");
console.log(params);
var paramsArray = params.split("&");
console.log(paramsArray);

for (var i = 0; i< paramsArray.length; i++) {
    console.log(paramsArray[i].split("="));
}