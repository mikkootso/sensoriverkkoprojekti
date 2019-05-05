
    document.getElementById('rajat').addEventListener('submit', tallennaRajat);
    document.getElementById('btn').addEventListener('click', oletusRajat);
    var rajat;
    const sensorit = [
        "temp1",
        "hum1",
        "ldr",
        "co2",
        "temp2",
        "ph",
        "ec"
    ];
    lataaRajat();

    function lataaRajat() {
        if (window.localStorage.getItem("rajat") == null) {
            // ladataan rajat tiedostosta
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'json/rajat.json', true);
    
            xhr.onload = function(){
            if(this.status == 200){
                rajat = JSON.parse(this.responseText);
                //viedään rajat lomakkeeseen
                sensorit.forEach(function(element){
                    document.getElementById(element+"_min").value = rajat[element].min;
                    document.getElementById(element+"_max").value = rajat[element].max;
                    //console.log(rajat[element].min);
                    //console.log(rajat[element].max)
    
                });
    
                console.log("rajat1");
                console.log(rajat);
                //console.log(rajat[sensorit[1]].min);
                
            }
            }
    
            xhr.send();
        }
        else {
            //ladataan rajat localStoragesta
            rajat = window.JSON.parse(localStorage.getItem("rajat"));
            sensorit.forEach(function(element){
                document.getElementById(element+"_min").value = rajat[element].min;
                document.getElementById(element+"_max").value = rajat[element].max;
            });
            console.log("rajat2");
                console.log(rajat);
        }
    }
    
    //talletetaan rajat localStorageen
    function tallennaRajat(e){
        e.preventDefault();
        console.log("tallenna");
        const uudetRajat = rajat;
        sensorit.forEach(function(element){
            uudetRajat[element].min = document.getElementById(element+"_min").value;
            uudetRajat[element].max = document.getElementById(element+"_max").value;
        })
        console.log("uudetRajat");
        console.log(uudetRajat);
        window.localStorage.setItem("rajat", JSON.stringify(uudetRajat));
        // haetaan uudet rajat lomakkeeseen
        //lataaRajat();
      }

      //palautetaan oletusarvot: tyhjennetään localStorage, ladataan arvot tiedostosta
    function oletusRajat(){
        console.log("oletusRajat");
        localStorage.removeItem("rajat");
        lataaRajat();
      }
  
      