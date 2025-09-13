const express = require("express")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")
const authRoutes = require("./routes/auth")
const debtRoutes = require("./routes/debts")
require("dotenv").config()

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 3000

app.use(
	cors({
		origin: "http://localhost:4200", // permite Angular
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	})
)

app.use(express.json())

// Rutas
app.use("/auth", authRoutes)
app.use("/debts", debtRoutes)

app.get("/", (req, res) => res.send("API running 🚀"))

app.listen(port, () => console.log(`API running on port ${port}`))
