



$("#goButton").on("click", function (event) {
    event.preventDefault();
    var stateCode = $("#stateList").val();
    var zipCode = $("#zip").val();
    window.location.replace("TestingCenterLocator/results.html?zip=" + zipCode + "&state=" + stateCode);
   

});







