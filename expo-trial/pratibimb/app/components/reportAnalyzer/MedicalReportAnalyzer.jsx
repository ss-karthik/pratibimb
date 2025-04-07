import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import analyzeMedicalReport from "./geminiAPI.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicalReportAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      if (selectedImage.fileSize > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImage(selectedImage);
      setPreviewUrl(selectedImage.uri);
      setError(null);
      setResults(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please upload an image of your medical report first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const base64Image = await convertImageToBase64(image.uri);
      const response = await analyzeMedicalReport(base64Image);
      setResults(response);
    } catch (err) {
      console.error("Error analyzing medical report:", err);
      setError("Failed to analyze medical report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const convertImageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleReset = () => {
    setImage(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Medical Report Analyzer</Text>
        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            <Text style={styles.bold}>Disclaimer:</Text> This tool is for
            informational purposes only and is not a substitute for professional
            medical advice, diagnosis, or treatment. Always consult with a
            qualified healthcare provider to interpret your medical reports and
            for proper medical guidance.
          </Text>
        </View>
        {/* Image Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Medical Report Image</Text>
          <Text style={styles.instructionText}>
            Take a clear photo of your lab results, diagnostic reports, or
            medical test results.
          </Text>

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        {previewUrl && (
          <View style={styles.previewContainer}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <Image source={{ uri: previewUrl }} style={styles.previewImage} />
          </View>
        )}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              (!image || isLoading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!image || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Analyzing..." : "Analyze Report"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Analyzing medical report...</Text>
          </View>
        )}

        {results && results.conditions && results.conditions.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Analysis Results</Text>
            {results.conditions.map((condition, index) => (
              <View key={index} style={styles.conditionCard}>
                <Text style={styles.conditionTitle}>{condition.condition}</Text>

                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Overview</Text>
                  <Text style={styles.sectionContent}>
                    {condition.description}
                  </Text>
                </View>

                {condition.preventiveMeasures &&
                  condition.preventiveMeasures.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionHeader}>
                        Preventive Measures
                      </Text>
                      {condition.preventiveMeasures.map((measure, idx) => (
                        <Text key={idx} style={styles.listItem}>
                          • {measure}
                        </Text>
                      ))}
                    </View>
                  )}

                {condition.dos && condition.dos.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeader}>
                      Recommended Actions
                    </Text>
                    {condition.dos.map((doItem, idx) => (
                      <Text key={idx} style={styles.listItem}>
                        • {doItem}
                      </Text>
                    ))}
                  </View>
                )}

                {condition.donts && condition.donts.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Things to Avoid</Text>
                    {condition.donts.map((dont, idx) => (
                      <Text key={idx} style={styles.listItem}>
                        • {dont}
                      </Text>
                    ))}
                  </View>
                )}

                {condition.specialist && (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Consult Specialist</Text>
                    <Text style={styles.sectionContent}>
                      {condition.specialist}
                    </Text>
                  </View>
                )}

                {condition.foodToAvoid && condition.foodToAvoid.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Foods to Avoid</Text>
                    {condition.foodToAvoid.map((food, idx) => (
                      <Text key={idx} style={styles.listItem}>
                        • {food}
                      </Text>
                    ))}
                  </View>
                )}

                {condition.foodToEat && condition.foodToEat.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Recommended Foods</Text>
                    {condition.foodToEat.map((food, idx) => (
                      <Text key={idx} style={styles.listItem}>
                        • {food}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : results && results.conditions && results.conditions.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No health concerns detected in your medical report.
            </Text>
            <Text style={styles.noResultsSubtext}>
              Remember that this tool has limitations and may not detect all
              conditions. Always consult a healthcare professional for the
              proper interpretation of your medical reports.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#fff",
  },
  warningBanner: {
    backgroundColor: "#fffbeb",
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: "#92400e",
  },
  bold: {
    fontWeight: "bold",
  },
  uploadSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#dddddd",
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: "#e0f2fe",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    marginTop: 8,
    fontSize: 14,
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#93c5fd",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#93c5fd",
  },
  resetButton: {
    backgroundColor: "#93c5fd",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: "#4b5563",
  },
  resultsContainer: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  conditionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 16,
  },
  conditionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: "#4b5563",
  },
  noResultsContainer: {
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  noResultsText: {
    fontSize: 16,
    color: "#166534",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#3f6212",
  },
});