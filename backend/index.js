import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend access

/**
 * 🎲 Roll Dice API
 * Receives: publicSeed from frontend
 * Returns: hash, dice roll, and secretSeed for verification
 */
app.post("/roll-dice", (req, res) => {
  const { publicSeed } = req.body;
  if (!publicSeed) return res.status(400).json({ error: "Public seed required" });

  const secretSeed = crypto.randomBytes(16).toString("hex"); // Generate a secure secret seed
  const hash = crypto.createHash("sha256").update(secretSeed + publicSeed).digest("hex");
  const diceRoll = (parseInt(hash.substring(0, 8), 16) % 6) + 1; // Convert hash to a number between 1-6

  res.json({ hash, diceRoll, secretSeed }); // Return secretSeed immediately
});

/**
 * ✅ Verify Fairness API
 * Receives: publicSeed & secretSeed
 * Returns: computed hash (should match original hash)
 */
app.post("/verify-roll", (req, res) => {
  const { publicSeed, secretSeed } = req.body;
  if (!publicSeed || !secretSeed) return res.status(400).json({ error: "Both publicSeed and secretSeed required" });

  const computedHash = crypto.createHash("sha256").update(secretSeed + publicSeed).digest("hex");
  res.json({ computedHash });
});

app.listen(3001, () => console.log("🎲 Dice Game Backend running on http://localhost:3001"));
