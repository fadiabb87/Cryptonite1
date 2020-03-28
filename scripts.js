//global
let coinsArry = [];
let checkedCoins = [];
let checkedCoinsSymboles =[];
let coinsAlertStr ="";
let coinToChange ="";
let newCoinForChangeID ="";
let oldCoinForChangeID ="";
let oldCoinSybol ="";
 
//get data from localStorage
if (localStorage.checkedCoins ) {
  checkedCoins = JSON.parse(localStorage.checkedCoins);
}
if (localStorage.checkedCoinsSymboles ) {
    checkedCoinsSymboles = JSON.parse(localStorage.checkedCoinsSymboles);
}
 
 //get coins data from API
 function loadAllCoins(url)
  {

    $.ajax({
        type : "get",
        url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&",
        dataType: "json",

        success: function(responseData){  
         if (responseData.Response == "False") {
          alert(responseData.Error);
          return;
      }
      // console.log(responseData);
      coinsArry = responseData;
      console.log(coinsArry);
      console.log(checkedCoinsSymboles);
      let output ="";
      
      $.each(coinsArry, (index, coin)=>{

        let coinSymbol = coin.symbol;
      
        output += 
      `<div class="card border-primary mb-3 coinCard" style="max-width: 20rem;">
      <div class="card-header">   <h5>Coin: ${coinSymbol}</h5></div>
      <div class="card-body">
      <h4 class="card-title">
      <span class="form-group">
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="customSwitch${index}" name="${coinSymbol}" onchange="favButtonClicked(this)">
      <label class="custom-control-label" for="customSwitch${index}" ><h5>Add coin to Fav</h5></label>
      </div>
      </span>
      <br><br>
      <button type="button" class="btn btn-outline-primary"  id="button${index}" onclick="buttonClicked(${index})"><span id="clickText${index}">more info</span></button>
      <br><br>
      <div class="spinner-border" style="width: 5rem; height: 5rem; display: none;" role="status" id="progSpin${index}"></div>
      </h4>
      <p class="card-text" style="display:none;" id="coinText${index}"></p>
      </div>
      </div> 
    `;
      });

      $('#coinsCards').html(output);
      for (let i of checkedCoins) 
      {
        $("#" + i).prop("checked", true);
        
      }
      },
      
      error: function (xhr, ajaxOptions, thrownError) 
      {
          //alert(xhr.status);
          alert(thrownError);
      }
      }); 
    }



//get one coin info while toggle button is pressed
function buttonClicked(i){
  let V = $(`#clickText${i}`).text();
    $(`#progSpin${i}`).toggle();
    if (V == "more info") {
        $(`#clickText${i}`).empty();
        $(`#coinText${i}`).slideToggle("slow", () => {
            $(`#progSpin${i}`).toggle(300, function () {
            $(`#clickText${i}`).append("less info");
            });
        });
        getCoinInfo(i);
    } else {
        $(`#clickText${i}`).empty();
        $(`#coinText${i}`).slideToggle("slow", () => {
            $(`#progSpin${i}`).toggle(300, function () {
                $(`#clickText${i}`).append("more info");
                $(`#InfoSpin${i}`).toggle();
                $(`#coinText${i}`).empty();
            });
        });
      
}

//get coin info from Array to toggle button
function getCoinInfo(i)
{
  let savedCoin = localStorage.getItem(`output${i}`);
  if(savedCoin != null)
  {
    let savedTime = localStorage.getItem(`timeOfrequest${i}`);
    let date = new Date();
    let newTime = date.getTime();
// console.log(savedTime);
// console.log(newTime);
//check time passed do deside using local storage info or new info from API
    if(newTime - savedTime < 200000)
    {
      let output =   localStorage.getItem(`output${i}`);
       $(`#coinText${i}`).html(output);
      }
      else{
        getNewInfo(i);
      }
    }
      else{
        getNewInfo(i);
      }

    }

//get new info from API for one Coin
function getNewInfo (i)
{ 
  let coinId = coinsArry[i].id; 
  let coinUrl =  `https://api.coingecko.com/api/v3/coins/${coinId}`;

  $.ajax({
  
    type : "get",
    url: coinUrl,
    dataType: "json",
    
    success: function(responseData){
      let theCoin = responseData;
      
     if (responseData.Response == "False") {
      alert(responseData.Error);
      return;
  }
  
  else{

  let img = theCoin.image.large;
  let USD = theCoin.market_data.current_price.usd;
  let EUR = theCoin.market_data.current_price.eur;
  let ILS = theCoin.market_data.current_price.ils;

  let output ='';

    output += ` 
    <div>
    <img src="${img}"></img>
    <div>
     USD: <span> ${USD} $</span> 
    <br>
    EUR: <span> ${EUR}  €</span> 
    <br>
    ILS: <span> ${ILS} ₪</span> 
    </div>

    `;
  
    $(`#coinText${i}`).html(output);
    localStorage.setItem(`output${i}`, output);
    let date = new Date();
    let timeOfrequest = date.getTime();
    localStorage.setItem(`timeOfrequest${i}`, timeOfrequest);
  }
    }

  });
}
}

//save coin into favs
function favButtonClicked(index){
  let id = $(index).attr('id');
  if (index.checked == true)
  {
    if (checkedCoins.length == 5)
    {   
    newCoinSybol = index.name;
      index.checked = false;
      coinsChange(id);
    }
    else
    {
     addCoinToArry(id);
     checkedCoinsSymboles.push(index.name);
     localStorage.checkedCoinsSymboles = JSON.stringify(checkedCoinsSymboles);
    }
  }
  else
  {
    removeCoin(id);
   for(i=0; i<checkedCoinsSymboles.length; i++ )
   {
     if( index.name == checkedCoinsSymboles[i])
     {
    checkedCoinsSymboles.splice(i, 1);
    localStorage.checkedCoinsSymboles = JSON.stringify(checkedCoinsSymboles);

   }
  }

  }

}

//adding coin to local storange and array
function addCoinToArry(coinId)
{
  if (checkedCoins.length < 5 && checkedCoins.includes(coinId) == false)
  {
    $("#" + coinId).prop("checked", true);
    checkedCoins.push(coinId);
    localStorage.checkedCoins = JSON.stringify(checkedCoins);
  }
}

//removing coin from local storage and array
function removeCoin(coinId)
{
  $("#" + coinId).prop("checked", false);
  let coinIndx = checkedCoins.indexOf(coinId);
  checkedCoins.splice(coinIndx,1);
  localStorage.checkedCoins = JSON.stringify(checkedCoins);
}



//loading modal in case of more that 5 favs
function coinsChange(id)
{
  newCoinForChangeID = id;
  coinToChange = id;
let output = "";
for(i=0; i<checkedCoinsSymboles.length; i++)
{
if (oldCoinSybol == checkedCoinsSymboles[i])
  {
    checkedCoinsSymboles.splice(i, 1);
    localStorage.checkedCoinsSymboles = JSON.stringify(checkedCoinsSymboles);

    checkedCoinsSymboles.push(newCoinSybol);
    localStorage.checkedCoinsSymboles = JSON.stringify(checkedCoinsSymboles);
  }
}

for(i=0; i<checkedCoins.length; i++ )
{
  if (checkedCoins[i] == oldCoinForChangeID)
  {
    checkedCoins.splice(i,1);
    checkedCoins.push(newCoinForChangeID);
    localStorage.checkedCoins = JSON.stringify(checkedCoins);

  }

}

for (let i in checkedCoinsSymboles) {

let index = coinsArry.findIndex(obj => obj.symbol == checkedCoinsSymboles[i]);
        let id = checkedCoins[i];
        let img = coinsArry[index].image;
        let name = coinsArry[index].name;
        let symbol = coinsArry[index].symbol;

        output+= 
        `
        <div class="row"> 
        <div class="col-sm-4">
        <img src="${img}" width="50%"></img>
        </div>
        <div class="col-sm-6">
        <h6>${name}</h6>
        </div>
        <div class="col-sm-2">
        <div class="custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" id="${symbol}" name="${id}" onchange="getChanedInfo(this)" checked="">
        <label class="custom-control-label" for="${symbol}"></label>
      </div>
        </div>
        </div>
        <br>

        `
}


$("#modal-body").html(output);
$("#coinsAlert").modal('show');
}

//get and save new info after changing favs
function getChanedInfo(changeCoin)
{
  oldCoinForChangeID = changeCoin.name;
  oldCoinSybol = changeCoin.id;
  // console.log(oldCoinSybol);
}
//save changes
function saveCoinsChanges(coinID)
{
$("#coinsAlert").modal('hide');
$("#" +oldCoinForChangeID).prop("checked", false);
$("#" +newCoinForChangeID).prop("checked", true);

for(i=0; i<checkedCoinsSymboles.length; i++)
{
if (oldCoinSybol == checkedCoinsSymboles[i])
  {
    checkedCoinsSymboles.splice(i, 1);
    localStorage.checkedCoinsSymboles = JSON.stringify(checkedCoinsSymboles);

    checkedCoinsSymboles.push(newCoinSybol);
    localStorage.checkedCoinsSymboles = JSON.stringify(checkedCoinsSymboles);
  }
}

for(i=0; i<checkedCoins.length; i++ )
{
  if (checkedCoins[i] == oldCoinForChangeID)
  {
    checkedCoins.splice(i,1);
    checkedCoins.push(newCoinForChangeID);
    localStorage.checkedCoins = JSON.stringify(checkedCoins);
  
  }

}

}

//clear all favs
function clearAll()
{
  
  for (i=0; i<=checkedCoins.length; i++ )
  {

    $("#" + checkedCoins[i]).prop("checked", false);

  }
  checkedCoins = [];
  checkedCoinsSymboles =[];
  localStorage.removeItem("checkedCoins");
  localStorage.removeItem("checkedCoinsSymboles");
}

//search coin function 
function searchBtnClicked()
{
  let userSearchVal = $("#searchTXT").val();
  getSearchedCoins(userSearchVal);
 
}

//draw searched coins
function getSearchedCoins(userSearchVal)
{
let coin = userSearchVal;
let searchCheck =0;
let output ="";

 for(i=0; i<coinsArry.length; i++)
 {
   if(coin == coinsArry[i].id)
   {
    searchCheck = 1;
    
    let coinSymbol = coinsArry[i].symbol;
    output += 
    `<div class="card border-primary mb-3 coinCard" style="max-width: 20rem;">
    <div class="card-header">   <h5>Coin: ${coinSymbol}</h5></div>
    <div class="card-body">
    <h4 class="card-title">
    <span class="form-group">
    <div class="custom-control custom-switch">
    <input type="checkbox" class="custom-control-input" id="customSwitch${i}" name="${coinSymbol}" onchange="favButtonClicked(this)">
    <label class="custom-control-label" for="customSwitch${i}" ><h5>Add coin to Fav</h5></label>
    </div>
    </span>
    <br><br>
    <button type="button" class="btn btn-outline-primary"  id="button${i}" onclick="buttonClicked(${i})"><span id="clickText${i}">more info</span></button>
    <br><br>
    <div class="spinner-border" style="width: 5rem; height: 5rem; display: none;" role="status" id="progSpin${i}"></div>
    </h4>
    <p class="card-text" style="display:none;" id="coinText${i}"></p>
    </div>
    </div> 
  `;

   }
  }

   if(searchCheck!=1)
   {
     alert("No Match");
   }
   else
   {
    $(`#coinsCards`).html(output);
    
   }

} 


//live reports - saving the information 
function getCoinsForLiveReports()
{
  if (checkedCoinsSymboles.length<1 )
  {
    alert ("No Fav coins chosen!!");

  }
  else
  {
    drawCharts();
}
}
//drawing live reports 
function drawCharts() {

  let options = {
      backgroundColor: "white",
      interactivityEnabled: true,
      animationEnabled: true,
      axisX: {
          valueFormatString: "HH:mm:ss",
          titleFontFamily: "Tahoma, Geneva, sans-serif"
      },
      toolTip: {
          shared: true
      },
      legend: {
          cursor: "pointer",
          verticalAlign: "bottom",
          fontFamily: "Tahoma, Geneva, sans-serif",
          itemclick: showFavs
      },
      data: []
  };

  let reports = "";
  setTimeout(function () {
    reports = new CanvasJS.Chart("coinsCards", options);
    reports.render();
  }, 2000)
  function showFavs(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
      } else {
          e.dataSeries.visible = true;
      }
      e.reports.render();
  }

  var reportsIntervalID;
  let coins = checkedCoinsSymboles;

  setupReports();
  function setupReports() {
      // console.log(coins)
      options.title = {
          text: "Fav Coins Price In USD - Live reports",
          fontFamily: "Tahoma, Geneva, sans-serif",
         
      };

      $.each(coins, function (index, coin) {
          const num = index + 1;

          if (num == 1) {
              options[`axisY`] = {
                  title: "Coins Price",
                  titleFontFamily: "Tahoma, Geneva, sans-serif",
                  labelFontFamily: "Tahoma, Geneva, sans-serif",
                  valueFormatString: "#,###.###$",
                  includeZero: false
              }
          } else {
              options[`axisY${num}`] = {
                  titleFontFamily: "Tahoma, Geneva, sans-serif",
                  labelFontFamily: "Tahoma, Geneva, sans-serif",
                  valueFormatString: "#,###.###$",
                  includeZero: false
              }
          }

          options.data.push({
              type: "spline",
              name: coin.toUpperCase(),
              titleFontFamily: "Tahoma, Geneva, sans-serif",
              labelFontFamily: "Tahoma, Geneva, sans-serif",
              xValueFormatString: "HH:mm:ss",
              yValueFormatString: "#,###.###$",
              showInLegend: true,
              dataPoints: []
          });
      })

      reportsIntervalID = setInterval(updateReport, 2000);
  }

  function updateReport() {
   
      const currentPrices = getReports(coins);

      $.each(options.data, function (index, currentCoinData) {
          const coinName = coins[index].toUpperCase();

          let y = currentPrices[coinName]["USD"];
          let x = new Date();
          currentCoinData.dataPoints.push({
              x: x,
              y: y
          })
      })

      // console.log(options);

      reports.render();
  }

  function getReports(coins) {
     
      const compareBaseURL = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=;;;Coin;;;&tsyms=USD`;
     
      const endpoint = compareBaseURL.replace(";;;Coin;;;", coins.join(",").toUpperCase());

      // console.log(endpoint);

      let currentCoinPrice;

      $.ajax({
          type: 'GET',
          datatype: 'json',
          url: endpoint,
          async: false,
          success: (data) => {
           
              currentCoinPrice = data;
          },
          error: (error) => {
              printError(`Request Error - ${error.status}`);
           
          }
      });

      return currentCoinPrice;
  }
}

//about page 
function aboutPage()
{
let output=`
<div id="aboutpage" class="row">
<span>
<h6>
Welcome to my  project in fullstack course!
<br>
My name is Fadi Abboud, from Haifa Israel.
<br>
Email: fadiabb87@gmail.com
<br>
Phone: 0504418777
</h6>
<br>
<img src="fadi.jpg" style="max-width:400px;"></img>
</span>
</div>
`
$(`#coinsCards`).html(output);

}

//show favs only
function showFavsOnly()
{
let output="a";
for (let i in checkedCoinsSymboles) {

  let index = coinsArry.findIndex(obj => obj.symbol == checkedCoinsSymboles[i]);
    
  let symbol = coinsArry[index].symbol;
     output += 
     `<div class="card border-primary mb-3 coinCard" style="max-width: 20rem;">
      <div class="card-header">   <h5>Coin: ${symbol}</h5></div>
      <div class="card-body">
      <h4 class="card-title">
      <span class="form-group">
      <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="customSwitch${index}" name="${symbol}" onchange="favButtonClicked(this)" checked="">
      <label class="custom-control-label" for="customSwitch${index}" ><h5>Add coin to Fav</h5></label>
      </div>
      </span>
      <br><br>
      <button type="button" class="btn btn-outline-primary"  id="button${index}" onclick="buttonClicked(${index})"><span id="clickText${index}">more info</span></button>
       <br><br>
       <div class="spinner-border" style="width: 5rem; height: 5rem; display: none;" role="status" id="progSpin${index}"></div>
       </h4>
       <p class="card-text" style="display:none;" id="coinText${index}"></p>
       </div>
       </div> 
      `;
}
console.log(output);
  if (output!="a")
  {
    $("#coinsCards").html(output);
  }
  else
  {
    alert("No Fav Coins checked")
  }

}
