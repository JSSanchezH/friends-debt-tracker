const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const crypto = require("crypto")

const router = express.Router()
const prisma = new PrismaClient()

// Llave para cifrar/descifrar emails (simétrica, secreta)
const EMAIL_SECRET = process.env.EMAIL_SECRET

// Función para cifrar
function encryptEmail(email) {
	const cipher = crypto.createCipheriv(
		"aes-256-gcm",
		Buffer.from(EMAIL_SECRET, "utf8"),
		Buffer.alloc(16, 0)
	)
	let encrypted = cipher.update(email, "utf8", "hex")
	encrypted += cipher.final("hex")
	return encrypted
}

// Función para descifrar
function decryptEmail(encrypted) {
	const decipher = crypto.createDecipheriv(
		"aes-256-gcm",
		Buffer.from(EMAIL_SECRET, "utf8"),
		Buffer.alloc(16, 0)
	)
	let decrypted = decipher.update(encrypted, "hex", "utf8")
	decrypted += decipher.final("utf8")
	return decrypted
}

// POST /auth/register
router.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body

		// Encriptar email y password
		const encryptedEmail = encryptEmail(email)
		const hashedPassword = await bcrypt.hash(password, 10)

		const user = await prisma.user.create({
			data: {
				email: encryptedEmail,
				password: hashedPassword,
			},
		})

		res.json({
			id: user.id,
			email: email,
			createdAt: user.createdAt,
		})
	} catch (err) {
		res
			.status(400)
			.json({ error: "User already exists or invalid data" })
	}
})

// POST /auth/login
router.post("/login", async (req, res) => {
	const { email, password } = req.body
	const encryptedEmail = encryptEmail(email)

	const user = await prisma.user.findUnique({
		where: { email: encryptedEmail },
	})
	if (!user) return res.status(404).json({ error: "User not found" })

	const valid = await bcrypt.compare(password, user.password)
	if (!valid)
		return res.status(401).json({ error: "Invalid password" })

	const token = jwt.sign(
		{ id: user.id, email },
		process.env.JWT_SECRET
	)

	res.json({ token })
})

module.exports = router
