import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(error.message);
        else setMessage("✅ Check your email to confirm signup!");
      }
    } catch (err) {
      setMessage("Something went wrong. Try again!");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌾 AI Farmer Assistant</h1>
        <p style={styles.subtitle}>Smart farming advice powered by AI</p>

        <h2 style={styles.formTitle}>{isLogin ? "Login" : "Sign Up"}</h2>

        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && <p style={styles.message}>{message}</p>}

        <button style={styles.button} onClick={handleAuth} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login 🌱" : "Sign Up 🌱"}
        </button>

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span style={styles.switchLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f7f0",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: { color: "#2d6a4f", textAlign: "center", margin: "0 0 5px 0" },
  subtitle: { color: "#52b788", textAlign: "center", margin: "0 0 30px 0", fontSize: "14px" },
  formTitle: { color: "#333", margin: "0 0 20px 0" },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #52b788",
    fontSize: "15px",
    marginBottom: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#2d6a4f",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "5px",
  },
  message: { color: "#e63946", fontSize: "14px", margin: "0 0 10px 0" },
  switchText: { textAlign: "center", marginTop: "20px", color: "#555", fontSize: "14px" },
  switchLink: { color: "#2d6a4f", cursor: "pointer", fontWeight: "bold" },
};