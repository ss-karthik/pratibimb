import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable, SafeAreaView } from "react-native";
import { Accelerometer } from "expo-sensors";


const STEP_THRESHOLD = 1.2; // Adjust this value based on testing
const STEP_TIMEOUT = 300; // Minimum time between steps (ms)

export default function App() {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const lastTimestamp = useRef(0);
  const subscription = useRef(null);

  useEffect(() => {
    const initAccelerometer = async () => {
      if (isCounting) {
        Accelerometer.setUpdateInterval(100);
        subscription.current = Accelerometer.addListener((data) => {
          const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
          const timestamp = Date.now();

          if (
            magnitude > STEP_THRESHOLD &&
            timestamp - lastTimestamp.current > STEP_TIMEOUT
          ) {
            lastTimestamp.current = timestamp;
            setSteps((prev) => prev + 1);
          }
        });
      } else {
        subscription.current?.remove();
        subscription.current = null;
      }
    };

    initAccelerometer();
    return () => {
      subscription.current?.remove();
    };
  }, [isCounting]);

  const toggleCounting = () => {
    setIsCounting((prev) => !prev);
  };

  const resetSteps = () => {
    setSteps(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step Counter</Text>
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsText}>{steps}</Text>
        <Text style={styles.stepsLabel}>STEPS</Text>
      </View>
      <View style={styles.controls}>
        <Pressable
          style={[
            styles.button,
            isCounting ? styles.stopButton : styles.startButton,
          ]}
          onPress={toggleCounting}
        >
          <Text style={styles.buttonText}>{isCounting ? "STOP" : "START"}</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.resetButton]}
          onPress={resetSteps}
        >
          <Text style={styles.buttonText}>RESET</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  stepsContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  stepsText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#ffffff",
  },
  stepsLabel: {
    fontSize: 24,
    color: "#ffffff",
    marginTop: 8,
  },
  controls: {
    flexDirection: "row",
    gap: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#F44336",
  },
  resetButton: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
