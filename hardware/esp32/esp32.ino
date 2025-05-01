void setup() {
  Serial.begin(57600);                  // For Serial Monitor
  Serial2.begin(57600, SERIAL_8N1, 17, 16); // RX = GPIO17, TX = GPIO16 (TX on ESP32 is not used in your case)
  Serial.println("ESP32 ready to receive data.");
}

void loop() {
  if (Serial2.available()) {
    String data = Serial2.readStringUntil('\n');
    data.trim();
    Serial.println("Received from UNO: " + data);

    // Optional: parse weight and height
    int commaIndex = data.indexOf(',');
    if (commaIndex != -1) {
      String weightStr = data.substring(0, commaIndex);
      String heightStr = data.substring(commaIndex + 1);
      float weight = weightStr.toFloat();
      int height = heightStr.toInt();

      Serial.print("Weight: "); Serial.print(weight); Serial.print(" g | ");
      Serial.print("Height: "); Serial.print(height); Serial.println(" cm");
    }
  }
}
