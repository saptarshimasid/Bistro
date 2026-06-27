import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { initDb, loadAllData, saveDataKey } from "./db";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(express.json());

// Initialize Gemini client (server-side only)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API: AI Auto-Price Suggestion Route
app.post("/api/ai/auto-price", async (req, res) => {
  try {
    const { 
      menuItemName, 
      description, 
      category, 
      selectedIngredients, 
      profitMargin, 
      availableInventory 
    } = req.body;

    if (!menuItemName) {
      return res.status(400).json({ error: "Menu item name is required" });
    }

    const marginValue = profitMargin || 70; // Default to 70% desired profit margin
    const ai = getGeminiClient();

    let prompt = "";
    if (selectedIngredients && selectedIngredients.length > 0) {
      prompt = `
        You are a restaurant pricing consultant.
        Calculate the optimal menu price for the following menu item:
        - Name: "${menuItemName}"
        - Category: "${category}"
        - Description: "${description || 'N/A'}"
        - Desired Profit Margin: ${marginValue}% (meaning raw cost should be ${100 - marginValue}% of the retail price)

        The user has selected the following specific ingredients from the inventory:
        ${JSON.stringify(selectedIngredients, null, 2)}

        Calculate the total cost of these ingredients based on their quantities and unit costs.
        Then, calculate the suggested retail price that achieves the desired ${marginValue}% profit margin.
        Formula: Suggested Price = Total Ingredient Cost / (1 - (Desired Margin / 100))
        
        Provide the calculation, cost contributions, and a clear pricing rationale.
      `;
    } else {
      prompt = `
        You are an expert culinary operations and pricing consultant.
        A chef wants to add a new menu item:
        - Name: "${menuItemName}"
        - Category: "${category}"
        - Description: "${description || 'N/A'}"
        - Desired Profit Margin: ${marginValue}% (meaning raw cost should be ${100 - marginValue}% of the retail price)

        Here is the restaurant's active raw stock inventory:
        ${JSON.stringify(availableInventory || [], null, 2)}

        Tasks:
        1. Identify which inventory ingredients from the list are likely used in this recipe.
        2. Estimate standard, realistic portion sizes/quantities of these ingredients for a single serving.
        3. Retrieve their corresponding "unitCost" to find the total food cost.
        4. If some standard ingredients are missing from the inventory list, use realistic market prices for them, but mark them as "estimated/off-inventory" items.
        5. Calculate the suggested retail price to meet the ${marginValue}% profit margin.
           Formula: Suggested Price = Total Ingredient Cost / (1 - (Desired Margin / 100))
        6. Return a comprehensive breakdown of the costs and the reasoning.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional restaurant revenue manager and executive chef. You specialize in menu engineering, costing, and strategic pricing. Always respond with valid JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["suggestedPrice", "totalCostOfIngredients", "calculatedMargin", "ingredientsUsed", "reasoning"],
          properties: {
            suggestedPrice: {
              type: Type.NUMBER,
              description: "The suggested optimal selling price for the menu item"
            },
            totalCostOfIngredients: {
              type: Type.NUMBER,
              description: "The total raw ingredient cost for a single portion"
            },
            calculatedMargin: {
              type: Type.NUMBER,
              description: "The exact profit margin achieved (equal to the desired profit margin)"
            },
            ingredientsUsed: {
              type: Type.ARRAY,
              description: "List of ingredients used in the cost breakdown",
              items: {
                type: Type.OBJECT,
                required: ["name", "quantityNeeded", "unit", "costContribution", "isFromInventory"],
                properties: {
                  name: { type: Type.STRING },
                  quantityNeeded: { type: Type.NUMBER, description: "Quantity used per serving" },
                  unit: { type: Type.STRING, description: "E.g., kg, unit, liter" },
                  costContribution: { type: Type.NUMBER, description: "Total cost of this ingredient in the serving" },
                  isFromInventory: { type: Type.BOOLEAN, description: "Whether this ingredient was matched from the active inventory list" }
                }
              }
            },
            reasoning: {
              type: Type.STRING,
              description: "Detailed, chef-professional breakdown of the recommended price, portion assumptions, and profitability"
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    const pricingData = JSON.parse(resultText.trim());
    res.json(pricingData);

  } catch (error: any) {
    console.error("AI Auto-Price Error:", error);
    res.status(500).json({ 
      error: "Failed to generate price suggestion. Please ensure GEMINI_API_KEY is configured properly.",
      details: error?.message || String(error)
    });
  }
});

// API: AI Smart Roster Scheduling Route
app.post("/api/ai/smart-schedule", async (req, res) => {
  try {
    const { staff, orders } = req.body;

    if (!staff || !Array.isArray(staff)) {
      return res.status(400).json({ error: "Staff list is required and must be an array" });
    }

    // Pre-process orders to extract hour of day and day of week distributions
    const hourlyOrders: { [key: string]: number } = {};
    const dailyOrders: { [key: string]: number } = {};
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let validOrdersCount = 0;
    (orders || []).forEach((o: any) => {
      if (!o.createdAt || o.status === "Cancelled") return;
      try {
        const d = new Date(o.createdAt);
        const hour = d.getHours();
        const hourLabel = `${String(hour).padStart(2, "0")}:00`;
        hourlyOrders[hourLabel] = (hourlyOrders[hourLabel] || 0) + 1;

        const day = weekdays[d.getDay()];
        dailyOrders[day] = (dailyOrders[day] || 0) + 1;
        validOrdersCount++;
      } catch {}
    });

    const ai = getGeminiClient();

    const prompt = `
      You are an expert restaurant operations planner and labor optimization consultant.
      Your task is to analyze historical order volume peaks and automatically design an optimal shift schedule for our staff roster.

      Here is the historical order data parsed from our active ReportsView:
      - Total completed orders analyzed: ${validOrdersCount}
      - Daily order counts: ${JSON.stringify(dailyOrders)}
      - Hourly order counts: ${JSON.stringify(hourlyOrders)}

      If the above distribution has low data points, assume standard fine-dining peaks:
      - Lunch Rush: 11:30 AM - 02:30 PM (High demand, high ticket throughput)
      - Dinner Rush: 05:30 PM - 09:30 PM (Critical demand, premium Wagyu/Steak focus, requires top Chefs & Waiters)
      - Late Lounge: 09:30 PM - 12:00 AM (Medium demand, high cocktail/beverage focus)

      Here is our active staff roster:
      ${JSON.stringify(staff, null, 2)}

      Tasks:
      1. Predict 3 major peak intensity periods based on the order timings.
      2. Recommend an optimal shift timing assignment for each employee in the staff roster. The standard shifts to choose from are:
         - "08:00 AM - 04:00 PM" (Morning Shift: heavy kitchen prep, lunch service)
         - "11:00 AM - 07:00 PM" (Day Shift: covers both lunch and dinner transition)
         - "04:00 PM - 12:00 AM" (Evening Shift: heavy dinner rush, closing)
         - "12:00 PM - 10:00 PM" (Double/Split/Chef Shift: coverage for entire high-intensity core day)
         Or suggest a custom shift if it fits their role better!
      3. Strategically place higher-rated employees (performanceRating) and align staff counts with the peak periods (e.g. more waiters and chefs during the Dinner Rush than the Morning shift).
      4. Compute a capacity coverage score for each shift (Morning, Day, Evening).
      5. Provide an executive summary of your labor strategy.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional hospitality consultant and senior restaurant operations scheduler. Always respond with valid JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["predictedPeaks", "scheduleSuggestions", "capacityCoverage", "executiveSummary"],
          properties: {
            predictedPeaks: {
              type: Type.ARRAY,
              description: "The identified high-volume peak times predicted from reports analytics",
              items: {
                type: Type.OBJECT,
                required: ["timeRange", "intensity", "description"],
                properties: {
                  timeRange: { type: Type.STRING, description: "e.g. 12:00 PM - 02:00 PM" },
                  intensity: { type: Type.STRING, description: "Low, Medium, High, Critical" },
                  description: { type: Type.STRING, description: "What is happening during this peak (e.g. Lunch rush, cocktail hours)" }
                }
              }
            },
            scheduleSuggestions: {
              type: Type.ARRAY,
              description: "The suggested shift assignments for each member of the staff roster",
              items: {
                type: Type.OBJECT,
                required: ["staffId", "staffName", "role", "suggestedShift", "reason"],
                properties: {
                  staffId: { type: Type.STRING },
                  staffName: { type: Type.STRING },
                  role: { type: Type.STRING },
                  suggestedShift: { type: Type.STRING, description: "e.g. 04:00 PM - 12:00 AM" },
                  reason: { type: Type.STRING, description: "Specific, professional reason for this assignment based on role and rating" }
                }
              }
            },
            capacityCoverage: {
              type: Type.ARRAY,
              description: "The analyzed coverage levels across standard shift blocks",
              items: {
                type: Type.OBJECT,
                required: ["shiftName", "staffCount", "coverageLevel"],
                properties: {
                  shiftName: { type: Type.STRING, description: "e.g. Morning, Day, Evening" },
                  staffCount: { type: Type.NUMBER, description: "Number of staff members assigned to this shift" },
                  coverageLevel: { type: Type.STRING, description: "e.g. Understaffed, Optimal, Robust" }
                }
              }
            },
            executiveSummary: {
              type: Type.STRING,
              description: "Strategic overview explanation of how this layout maximizes profit, speed, and lowers cost"
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    const scheduleData = JSON.parse(resultText.trim());
    res.json(scheduleData);

  } catch (error: any) {
    console.error("AI Smart Scheduling Error:", error);
    res.status(500).json({
      error: "Failed to generate smart schedule recommendations. Please verify your GEMINI_API_KEY is configured.",
      details: error?.message || String(error)
    });
  }
});

// API: Get all restaurant data from the database
app.get("/api/data", async (req, res) => {
  try {
    const data = await loadAllData();
    res.json(data);
  } catch (error: any) {
    console.error("Failed to load restaurant data:", error);
    res.status(500).json({ error: "Failed to load restaurant data", details: error?.message });
  }
});

// API: Save restaurant data collection to the database
app.post("/api/save", async (req, res) => {
  const { key, data } = req.body;
  try {
    if (!key) {
      return res.status(400).json({ error: "Key is required" });
    }
    await saveDataKey(key, data);
    res.json({ success: true, message: `Successfully saved ${key} data.` });
  } catch (error: any) {
    console.error(`Failed to save data for key ${key}:`, error);
    res.status(500).json({ error: `Failed to save data for key ${key}`, details: error?.message });
  }
});

// Start Vite dev server or serve production build
async function startServer() {
  // Initialize and seed database
  await initDb();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving compiled production assets.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DineFlow full-stack server listening on host 0.0.0.0 port ${PORT}`);
  });
}

startServer();
