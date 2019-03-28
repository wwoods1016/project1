$(document).ready(function () {


    var arrZpid = ["13387360", "6900654", "7115494", "10875155", "10881469", "59937785", "14422213", "64812633", "46269897", "46254829", "46185302", "29376016", "19502566", "111433854", "48824588"];
    var homesInfo = [];
    var homesInfoPromise = [];
    var obj = {};
    var timer = ''
    var imgArr = [];
    // constructing a queryURL variable we will use instead of the literal string inside of the ajax method
    var zwsid = "X1-ZWz181f7ao8w7f_7oq0o";
    var cors = "https://cors-anywhere.herokuapp.com/";


    //Write to another array


    async function getInfo() {
        return new Promise(async (resolve, reject) => {
            for (i = 0; i < arrZpid.length; i++) {
                homesInfoPromise.push(getObjList(i))
                // console.log(val)
                // obj = { price: homePrice, images: imgArr, bedrooms: homeBedrooms, bathrooms: homeBathrooms };
                // var homePrice = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.price["#text"];

                // homeBedrooms = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bedrooms["#text"];

                // homeBathrooms = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bathrooms["#text"];

                // for (j = 0; j < 3; j++) {
                //     homeImage = jsonResponse["UpdatedPropertyDetails:updatedPropertyDetails"].response.images.image.url[j]["#text"];
                //     imgArr[j] = homeImage;
                // }
                // console.log(val)
                // homesInfoPromise.push(val)

            }
            console.log(homesInfoPromise)
            resolve(homesInfoPromise)
        })
    }

    async function getObjList(i) {
        return new Promise((resolve, reject) => {
            var imgArr = [];

            var queryURL = cors + "www.zillow.com/webservice/GetUpdatedPropertyDetails.htm?zws-id=" + zwsid + "&zpid=" + arrZpid[i];

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {


                var jsonResponse = xmlToJson(response);
                console.log(jsonResponse)


                let arr = []
                arr.push(jsonResponse)
                resolve(arr)
            })
                .catch(function (err) {
                    reject(err)
                });
        })
    }

    async function gotInfo() {
        try {
            homesInfoPromise = await getInfo()
            Promise.all(homesInfoPromise).then(jsonResponse => {
                jsonResponse.forEach((res, i) => {
                    if (i !== 1) {

                        const obj = {}
                        obj.homePrice = res[0]["UpdatedPropertyDetails:updatedPropertyDetails"].response.price["#text"];

                        obj.homeBedrooms = res[0]["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bedrooms["#text"];

                        obj.homeBathrooms = res[0]["UpdatedPropertyDetails:updatedPropertyDetails"].response.editedFacts.bathrooms["#text"];
                        const arr = []
                        for (var j = 0; j < 3; j++) {
                            arr.push(res[0]["UpdatedPropertyDetails:updatedPropertyDetails"].response.images.image.url[j]["#text"])
                        }
                        obj.images = arr

                        homesInfo.push(obj)
                    }
                })

                console.log(homesInfo)
                // other logic here

                $("#images").append("<img id='imagefromzillow' src='" + homesInfo[3].images[0] + "'/>")

                $("#bedandbath").append("<p>Bedrooms: " + homesInfo[3].homeBedrooms + "</p>");

                $("#bedandbath").append("<p>Baths: " + homesInfo[3].homeBathrooms + "</p>");

                loadProperty()
            })
            // loadProperty()
            // homeInfo()
            return homesInfoPromise
        } catch (err) {
            console.log(err)
            throw err
        }



        // append here


    }


    // function loadProperty() {
    //     timer = setInterval(countdown, 1000);
    //     for (var i = 0; i < homesInfo.length; i++) {


    //         $("#bedandbath").append("<p>Bedrooms: " + homesInfo[0].homeBedrooms + "</p>");

    //         $("#bedandbath").append("<p>Baths: " + homesInfo[0].homeBathrooms + "</p>");
    //         // console.log("This is Homes Info",homesInfo[0]);
    //     }


    // }

    gotInfo()



    // async function homesInfo(homesInfoPromise){
    //     return new Promise((resolve,reject)=>{
    //         Promise.all(homesInfoPromise).then(val=>{
    //             resolve(val)
    //          })
    //          .catch(err=>{
    //             reject(err)
    //          })
    //     })
    // }


    // Changes XML to JSON
    function xmlToJson(xml) {

        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;

    };

    //game code

    $(".submit-answer").on("click", function (event) {
        event.preventDefault();
        bid();
    })

    houseIndex = 0;
    clock = 45;
    wins = 0;
    losses = 0;

});


//user must place bid withing certain amt of time
function countdown() {
    clock--;
    if (clock <= 0) {
        timesUp();
    }
}

function loadProperty() {
    timer = setInterval(countdown, 1000);
    for (var i = 1; i < homesInfo.length; i++) {
        //append pics to image div(Will working on slider)
        //append bed and bath info to respective div
        $("#bedandbath").text("Bedrooms: " + homesInfo[houseIndex].bedrooms);

        $("#bedandbath").append("<p>Baths: " + homesInfo[houseIndex].bathrooms + "</p>");
    }


}
function nextProperty() {
    clock = 45;
    houseIndex++;
    loadProperty();

}
function timesUp() {
    clearInterval(timer);
    if (houseIndex == 6) {
        setTimeout(results, 3 * 1000);
    } else {
        setTimeout(nextProperty, 3 * 1000);
    }
}
//show final leaderboard
//show how many properties won by user
function results() {
    clearInterval(timer);
    $("#leaderboard").html("<h2>Final Results!</h2>");
    $("#leaderboard").append("<h3>You won a total of " + wins + " homes!</h3>");
    reset();

}
//take players bid
function bid() {
    clearInterval(timer);
    currentBid = $("#number-1553353150535").val();
    if (currentBid = homesInfo[houseIndex].price) {
        alert("goodjob")
        wonBid();
    } else {
        lostBid();
    }
}
function wonBid() {
    clearInterval(timer);
    wins++;
    $("#score").append("<h3>Congrats! You just purchased this beautiful home</h3>")
    if (houseIndex == 6) {
        setTimeout(results, 3 * 1000);
    } else {
        setTimeout(nextProperty, 3 * 1000);
    }

}
function lostBid() {
    clearInterval(timer);
    losses++;
    $("#score").append("<h3>Sorry, your bid was rejected by the seller!</h3>")
    if (houseIndex == 6) {
        setTimeout(results, 3 * 1000);
    } else {
        setTimeout(nextProperty, 3 * 1000);
    }
}
function reset() {
    houseIndex = 0;
    clock = 0;
    wins = 0;
    losses = 0;
    loadProperty();
}
