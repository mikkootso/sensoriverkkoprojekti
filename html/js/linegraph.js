$(document).ready(function(){
    $.ajax({
      url : "./kantas.php",
      type : "GET",
      success : function(data){
        console.log(data);
  
        var tstamp = [];
        var temperature = [];
        var humidity = [];
        
  
        for(var i in data) {
          tstamp.push(data[i].timeStamp);
          temperature.push(data[i].temperature);
          humidity.push(data[i].humidity);
          
        }
  
        var chartdata = {
          labels: tstamp,
          datasets: [
            {
              label: "temperature",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(59, 89, 152, 0.75)",
              borderColor: "rgba(59, 89, 152, 1)",
              pointHoverBackgroundColor: "rgba(59, 89, 152, 1)",
              pointHoverBorderColor: "rgba(59, 89, 152, 1)",
              data: temperature
            },
            {
              label: "humidity",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(29, 202, 255, 0.75)",
              borderColor: "rgba(29, 202, 255, 1)",
              pointHoverBackgroundColor: "rgba(29, 202, 255, 1)",
              pointHoverBorderColor: "rgba(29, 202, 255, 1)",
              data: humidity
            }
          ]
        };

        var ctx = $("#mixed");
        var LineGraph = new Chart(ctx, {
          type: 'line',
          data: chartdata
        });

        var tempdata = {
            labels: tstamp,
            datasets: [
              {
                label: "temperature",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(59, 89, 152, 0.75)",
                borderColor: "rgba(59, 89, 152, 1)",
                pointHoverBackgroundColor: "rgba(59, 89, 152, 1)",
                pointHoverBorderColor: "rgba(59, 89, 152, 1)",
                data: temperature
              }
            ]
          };
  
        var ttx = $("#temp");
        var LineGraph2 = new Chart(ttx, {
          type: 'line',
          data: tempdata
        });

        var humdata = {
            labels: tstamp,
            datasets: [
              {
                label: "humidity",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(29, 202, 255, 0.75)",
                borderColor: "rgba(29, 202, 255, 1)",
                pointHoverBackgroundColor: "rgba(29, 202, 255, 1)",
                pointHoverBorderColor: "rgba(29, 202, 255, 1)",
                data: humidity
              }
            ]
          };
  
        var htx = $("#hum");
        var LineGraph3 = new Chart(htx, {
          type: 'line',
          data: humdata
        });
      },
      error : function(data) {
  
      }
    });
  });