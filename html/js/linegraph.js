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
          data: chartdata
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
  }); //
      },
      error : function(data) {
  
      }
    });
  });