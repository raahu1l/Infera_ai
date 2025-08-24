import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Waiting input...");

  const handlePredict = async () => {
    if (!input.trim()) return;
    setOutput("Loading...");

    try {
      const response = await fetch(
        "https://3117230c-8fc8-438c-b9d2-7b73cbbf702c-00-3jglibeynj0ry.sisko.replit.dev/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        }
      );

      if (!response.ok) {
        setOutput("Error: " + response.statusText);
        return;
      }

      const data = await response.json();

      let extractedText = null;

      // ✅ Corrected candidate & parts access
      if (
        data &&
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        Array.isArray(data.candidates[0].content.parts) &&
        data.candidates[0].content.parts.length > 0
      ) {
        // If multiple parts exist, join them
        extractedText = data.candidates[0].content.parts
          .map((p) => (typeof p.text === "string" ? p.text : ""))
          .join("\n");
      } else if (typeof data.response === "string") {
        extractedText = data.response;
      }

      if (extractedText) {
        setOutput(extractedText);
      } else {
        setOutput("No valid response from model.");
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Text style={styles.title}>INFERA</Text>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type here..."
        placeholderTextColor="#B0B7C3"
        style={styles.input}
        editable={true}
        onSubmitEditing={handlePredict}
        returnKeyType="send"
      />

      <TouchableOpacity style={styles.button} onPress={handlePredict}>
        <Text style={styles.buttonText}>SEND</Text>
      </TouchableOpacity>

      <View style={styles.responseContainer}>
        <Text style={styles.responseLabel}>INFERA Response:</Text>
        <ScrollView
          style={{ maxHeight: 120 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text style={styles.responseText}>{output}</Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1117",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    color: "#51A6FF",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 2,
  },
  input: {
    borderColor: "#2E3A59",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 18,
    color: "#D8E1F2",
    backgroundColor: "#202A45",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#51A6FF",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 28,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1.2,
  },
  responseContainer: {
    backgroundColor: "#1E2541",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    minHeight: 140,
  },
  responseLabel: {
    color: "#9FADCC",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  responseText: {
    color: "#E1EDFF",
    fontSize: 18,
    lineHeight: 26,
  },
});
