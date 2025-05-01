#include <HX711_ADC.h>
//#include <SoftwareSerial.h>

const int HX711_dout = 4;
const int HX711_sck = 5;
const int trigPin = 13;
const int echoPin = 12;

HX711_ADC LoadCell(HX711_dout, HX711_sck);
//SoftwareSerial espSerial(2, 3); // RX (Pin 2) and TX (Pin 3) for UNO communication with ESP32

unsigned long t = 0;

void setup() {
  Serial.begin(57600);      // For serial monitor
  //espSerial.begin(115200);    // For ESP32 communication (match with ESP32 baud rate)
  LoadCell.begin();
  LoadCell.start(2000, true);
  LoadCell.setCalFactor(16.5); // <-- change this after calibration

  Serial.println("UNO ready.");
}

void loop() {
  LoadCell.update();
  float weight = LoadCell.getData();

  int heightCm = getHeight();

  // Print to Serial Monitor
  Serial.print("Weight: "); Serial.print(weight);
  Serial.print(" g | Height: "); Serial.print(heightCm); Serial.println(" cm");

  // Send to ESP32 (weight,height) in format "weight,height"
  //espSerial.print(weight); 
  //espSerial.print(","); 
  //espSerial.println(heightCm);

  delay(500);
}

int getHeight() {
  pinMode(trigPin, OUTPUT);
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  pinMode(echoPin, INPUT);
  long duration = pulseIn(echoPin, HIGH);
  int cm = duration / 29 / 2;
  return cm;
}