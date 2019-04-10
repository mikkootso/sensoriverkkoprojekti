$(document).ready(function(){
    $.ajax({
      url : "./kantas.php",
      type : "GET",
      success : function(data){
        console.log(data);
        
  
        var tstamp = [];
        var temp1 = [];
        var hum1 = [];
        var ldr = [];
        var co2 = [];
        var temp2 = [];

        // Min and max limits
        var temp1Min = 20;
        var temp1Max = 30;
        var hum1Min = 30;
        var hum1Max = 80;
        var ldrMin = 100;
        var ldrMax = 900;
        var co2Min = 400;
        var co2Max = 1200;
        
  
        for(var i in data) {
          tstamp.push(data[i].timeStamp);
          temp1.push(data[i].temp1);
          hum1.push(data[i].hum1);
          ldr.push(data[i].ldr);
          co2.push(data[i].co2);
          temp2.push(data[i].temp2);
          
        }

        //chart 1 
        var chartdata = {
          labels: tstamp,
          datasets: [
            {
              label: "Ilman lämpötila",
              yAxisID: 'A',
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(59, 89, 152, 0.75)",
              borderColor: "rgba(59, 89, 152, 1)",
              pointHoverBackgroundColor: "rgba(59, 89, 152, 1)",
              pointHoverBorderColor: "rgba(59, 89, 152, 1)",
              data: temp1
            },
            {
              label: "Ilman kosteus",
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
              label: "Valoisuus",
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
              label: "Hiilidioksidi",
              yAxisID: 'B',
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(0, 255, 0, 0.75)",
              borderColor: "rgba(0, 255, 0, 1)",
              pointHoverBackgroundColor: "rgba(0, 255, 0, 1)",
              pointHoverBorderColor: "rgba(0, 255, 0, 1)",
              data: co2
            },
            {
              label: "Veden lämpötila",
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
        };

        var ctx = $("#mixed");
        var LineGraph = new Chart(ctx, {
          type: 'line',
          data: chartdata,
          options: {
            scales: {
              yAxes: [{
                id: 'A',
                type: 'linear',
                position: 'left',
                ticks: {
                  max: 100,
                  min: 0
                }
              }, {
                id: 'B',
                type: 'linear',
                position: 'right',
                ticks: {
                  max: 1000,
                  min: 0
                }
              }]
            }
          }
        });

        //chart 2 
        var temp1data = {
            labels: tstamp,
            datasets: [
              {
                label: "Ilman lämpötila",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(59, 89, 152, 0.75)",
                borderColor: "rgba(59, 89, 152, 1)",
                pointHoverBackgroundColor: "rgba(59, 89, 152, 1)",
                pointHoverBorderColor: "rgba(59, 89, 152, 1)",
                data: temp1
              }
            ]
          };
  
        var ttx = $("#temp1");
        var LineGraph2 = new Chart(ttx, {
          type: 'line',
          data: temp1data
        });

        //chart 3 
        var hum1data = {
            labels: tstamp,
            datasets: [
              {
                label: "Ilman kosteus",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(29, 202, 255, 0.75)",
                borderColor: "rgba(29, 202, 255, 1)",
                pointHoverBackgroundColor: "rgba(29, 202, 255, 1)",
                pointHoverBorderColor: "rgba(29, 202, 255, 1)",
                data: hum1
              }
            ]
          };
  
        var htx = $("#hum1");
        var LineGraph3 = new Chart(htx, {
          type: 'line',
          data: hum1data
        }); //

        //chart 4 
        var ldrdata = {
          labels: tstamp,
          datasets: [
            {
              label: "Valoisuus",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(229, 202, 25, 0.75)",
              borderColor: "rgba(229, 202, 25, 1)",
              pointHoverBackgroundColor: "rgba(229, 202, 25, 1)",
              pointHoverBorderColor: "rgba(229, 202, 25, 1)",
              data: ldr
            }
          ]
        };

      var htx = $("#ldr");
      var LineGraph3 = new Chart(htx, {
        type: 'line',
        data: ldrdata
      }); //

      //chart 5 
      var co2data = {
        labels: tstamp,
        datasets: [
          {
            label: "Hiilidioksidi",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(0, 255, 0, 0.75)",
            borderColor: "rgba(0, 255, 0, 1)",
            pointHoverBackgroundColor: "rgba(0, 255, 0, 1)",
            pointHoverBorderColor: "rgba(0, 255, 0, 1)",
            data: co2
          }
        ]
      };

      var htx = $("#co2");
      var LineGraph3 = new Chart(htx, {
        type: 'line',
        data: co2data,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false,
                min: 300,
                max: 1300,
                stepSize: 50,
              }
            }]
          }
        }
      }); //

      //chart 6 
      var temp2data = {
        labels: tstamp,
        datasets: [
          {
            label: "Veden lämpötila",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255, 0, 0, 0.75)",
            borderColor: "rgba(255, 0, 0, 1)",
            pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
            pointHoverBorderColor: "rgba(255, 0, 0, 1)",
            data: temp2
          }
        ]
      };

      /*
      var htx = $("#temp2");
      var LineGraph3 = new Chart(htx, {
        type: 'line',
        data: temp2data,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 30,
                stepSize: 2,
              }
            }]
          }
        }
      }); 
      */
      
      //  temp1Card
      let tv = document.getElementById("tValue");
      tv.innerHTML = data[data.length-1].temp1 + " C";
      let tt = document.getElementById("tTime");
      tt.innerHTML = "Viimeksi päivitetty " + data[data.length-1].timeStamp;
      if (data[data.length-1].temp1 < temp1Min || data[data.length-1].temp1 > temp1Max) {
        let tb = document.getElementById("tBorder");
        tb.setAttribute("class", "card border-danger text-center");
        let tt = document.getElementById("tText");
        tt.setAttribute("class", "card-body text-danger");
      }
      //  hum1Card
      let hv = document.getElementById("hValue");
      hv.innerHTML = data[data.length-1].hum1 + " %";
      let ht = document.getElementById("hTime");
      ht.innerHTML = "Viimeksi päivitetty " + data[data.length-1].timeStamp;
      if (data[data.length-1].hum1 < hum1Min || data[data.length-1].hum1 > hum1Max) {
        let hb = document.getElementById("hBorder");
        hb.setAttribute("class", "card border-danger text-center");
        let ht = document.getElementById("hText");
        ht.setAttribute("class", "card-body text-danger");
      }
      //  ldrCard
      let lv = document.getElementById("lValue");
      lv.innerHTML = data[data.length-1].ldr + " lx";
      let lt = document.getElementById("lTime");
      lt.innerHTML = "Viimeksi päivitetty " + data[data.length-1].timeStamp;
      if (data[data.length-1].ldr < ldrMin || data[data.length-1].ldr > ldrMax) {
        let lb = document.getElementById("lBorder");
        lb.setAttribute("class", "card border-danger text-center");
        let lt = document.getElementById("lText");
        lt.setAttribute("class", "card-body text-danger");
      }
      //  co2Card
      let cv = document.getElementById("cValue");
      cv.innerHTML = data[data.length-1].co2 + " ppm";
      let ct = document.getElementById("cTime");
      ct.innerHTML = "Viimeksi päivitetty " + data[data.length-1].timeStamp;
      if (data[data.length-1].co2 < co2Min || data[data.length-1].co2 > co2Max) {
        let cb = document.getElementById("cBorder");
        cb.setAttribute("class", "card border-danger text-center");
        let ct = document.getElementById("cText");
        ct.setAttribute("class", "card-body text-danger");
      }

    },
    error : function(data) {

    }
  });

  
});
  
  