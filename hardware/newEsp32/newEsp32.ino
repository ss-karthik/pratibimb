#include <WiFi.h>
#include <HTTPClient.h>

// Replace with your Wi-Fi credentials
const char* ssid = "Karthiksm14";
const char* password = "km68vk11";

// Replace with your backend URL
const char* backendURL = "https://pratibimb.onrender.com/bmi";

const unsigned long averagingInterval = 30000; // 30 seconds in milliseconds
const int numSamples = 10; // Number of samples to collect (adjust as needed)
unsigned long startTime = 0;
float weightSum = 0.1;
int heightSum = 0;
int sampleCount = 0;
bool dataSent = false;

void setup() {
  Serial.begin(57600);
  Serial2.begin(57600, SERIAL_8N1, 17, 16);
  Serial.println("ESP32 ready to receive and average data.");

  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  startTime = millis(); // Initialize the start time for averaging
}

void loop() {
  if (Serial2.available() && !dataSent) {
    String data = Serial2.readStringUntil('\n');
    data.trim();
    Serial.println("Received from UNO: " + data);

    int weightIndex = data.indexOf("Weight:");
    int gIndex = data.indexOf(" g |");
    int heightIndex = data.indexOf("Height:");
    int cmIndex = data.indexOf(" cm");

    if (weightIndex != -1 && gIndex != -1 && heightIndex != -1 && cmIndex != -1 && weightIndex < gIndex && heightIndex < cmIndex && gIndex < heightIndex) {
      String weightStr = data.substring(weightIndex + 8, gIndex); // Extract value after "Weight:" and before " g |"
      String heightStr = data.substring(heightIndex + 8, cmIndex); // Extract value after "Height:" and before " cm"

      weightStr.trim();
      heightStr.trim();

      float weight = weightStr.toFloat();
      weight = weight/1000;
      int height = heightStr.toInt();

      Serial.print("Weight: "); Serial.print(weight); Serial.print(" g | ");
      Serial.print("Height: "); Serial.print(height); Serial.println(" cm");
      if(weight>weightSum){
        weightSum = weight;
      }
      //weightSum += weight;
      heightSum += height;
      sampleCount++;
    } else {
      Serial.println("Invalid data format received from UNO.");
    }
  }

  // Check if the averaging interval has passed
  if (millis() - startTime >= averagingInterval && sampleCount > 0 && !dataSent) {
    float averageWeight = weightSum;
    float averageHeight = (float)heightSum / sampleCount; // Ensure float division

    Serial.print("Average Weight: "); Serial.print(averageWeight); Serial.print(" g | ");
    Serial.print("Average Height: "); Serial.print(averageHeight); Serial.println(" cm");
    
    // Prepare JSON payload with average values
    String jsonPayload = "{\"deviceId\": \"121212\", \"height\": " + String(averageHeight) + ", \"weight\": " + String(averageWeight) + "}";
    // Send POST request
    HTTPClient http;
    http.begin(backendURL);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("Response from server: " + response);
      dataSent = true; // Set the flag to stop further sending
    } else {
      Serial.print("Error sending POST: ");
      Serial.println(http.errorToString(httpResponseCode));
    }
    http.end();
    
    if (dataSent) {
      Serial.println("Average data sent. Stopping program.");
      while (true) {
        delay(1000); // Keep the ESP32 in an infinite loop
      }
    }
  } else if (millis() - startTime >= averagingInterval && sampleCount == 0 && !dataSent) {
    Serial.println("No data received during the averaging period. Stopping program.");
    dataSent = true;
    while (true) {
      delay(1000);
    }
  }
}