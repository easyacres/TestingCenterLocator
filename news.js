 



function getArticles (event) {
    var searchNewsCity = $("#cityInputField").val();
    event.preventDefault();
    console.log("searchNewsCity")
    console.log(searchNewsCity);
    fetch("https://gnews.io/api/v3/search?q=" + searchNewsCity + "&token=635c45291e6cf17423f49b624dc5f757")
    
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });
}

$("button").on("click", getArticles);

// fetch('https://gnews.io/api/v3/topics/{topic}?&635c45291e6cf17423f49b624dc5f757')
// .then(function (response) {
//     return response.json();
// })
// .then(function (data) {
//     console.log(data);
// });

// .then(function (response) {
//     console.log(response);
    // return response.json();
// })
// .then(function (data) {
//     console.log(data);
//     for (var i=0; i<5; i++)
//         var grabTitle = data.title;
//         console.log(grabTitle);
// };
// ;

// fetch('https://gnews.io/api/v3/search?q=example&token=API-Token')
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data);
//     });