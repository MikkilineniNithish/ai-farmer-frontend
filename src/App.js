import { useState } from "react";

const API_URL = "https://ai-farmer-assistant.onrender.com";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "🌾 Namaste! I am your AI Farmer Assistant. Ask me anything about your crops, weather, or farming!",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [city, setCity] = useState("Tirupati");
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const askQuestion = async () => {
    if (!question.trim()) return;
    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        mode: "cors",
        body: JSON.stringify({ question, city }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again!" }]);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    setDiagnosis(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch(`${API_URL}/detect-disease`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setDiagnosis(data.diagnosis);
    } catch (error) {
      setDiagnosis("Sorry, couldn't analyze the image. Please try again!");
    }
    setImageLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") askQuestion();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>🌾 AI Farmer Assistant</h1>
        <p style={styles.headerSubtitle}>Smart farming advice powered by AI</p>
      </div>

      {/* City selector */}
      <div style={styles.cityBar}>
        <span style={styles.cityLabel}>📍 Your city:</span>
        <input
          style={styles.cityInput}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          style={activeTab === "chat" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("chat")}
        >
          💬 Chat
        </button>
        <button
          style={activeTab === "disease" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("disease")}
        >
          🌿 Disease Detector
        </button>
      </div>

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <>
          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div key={index} style={msg.role === "user" ? styles.userMessage : styles.botMessage}>
                <span style={styles.messageIcon}>{msg.role === "user" ? "👨‍🌾" : "🤖"}</span>
                <p style={styles.messageText}>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div style={styles.botMessage}>
                <span style={styles.messageIcon}>🤖</span>
                <p style={styles.messageText}>Thinking... 🌤️</p>
              </div>
            )}
          </div>
          <div style={styles.inputBar}>
            <input
              style={styles.input}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your crops, weather, irrigation..."
            />
            <button style={styles.button} onClick={askQuestion} disabled={loading}>
              {loading ? "..." : "Ask 🌱"}
            </button>
          </div>
        </>
      )}

      {/* Disease Detector Tab */}
      {activeTab === "disease" && (
        <div style={styles.diseaseBox}>
          <h2 style={styles.diseaseTitle}>🔬 Crop Disease Detector</h2>
          <p style={styles.diseaseSubtitle}>Upload a photo of your plant leaf and AI will diagnose it!</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.fileInput}
          />
          {imageLoading && (
            <div style={styles.loadingBox}>
              <p style={styles.loadingText}>🔬 Analyzing your plant photo...</p>
              <p style={styles.loadingText}>This may take 10-15 seconds</p>
            </div>
          )}
          {diagnosis && (
            <div style={styles.diagnosisBox}>
              <h3 style={styles.diagnosisTitle}>🩺 Diagnosis Report</h3>
              <p style={styles.diagnosisText}>{diagnosis}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f7f0",
  },
  header: {
    backgroundColor: "#2d6a4f",
    padding: "20px",
    textAlign: "center",
  },
  headerTitle: { color: "white", margin: 0, fontSize: "24px" },
  headerSubtitle: { color: "#b7e4c7", margin: "5px 0 0 0", fontSize: "14px" },
  cityBar: {
    backgroundColor: "#52b788",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cityLabel: { color: "white", fontWeight: "bold", fontSize: "14px" },
  cityInput: { padding: "5px 10px", borderRadius: "15px", border: "none", fontSize: "14px", width: "150px" },
  tabBar: {
    display: "flex",
    backgroundColor: "#1b4332",
  },
  tab: {
    flex: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "#1b4332",
    color: "#b7e4c7",
    fontSize: "15px",
    cursor: "pointer",
  },
  tabActive: {
    flex: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "#2d6a4f",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "bold",
    borderBottom: "3px solid #74c69d",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  userMessage: { display: "flex", alignItems: "flex-start", gap: "10px", flexDirection: "row-reverse" },
  botMessage: { display: "flex", alignItems: "flex-start", gap: "10px" },
  messageIcon: { fontSize: "24px", flexShrink: 0 },
  messageText: {
    backgroundColor: "white",
    padding: "12px 16px",
    borderRadius: "15px",
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.5",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    maxWidth: "80%",
  },
  inputBar: {
    padding: "15px 20px",
    backgroundColor: "white",
    display: "flex",
    gap: "10px",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "25px",
    border: "2px solid #52b788",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#2d6a4f",
    color: "white",
    border: "none",
    borderRadius: "25px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  diseaseBox: {
    flex: 1,
    padding: "30px 20px",
    overflowY: "auto",
  },
  diseaseTitle: { color: "#2d6a4f", margin: "0 0 10px 0" },
  diseaseSubtitle: { color: "#555", marginBottom: "20px" },
  fileInput: {
    display: "block",
    padding: "10px",
    backgroundColor: "#52b788",
    color: "white",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    marginBottom: "20px",
    width: "100%",
  },
  loadingBox: { textAlign: "center", padding: "20px" },
  loadingText: { color: "#2d6a4f", fontWeight: "bold" },
  diagnosisBox: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    borderLeft: "5px solid #2d6a4f",
  },
  diagnosisTitle: { margin: "0 0 10px 0", color: "#2d6a4f" },
  diagnosisText: { margin: 0, whiteSpace: "pre-line", fontSize: "14px", lineHeight: "1.6" },
};