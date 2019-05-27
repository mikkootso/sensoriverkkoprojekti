document.getElementById('kalenterit').addEventListener('submit', kalenterit);
getSelectValue();
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
        if (window.localStorage.getItem("rajat") == null) {
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
            {id: 1, title: "Ilman lämpötila", min: parseInt(rajat["temp1"].min), max: parseInt(rajat["temp1"].max), lastValues: {val: data[2][data[2].length-1].temp1, stamp: data[2][data[2].length-1].timeStamp, unit: "C"}},
            {id: 2, title: "Ilman kosteus", min: parseInt(rajat["hum1"].min), max: parseInt(rajat["hum1"].max), lastValues: {val: data[2][data[2].length-1].hum1, stamp: data[2][data[2].length-1].timeStamp, unit: "%"}},
            {id: 3, title: "Valoisuus", min: parseInt(rajat["ldr"].min), max: parseInt(rajat["ldr"].max), lastValues: {val: data[2][data[2].length-1].ldr, stamp: data[2][data[2].length-1].timeStamp, unit: "lx"}},
            {id: 4, title: "Hiilidioksidipitoisuus", min: parseInt(rajat["co2"].min), max: parseInt(rajat["co2"].max), lastValues: {val: data[2][data[2].length-1].co2, stamp: data[2][data[2].length-1].timeStamp, unit: "ppm"}},
            {id: 5, title: "Ravinneliuoksen lämpötila", min: parseInt(rajat["temp2"].min), max: parseInt(rajat["temp2"].max), lastValues: {val: data[1][data[1].length-1].temp, stamp: data[1][data[1].length-1].timeStamp, unit: "C"}},
            {id: 6, title: "Ravinneliuoksen PH", min: parseInt(rajat["ph"].min), max: parseInt(rajat["ph"].max), lastValues: {val: data[1][data[1].length-1].ph, stamp: data[1][data[1].length-1].timeStamp, unit: ""}},
            {id: 7, title: "Ravinneliuoksen sähkönjohtavuus", min: parseInt(rajat["ec"].min), max: parseInt(rajat["ec"].max), lastValues: {val: data[1][data[1].length-1].ec, stamp: data[1][data[1].length-1].timeStamp, unit: "mS/cm"}}
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
            {cid: "#temp1", label: "Ilman lämpötila [C]", yData: temp1, color: "rgba(59, 89, 152, 1)", suggestedMin: 10, suggestedMax: 30},
            {cid: "#hum1", label: "Ilman kosteus [%]", yData: hum1, color: "rgba(29, 202, 255, 1)", suggestedMin: 20, suggestedMax: 80},
            {cid: "#ldr", label: "Valoisuus [lx]", yData: ldr, color: "rgba(229, 202, 25, 1)", suggestedMin: 100, suggestedMax: 1000},
            {cid: "#co2", label: "Hiilidioksidipitoisuus [ppm]", yData: co2, color: "rgba(0, 255, 0, 1)", suggestedMin: 400, suggestedMax: 1400}
          ];

          // check if sql query has returned empty array
          if(data[0].length === 0){
            const chrts = ["#temp1","#hum1","#ldr","#co2","#mixed1","#mixed2"];
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

          //chart 0 
          var ctx = $("#mixed1");
          var LineGraph = new Chart(ctx, {
            type: 'line',
            data: {
              labels: jsDate,
              datasets: [
                {
                  label: "Ilman lämpötila [C]", //
                  yAxisID: 'A',  //
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(59, 89, 152, 0.75)",
                  borderColor: "rgba(59, 89, 152, 1)",
                  pointHoverBackgroundColor: "rgba(59, 89, 152, 1)", //
                  pointHoverBorderColor: "rgba(59, 89, 152, 1)",
                  data: temp1  //
                },
                {
                  label: "Ilman kosteus [%]",
                  yAxisID: 'A',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(29, 202, 255, 0.75)",
                  borderColor: "rgba(29, 202, 255, 1)",
                  pointHoverBackgroundColor: "rgba(29, 202, 255, 1)",
                  pointHoverBorderColor: "rgba(29, 202, 255, 1)",
                  data: hum1
                },
                {
                  label: "Ravinneliuoksen lämpötila [C]",
                  yAxisID: 'A',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(255, 0, 0, 0.75)",
                  borderColor: "rgba(255, 0, 0, 1)",
                  pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
                  pointHoverBorderColor: "rgba(255, 0, 0, 1)",
                  data: temp2
                }
              ]
            },
            options: {
              scales: {
                yAxes: [{
                  id: 'A',
                  type: 'linear',
                  position: 'left',
                  ticks: {
                    suggestedMax: 100,
                    suggestedMin: 0
                  }
                }],
                xAxes: [{
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

          //chart 1 

          var ctxLine = document.getElementById("mixed2").getContext("2d");
          if(window.ctx != undefined)
              window.ctx.destroy();
          window.ctx = new Chart(ctxLine, {});

          var ctx = $("#mixed2");
          var LineGraph = new Chart(ctx, {
            type: 'line',
            data: {
              labels: tstamp,
              datasets: [
                {
                  label: "Valoisuus [lx]",
                  yAxisID: 'B',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(229, 202, 25, 0.75)",
                  borderColor: "rgba(229, 202, 25, 1)",
                  pointHoverBackgroundColor: "rgba(229, 202, 25, 1)",
                  pointHoverBorderColor: "rgba(229, 202, 25, 1)",
                  data: ldr
                },
                {
                  label: "Hiilidioksidipitoisuus [ppm]",
                  yAxisID: 'B',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(0, 255, 0, 0.75)",
                  borderColor: "rgba(0, 255, 0, 1)",
                  pointHoverBackgroundColor: "rgba(0, 255, 0, 1)",
                  pointHoverBorderColor: "rgba(0, 255, 0, 1)",
                  data: co2
                }
              ]
            },
            options: {
              scales: {
                yAxes: [{
                  id: 'B',
                  type: 'linear',
                  position: 'left',
                  ticks: {
                    suggestedMax: 1000,
                    suggestedMin: 0
                  }
                }]
              }
            }
          });

          //charts 
          charts.forEach(function(element){
            var LineGraph2 = new Chart($(element.cid), {  //
              type: 'line',
              data: {
                labels: xAxis,
                datasets: [
                  {
                    label: element.label,   //
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: element.color,
                    borderColor: element.color,
                    pointHoverBackgroundColor: element.color,  //
                    pointHoverBorderColor: element.color,
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
                      }
                    }]
                }
              }
            });
          });
        }

        function lataaRajat() {
          const sensorit = [
            "temp1",
            "hum1",
            "ldr",
            "co2",
            "temp2",
            "ph",
            "ec"
          ];
          if (window.localStorage.getItem("rajat") == null) {
              // ladataan rajat tiedostosta
              var xhr = new XMLHttpRequest();
              xhr.open('GET', 'json/rajat.json', false);
              xhr.onload = function(){
                if(this.status == 200){
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
function getSelectValue(){
      var selectedValue = document.getElementById("list").value;
      console.log(selectedValue);
      document.getElementById("list").options.length = 4;
      document.getElementById("alku").value = "";
      document.getElementById("loppu").value = "";
      piirra(selectedValue, null, null);
}

function kalenterit(e){
  e.preventDefault();
  document.getElementById("list").options[4]=new Option("", null, false, true);
  var alku = document.getElementById("alku").value.concat(" 00:00:00");
  var loppu = document.getElementById("loppu").value.concat(" 23:59:59");
  console.log(alku);
  console.log(loppu);
  piirra("0", alku, loppu);
}



  
  