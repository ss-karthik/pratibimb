import { StyleSheet, Text, View, Pressable, SafeAreaView } from "react-native";

export default function home () {
  return (
    <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Pratibimb</Text>
    </SafeAreaView>
  )
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
    }
});

