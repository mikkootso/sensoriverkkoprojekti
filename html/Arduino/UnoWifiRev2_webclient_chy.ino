// HEikki Mattila 020519
// Sending sensor data to Chydenius server
// using Uno WiFi Rev2 board and Post method. 
// Add.php handles data at the server side.
// Sensors:
//        DHT22 - temperature and humidity
//        TEMT6000 - light intensity
//        Gravity infrared CO2 sensor v1.1
//        Gravity Analog Electrical Conductivity Sensor / Meter V2
//        Gravity Waterproof DS18B20 Sensor Kit
//        Gravity Analog pH Sensor / Meter Pro Kit


#include <DHT.h>
#include <SPI.h>
#include <WiFiNINA.h>
#include "DFRobot_EC.h"
#include <OneWire.h>
#include <DallasTemperature.h>

#define DHTPIN 2 // temperature and humidity sensor pin
#define DHTTYPE DHT22 // SENSOR TYPE - THE ADAFRUIT LIBRARY OFFERS SUPPORT FOR MORE MODELS
#define CO2PIN A1 // co2 sensor pin
#define LDRPIN A2 // light intensity sensor pin
#define ONE_WIRE_BUS 3 // one wire bus pin
#define PH_PIN A3 // ph sensor pin
#define EC_PIN A4 // electrical conductivity pin
#define PhOffset 0.0            //PH-deviation compensation

DHT dht(DHTPIN, DHTTYPE); //Initialize DHT sensor
DFRobot_EC ec; // initialize electrical conductivity library
OneWire oneWire(ONE_WIRE_BUS); // Setup a oneWire instance to communicate with any OneWire devices
DallasTemperature dt_sensors(&oneWire); // Pass our oneWire reference to Dallas Temperature. 

#include "arduino_secrets.h" 
///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;

WiFiClient client; // Initialize the Wifi client library

char server[] = "luna.chydenius.fi"; // server address:

unsigned long lastConnectionTime = 0;            // last time you connected to the server, in milliseconds
const unsigned long postingInterval = 300L * 1000L; // delay between updates, in milliseconds

// valiables for push button functionality
unsigned long keyPrevMillis = 0;
const unsigned long keySampleIntervalMs = 25;
byte longKeyPressCountMax = 80;    // 80 * 25 = 2000 ms
byte mediumKeyPressCountMin = 20;    // 20 * 25 = 500 ms
byte KeyPressCount = 0;
byte prevKeyState = HIGH;         // button is active low
byte keyReset = 0;                // button key reseted when released or longKeyPress() executed
const byte keyPin = 4;            // button is connected to this pin and GND

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

  dht.begin(); // Start up the dht library
  
  pinMode(keyPin, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);
  ec.begin(); // Start up the DFRobot_EC library
  dt_sensors.begin(); // Start up the DallasTemperature library
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
    httpRequest();
  }
  // push button key management section
  if (millis() - keyPrevMillis >= keySampleIntervalMs) {
      keyPrevMillis = millis();
      
      byte currKeyState = digitalRead(keyPin);
      
      if ((prevKeyState == HIGH) && (currKeyState == LOW)) {
          keyPress();
      }
      else if ((prevKeyState == LOW) && (currKeyState == HIGH)) {
          keyRelease();
      }
      else if (currKeyState == LOW) {
          KeyPressCount++;
          if ((KeyPressCount >= longKeyPressCountMax) && (keyReset == 1)) {
              longKeyPress();
          }
      }
      prevKeyState = currKeyState;
  }
}

// this method makes a HTTP connection to the server
void httpRequest() {
  int t1 = 0;  // air temperature [C]
  int h1 = 0;  // air humidity  [%]
  int ldr = 0;  // light intensity [luksi]
  int co2 = 0;  // carbon dioxide  [ppm]
  int t2 = 0;  // water temperature [C]
  String data;

  //measurements
  h1 = (int) dht.readHumidity();
  t1 = (int) dht.readTemperature();
  ldr = (int) lightIntensity(); //lux
  co2 = (int) co2Concentration(); //ppm
  t2 = (int) readTemperature();
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

// this method makes a HTTP connection to the server
// sends water temperature, nutrient concentrations and pH values
void httpRequestRL() {
  
  // close any connection before send a new request.
  // This will free the socket on the Nina module
  client.stop();

  //dt_sensors.requestTemperatures(); // Send the command to get temperatures
  //temperature = dt_sensors.getTempCByIndex(0); //get the temperature from the first sensor only
  float temperature = readTemperature();                    // read your temperature sensor 
  Serial.print("T:");
  Serial.print(temperature,2);
  Serial.print("C");//voltagePH = analogRead(PH_PIN); // read the ph voltage
  //phValue    = 3.5*voltagePH*5.0/1024+PhOffset;       // convert voltage to pH 
  float phValue = Ph();
  Serial.print(", pH:");
  Serial.print(phValue,2);
  //voltageEC = analogRead(EC_PIN)/1024.0*5000;          // read the ec voltage
  //ecValue    = ec.readEC(voltageEC,temperature);       // convert voltage to EC with temperature compensation
  float ecValue = Ec(temperature);
  Serial.print(", EC:");
  Serial.print(ecValue,2);
  Serial.println("ms/cm");
  
  String data =  String(String("ec=") + String(ecValue,1) + "&ph=" + String(phValue,1) + "&temp=" + String(temperature,1));

  // if there's a successful connection:
  if (client.connect(server, 80)) {
    Serial.println("connecting...");
    // send the HTTP POST :
    client.println("POST /~sensoriverkkoproj/addrl.php HTTP/1.1"); 
    client.println("Host: luna.chydenius.fi"); 
    client.println("Content-Type: application/x-www-form-urlencoded"); 
    client.print("Content-Length: "); 
    client.println(data.length()); 
    client.println(); 
    client.print(data);
    Serial.println(data);

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

float readTemperature(){
  int n = 10;
  float val=0;
  for(int i=0; i<n; i++){
    dt_sensors.requestTemperatures(); // Send the command to get temperatures
    val += dt_sensors.getTempCByIndex(0); //get the temperature from the first sensor only
    delay(25);
  }
  return val/n;
}



// called when button is kept pressed for 2 seconds or more
void longKeyPress() {
    Serial.println("Start measurements...");
    digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on
    KeyPressCount = 0;
    keyReset = 0;
    httpRequestRL();
    digitalWrite(LED_BUILTIN, LOW);   // turn the LED off
}


// called when key goes from not pressed to pressed
void keyPress() {
    Serial.println("key press");
    KeyPressCount = 0;
    keyReset = 1;
}


// called when key goes from pressed to not pressed
void keyRelease() {
    Serial.println("key release");
    keyReset = 0;
}

// function return PH
float Ph(){
  int n = 100;
  long val=0;
  for(int i=0; i<n; i++){
    val += analogRead(PH_PIN);
    delay(25);
  }
  
  return 3.5*val/n*5.0/1024+PhOffset;
}

// function return electrical conductivity
float Ec(float temperature){
  int n = 100;
  long val=0;
  for(int i=0; i<n; i++){
    val += analogRead(EC_PIN);
    delay(25);
  }
  return ec.readEC((val/n)/1024.0*5000,temperature);
}

