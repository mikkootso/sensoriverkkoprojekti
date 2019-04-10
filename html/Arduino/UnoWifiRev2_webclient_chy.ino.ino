// HEikki Mattila 100419
// Sending sensor data to Chydenius server
// using Uno WiFi Rev2 board and Post method. 
// Add.php handles data at the server side.
// Sensors:
//        DHT22 - temperature and humidity
//        TEMT6000 - light intensity
//        Gravity infrared CO2 sensor v1.1


#include <DHT.h>
#include <SPI.h>
#include <WiFiNINA.h>

#define DHTPIN 2 // temperature and humidity sensor pin
#define DHTTYPE DHT22 // SENSOR TYPE - THE ADAFRUIT LIBRARY OFFERS SUPPORT FOR MORE MODELS
#define CO2PIN A1 // co2 sensor pin
#define LDRPIN A2 // light intensity sensor pin

DHT dht(DHTPIN, DHTTYPE); //Initialize DHT sensor

#include "arduino_secrets.h" 
///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;

// Initialize the Wifi client library
WiFiClient client;

// server address:
char server[] = "luna.chydenius.fi";

unsigned long lastConnectionTime = 0;            // last time you connected to the server, in milliseconds
const unsigned long postingInterval = 300L * 1000L; // delay between updates, in milliseconds

int t1 = 0;  // air temperature [C]
int h1 = 0;  // air humidity  [%]
int ldr = 0;  // light intensity [luksi]
int co2 = 0;  // carbon dioxide  [ppm]
int t2 = 0;  // water temperature [C]
String data;

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < "1.0.0") {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }
  // you're connected now, so print out the status:
  printWifiStatus();

  dht.begin(); 
  //delay(10000); // GIVE THE SENSOR SOME TIME TO START
  //h1 = (int) dht.readHumidity(); 
  //t1 = (int) dht.readTemperature(); 
  //Serial.println(h1);
  //Serial.println(t1);

  randomSeed(analogRead(0));
}

void loop() {
  // if there's incoming data from the net connection.
  // send it out the serial port.  This is for debugging
  // purposes only:
  while (client.available()) {
    char c = client.read();
    Serial.write(c);
  }

  // if xxx seconds have passed since your last connection,
  // then connect again and send data:
  if (millis() - lastConnectionTime > postingInterval) {
    h1 = (int) dht.readHumidity();
    t1 = (int) dht.readTemperature();
    ldr = (int) lightIntensity(); //lux
    co2 = (int) co2Concentration(); //ppm
    t2 = 22 + random(3); //C  dummy data
    
    httpRequest();
  }

}

// this method makes a HTTP connection to the server:
void httpRequest() {
  // close any connection before send a new request.
  // This will free the socket on the Nina module
  client.stop();

  data =  String(String("temp1=") + t1 + "&hum1=" + h1 + "&ldr=" + ldr + "&co2=" + co2 + "&temp2=" + t2);

  // if there's a successful connection:
  if (client.connect(server, 80)) {
    Serial.println("connecting...");
    // send the HTTP POST :
    client.println("POST /~sensoriverkkoproj/add.php HTTP/1.1"); 
    client.println("Host: luna.chydenius.fi"); 
    client.println("Content-Type: application/x-www-form-urlencoded"); 
    client.print("Content-Length: "); 
    client.println(data.length()); 
    client.println(); 
    client.print(data);
    Serial.println(data);

    // note the time that the connection was made:
    lastConnectionTime = millis();
  } else {
    // if you couldn't make a connection:
    Serial.println("connection failed");
  }
  if (client.connected()) { 
    Serial.println("disconnecting.");
    client.stop();  // DISCONNECT FROM THE SERVER
  }
}

// Prints out the WiFi status
void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

//function returns co2 sensor consentration value
float co2Concentration(){
  int sensorValue = analogRead(CO2PIN);  
  float voltage = sensorValue*(5000/1024.0); 
  if(voltage == 0){
    Serial.println("CO2 sensor fault)");
    return 0.0;
  }
  else if(voltage < 400){
    Serial.println("CO2 sensor preheating");
    return 0.0;
  }
  else{
    // measure n times and return the average
    int n = 100;
    float concentration = 0;
    for(int i=0; i<n; i++){
      sensorValue = analogRead(CO2PIN);
      voltage = sensorValue*(5000/1024.0); 
      concentration += (voltage-400.0)*50.0/16.0;
      delay(100); 
    }
    return concentration/n;
  }
}

// function return light intensity in LUX
float lightIntensity(){
  int n = 100;
  int val;
  float lux = 0;
  for(int i=0; i<n; i++){
    val = analogRead(LDRPIN);
    lux += val*1000.0/1023.0;
    delay(100);
  }
  return lux/n;
}