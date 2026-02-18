<template>
  <div class="container">
    <h1>Mood Check-in</h1>

    <!-- Form Card -->
    <div class="card">
      <h2>How are you feeling today?</h2>

      <input v-model="name" type="text" placeholder="Your Name" />
      <textarea v-model="mood" placeholder="How are you feeling today?"></textarea>

      <button @click="submitMood" :disabled="loading">
        {{ loading ? "Submitting..." : "Submit" }}
      </button>

      <p v-if="aiMessage" class="ai-message">
        AI Advisor: {{ aiMessage }}
      </p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>
    </div>

    <!-- Mood History -->
    <div class="card">
      <h3>Mood History</h3>

      <p v-if="records.length === 0">
        No moods submitted yet.
      </p>

      <ul v-else>
        <li v-for="(r, index) in records" :key="index">
          <strong>{{ r.name || "Anonymous" }}</strong>
          -
          <span :class="moodClass(r.mood)">
            {{ r.mood || "No mood" }}
          </span>
          <em>
            ({{ formatDate(r.created_at) }})
          </em>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      name: "",
      mood: "",
      aiMessage: "",
      records: [],
      loading: false,
      errorMessage: ""
    };
  },

  methods: {
    async submitMood() {
      if (!this.name.trim() || !this.mood.trim()) {
        this.errorMessage = "Please fill both fields.";
        return;
      }

      this.loading = true;
      this.errorMessage = "";
      this.aiMessage = "";

      try {
        // Save mood
        // Save mood
await api.post("/records.php", {
  name: this.name.trim(),
  mood: this.mood.trim()
});


        // Get AI advice (safe)
        try {
          const res = await api.post("/ai-advice.php", {
  mood: this.mood.trim()
});


          this.aiMessage =
            res && res.data && res.data.advice
              ? res.data.advice
              : "No advice returned.";
        } catch (aiError) {
          console.error("AI error:", aiError);
          this.aiMessage = "AI advice unavailable.";
        }

        // Reset form
        this.name = "";
        this.mood = "";

        // Reload records
        await this.loadRecords();

      } catch (err) {
        console.error("Submit error:", err);
        this.errorMessage = "Failed to submit mood. Check backend.";
      } finally {
        this.loading = false;
      }
    },

    async loadRecords() {
  try {
    // ✅ Correct URL for XAMPP PHP backend
    const res = await api.get("/records.php");

    if (res && Array.isArray(res.data)) {
      this.records = res.data;
    } else {
      this.records = [];
    }
  } catch (err) {
    console.error("Load error:", err);
    this.records = [];
  }
},


    moodClass(mood) {
      if (!mood || typeof mood !== "string") return "mood-neutral";

      const m = mood.toLowerCase();

      if (m.includes("happy")) return "mood-happy";
      if (m.includes("sad")) return "mood-sad";
      if (m.includes("angry")) return "mood-angry";
      if (m.includes("anxious")) return "mood-anxious";
      if (m.includes("tired")) return "mood-tired";
      if (m.includes("calm")) return "mood-calm";
      if (m.includes("stressed")) return "mood-stressed";

      return "mood-neutral";
    },

    formatDate(date) {
      if (!date) return "";
      try {
        return new Date(date).toLocaleString();
      } catch {
        return "";
      }
    }
  },

  mounted() {
    this.loadRecords();
  }
};
</script>

<style>
.container {
  max-width: 500px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 6px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  min-height: 80px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  background: #333;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #888;
}

.ai-message {
  margin-top: 10px;
  color: #0066cc;
}

.error-message {
  margin-top: 10px;
  color: red;
}

.mood-happy { color: green; }
.mood-sad { color: red; }
.mood-angry { color: darkred; }
.mood-anxious { color: orange; }
.mood-tired { color: gray; }
.mood-calm { color: teal; }
.mood-stressed { color: purple; }
.mood-neutral { color: black; }

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

em {
  font-size: 12px;
  color: #666;
}
</style>
