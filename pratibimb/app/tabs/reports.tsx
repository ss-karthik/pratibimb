import { Text, View, StyleSheet } from "react-native";
import MedicalReportAnalyzer from "../components/reportAnalyzer/MedicalReportAnalyzer";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <MedicalReportAnalyzer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
