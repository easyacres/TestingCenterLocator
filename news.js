 

function getArticles (event) {
    var searchNewsCity = $("#cityInputField").val();
    var assignedNewsArtCount = 5;
    event.preventDefault();
    console.log("searchNewsCity")
    console.log(searchNewsCity);
    fetch("https://gnews.io/api/v3/search?q=" + searchNewsCity + "&max=" + assignedNewsArtCount + "&token=635c45291e6cf17423f49b624dc5f757")
    
    .then(function (response) {
        return response.json();

    })
    .then(function (data) {
        console.log(data);
        for ( var i =0; i<data.articles.length; i++) {
            var newsArticles = $("#newsArticles")
            var grabNewsTitle = data.articles[i].title;
            var grabNewsUrl = data.articles[i].url;
            var newNewsDiv = $("<div>").appendTo(newsArticles);
            $("<h3>").text(grabNewsTitle).appendTo(newNewsDiv);
            $("<p>").text(grabNewsUrl).appendTo(newNewsDiv);
        }
        // 
    });
}

// function getArticles (event) {
//     var searchNewsCity = $("#cityInputField").val();
//     event.preventDefault();
//     console.log("searchNewsCity")
//     console.log(searchNewsCity);
//     fetch("https://gnews.io/api/v3/search?q=" + searchNewsCity + "&token=635c45291e6cf17423f49b624dc5f757")
    
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data);
//     });
// }

// $("button").on("click", getArticles);

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