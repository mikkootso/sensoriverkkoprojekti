// Rony Leppänen, 1.6.2019
// Code for testing measurements when all sensors connected
// Arduino Uno WiFi Rev2 -board
// Sensors:
//        DHT22 - temperature and humidity
//        TEMT6000 - light intensity
//        Gravity infrared CO2 sensor v1.1
//        Gravity Analog Electrical Conductivity Sensor / Meter V2
//        Gravity Waterproof DS18B20 Sensor Kit
//        Gravity Analog pH Sensor / Meter Pro Kit

// Libraries
#include "DFRobot_EC.h"
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"

// Digital sensors
#define DHT_PIN 2
#define WATER_PIN 3
// Analog sensors
#define CO2_PIN A1
#define LIGHT_PIN A2
#define PH_PIN A3
#define EC_PIN A4

// Configs for sensors
OneWire oneWire(WATER_PIN); // Water
DallasTemperature sensors(&oneWire); // Water
DFRobot_EC ec; // EC
#define DHTTYPE DHT22 // DHT22
#define PhOffset 0.0 // pH offset
DHT dht(DHT_PIN, DHTTYPE); // DHT22
float voltageEC, ecValue, temp = 25; // EC

void setup() {
  Serial.begin(9600);
  ec.begin(); // Start EC library
  analogReference(DEFAULT); // Voltage reference for CO2
  dht.begin(); // Start DHT22
  sensors.begin(); // Start DS18B20 (water)
}

void loop() {
  delay(3000); // dht measurements take a while
  Serial.println("\n ----- START ----- ");
  Serial.println("\n[Air]:");
  Serial.println("Light: " + String(readLight(), 2) + " lux");
  Serial.println("CO2: " + String(readCO2(), 2) + " ppm");
  Serial.println("Temp: " + String(dht.readTemperature(), 2) + " C");
  Serial.println("Humidity: " + String(dht.readHumidity(), 2) + " %RH");

  Serial.println("\n[Liquid]:");
  Serial.println("Temp: " + String(readWater(), 2) + " C");
  Serial.println("pH: " + String(readpH(), 2));
  Serial.println("EC: " + String(readElec(), 2) + " ms/cm");
  Serial.println("\n ----- END -----");
}

float readLight() {
  return (float) analogRead(LIGHT_PIN);
}

float readCO2() {
  int sensorValue = analogRead(CO2_PIN);
  float voltage = sensorValue*(5000/1024.0); // Convert signal to voltage
  if (voltage == 0) {
    Serial.println("Fault");
  }
  else if (voltage < 400) {
    Serial.println("CO2 sensor preheating");
  }
  else {
    return (float) (voltage - 400)*(50.0/16.0); // ppm
  }
}

float readWater() {
  return (float) sensors.getTempCByIndex(0);
}

float readpH() {
  return (float) 3.5*analogRead(PH_PIN)*5.0/1024+PhOffset;
}

float readElec() {
  voltageEC = analogRead(EC_PIN)/1024.0*5000;
  // temp = readWater(); if the temperature from water sensor is desired
  return (float) ec.readEC(voltageEC, temp); // Convert voltage to EC with temperature compensation
}
