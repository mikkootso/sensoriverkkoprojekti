'use strict'

document.getElementById('kalenterit').addEventListener('submit', kalenterit);
getSelectValueFirstTime();
setInterval(getSelectValueFirstTime, 120000); // refresh data every x ms

function piirra(selectedValue, alku, loppu){
    $.ajax({
      url : "./kantas.php",
      type : "GET",
      dataType: "json",
      data: {msg: selectedValue, alku: alku, loppu: loppu},
      success : function(data){
        console.log(data);
        
        var tstamp = [];
        var temp1 = [];
        var hum1 = [];
        var ldr = [];
        var co2 = [];
        var temp2 = [];

        for(var i in data[0]) {
          tstamp.push(data[0][i].timeStamp);
          temp1.push(data[0][i].temp1);
          hum1.push(data[0][i].hum1);
          ldr.push(data[0][i].ldr);
          co2.push(data[0][i].co2);
          temp2.push(data[0][i].temp2);
        }
        if (window.localStorage.getItem("rajat") === null) {
          $.ajax({
            url : "./json/rajat.json",
            type : "GET",
            success : function(rajat){
              console.log("rajat1");
              console.log(rajat);
              drawCards(rajat)
              drawCharts()
            }, // end of success
            error : function(rajat) {
            }
          });
        } else {
            //ladataan rajat localStoragesta
            rajat = window.JSON.parse(localStorage.getItem("rajat"));
            console.log("rajat2");
            console.log(rajat);
            drawCards(rajat)
            drawCharts()
          } 

        function drawCards(rajat){
          const cards = [
            {id: 1, title: "Ravinneliuoksen lämpötila", min: parseInt(rajat["temp2"].min), max: parseInt(rajat["temp2"].max), lastValues: {val: data[1][data[1].length-1].temp, stamp: data[1][data[1].length-1].timeStamp, unit: "&#176C"}}
          ];
          
          // remove old cards
          var cds = document.getElementById("cards");
          for(var i = cds.childNodes.length - 1; i >= 0; --i) {
            cds.removeChild(cds.childNodes[i]);
          }

          // create cards
          var newRowDiv = document.createElement("div");
          newRowDiv.className = "card-columns";
          cards.forEach(function(element) {
            var newDiv = document.createElement("div");
            newDiv.className = "col-sm-10";
            newRowDiv.appendChild(newDiv);
            var newDiv2 = document.createElement("div");
            newDiv2.className = (element.lastValues.val < element.min || element.lastValues.val > element.max) ? "card shadow-nohover border-danger text-center" : "card shadow-nohover border-success text-center"; //
            newDiv.appendChild(newDiv2);
            var newDiv3 = document.createElement("div");
            newDiv3.className = (element.lastValues.val < element.min || element.lastValues.val > element.max) ? "card-body text-danger" : "card-body text-success"; //
            newDiv2.appendChild(newDiv3);
            var h5 = document.createElement("h5");
            h5.innerHTML = element.title;     //
            h5.className = "card-title"
            newDiv3.appendChild(h5);

            var p = document.createElement("p");
            p.innerHTML = element.lastValues.val + " " + element.lastValues.unit;   //
            p.className = "card-text";
            newDiv3.appendChild(p);
            if(element.lastValues.val < element.min || element.lastValues.val > element.max){
              var newValueRow = document.createElement("div");
              newValueRow.className = "row";
              newValueRow.id = "varoitusRivi";
              newDiv3.appendChild(newValueRow);
            
              var img = document.createElement('img');
              img.src = 'img/Simple_Alert.png';
              img.alt = "Varoitus";
              img.className = "img-fluid";
              img.style.width = "30px";
              img.style.height = "30px";
              newValueRow.appendChild(img);
              
              var p1 = document.createElement("p");
              p1.innerHTML = (element.lastValues.val < element.min ) ?  "Arvo on matala" : element.lastValues.val > element.max ?  "Arvo on korkea":"ok"; //
              newValueRow.appendChild(p1);
            }
            var p2 = document.createElement("p");
            p2.className = "card-text";
            var small = document.createElement("small");
            small.className = "text-muted";
            small.innerHTML = "Viimeksi päivitetty " + element.lastValues.stamp;     //
            p2.appendChild(small);
            newDiv3.appendChild(p2);
            document.getElementById("cards").appendChild(newRowDiv);
            
          });
          console.log(newRowDiv);
        }

        //create charts
        function drawCharts(){
          
          const charts = [
            {cid: "#temp2", label: "Ravinneliuoksen lämpötila [&#176C]", yData: temp1, color: "rgba(59, 89, 152, 1)", suggestedMin: 10, suggestedMax: 30}
          ];

          // check if sql query has returned empty array
          if(data[0].length === 0){
            const chrts = ["#temp2"];
            chrts.forEach(function(element){
              var canvas = $(element).get(0); //document.getElementById("temp1");
              var ctx = canvas.getContext("2d");
              ctx.clearRect(0,0,canvas.width, canvas.height);
              ctx.font = "30px Arial";
              ctx.strokeText("Ei mittaustuloksia",20,50);
            });

            return;
          }

          // modify timestamp for charts #1
          var xAxis = [];
          // first element
          var t = tstamp[0].split(/[- :]/); 
          xAxis.push(t[0]+"-"+t[1]+"-"+t[2]+" "+t[3]+":"+t[4]);
          // other elements
          for(var i=1;i<tstamp.length-1;i++) {
            var t = tstamp[i].split(/[- :]/); // Split timestamp into [ Y, M, D, h, m, s ]
            xAxis.push(t[3]+":"+t[4]);
          }
          //last element
          var t = tstamp[tstamp.length-1].split(/[- :]/); 
          xAxis.push(t[0]+"-"+t[1]+"-"+t[2]+" "+t[3]+":"+t[4]);
          //console.log(xAxis);
          
          // modify timestamp for charts #2
          var jsDate = [];
          for(var i=0;i<tstamp.length;i++) {
            var dateStr=tstamp[i]; //returned from mysql timestamp/datetime field
            var a=dateStr.split(" ");
            var d=a[0].split("-");
            var t=a[1].split(":");
            var formatedDate = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
            jsDate.push(formatedDate);
          }
          //console.log(jsDate);

          //charts 
          charts.forEach(function(element){
            var LineGraph2 = new Chart($(element.cid), {  //
              type: 'line',
              data: {
                labels: tstamp,
                datasets: [
                  {
                    label: element.label,   //
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: element.color,
                    borderColor: element.color,
                    pointHoverBackgroundColor: element.color,  //
                    pointHoverBorderColor: element.color,
                    pointRadius: 0,
                    data: element.yData   //
                  }
                ]
              },
              options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: element.suggestedMin,   //
                            suggestedMax: element.suggestedMax   //
                        }
                    }],
                    xAxes: [{
                      ticks: {
                        maxTicksLimit: 11
                      },
                      type: 'time',
                  time: {
                    displayFormats: {
                      'minute': 'HH:MM',
                      'hour': 'HH:MM',
                      'day': 'MMM DD',
                      
                    }
                },
                  distribution: 'linear'
                    }]
                }
              }
            });
          });
        }

        function lataaRajat() {
          const sensorit = [
            "temp2"
          ];
          if (window.localStorage.getItem("rajat") === null) {
              // ladataan rajat tiedostosta
              var xhr = new XMLHttpRequest();
              xhr.open('GET', 'json/rajat.json', false);
              xhr.onload = function(){
                if(this.status === 200){
                    rajat = JSON.parse(this.responseText);
                    console.log("rajat1");
                    console.log(rajat);
                }
              }
              xhr.send();
          }
          else {
              //ladataan rajat localStoragesta
              rajat = window.JSON.parse(localStorage.getItem("rajat"));
              console.log("rajat2");
              console.log(rajat);
             // console.log(rajat["temp1"].min);
          }
        }
      
      }, // end of success
    error : function(data) {

    }
  });
  
  
  
};
function getSelectValueFirstTime(){
      if (window.JSON.parse(localStorage.getItem("kalenteri")) !== null) { // onko kalenterivalinta käytössä
        //kalenterivalinta on käytössä
        var arr = window.JSON.parse(localStorage.getItem("kalenteri"));
        //kirjoitetaan muistissa olevat päivämäärät valintalaatikoihin
        var al = arr[0].split(" ");
        var lo = arr[1].split(" ");
        document.getElementById("alku").value = al[0];
        document.getElementById("loppu").value = lo[0];
        document.getElementById("list").options[4]=new Option("", null, false, true); //valikon valinta tyhjäksi
        piirra("0", arr[0], arr[1]);
        return;      }
      else{ 
        //ei ole kalenterivalintaa käytössä
        var selectedValue = window.JSON.parse(localStorage.getItem("selectedValue")); //haetaan local storagesta
        if (selectedValue === null) {
          selectedValue = document.getElementById("list").value;
        }
        document.getElementById("list").options.length = 4;
        document.getElementById("alku").value = "";
        document.getElementById("loppu").value = "";
        document.getElementById(selectedValue).selected = 'selected';
        piirra(selectedValue, null, null);
      }
      
}

function getSelectValue(){
  var selectedValue = document.getElementById("list").value;
  window.localStorage.setItem("selectedValue", JSON.stringify(selectedValue)); //tallennetaan local storageen
  document.getElementById("list").options.length = 4;
  document.getElementById("alku").value = "";
  document.getElementById("loppu").value = "";
  window.localStorage.removeItem("kalenteri");
  piirra(selectedValue, null, null);
}

function kalenterit(e){
  e.preventDefault();
  document.getElementById("list").options[4]=new Option("", null, false, true); //valikon valinta tyhjäksi
  var alku = document.getElementById("alku").value.concat(" 00:00:00");
  var loppu = document.getElementById("loppu").value.concat(" 23:59:59");
  window.localStorage.setItem("kalenteri", JSON.stringify([alku, loppu])); //tallennetaan local storageen
  window.localStorage.removeItem("selectedValue");
  piirra("0", alku, loppu);
}



  
  