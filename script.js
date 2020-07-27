



$("#btn").on("click", function () {

    var stateCode = $("#stacked-state").val();
    var zipCode = $("#zip").val();
    window.location.replace("/results.html?zip=" + zipCode + "&state=" + stateCode);
   

});







