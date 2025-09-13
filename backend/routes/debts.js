const express = require("express")
const { PrismaClient } = require("@prisma/client")
const auth = require("../middleware/auth")

const router = express.Router()
const prisma = new PrismaClient()

// Middleware de auth en todas las rutas
router.use(auth)

// POST /debts → crear deuda
router.post("/", async (req, res) => {
	const { amount, currency, description, dueDate } = req.body

	if (amount <= 0)
		return res.status(400).json({ error: "Debt cannot be negative" })

	try {
		const debt = await prisma.debt.create({
			data: {
				amount,
				currency: currency || undefined,
				description,
				dueDate: dueDate ? new Date(dueDate) : null,
				userId: req.user.id,
			},
		})
		res.json(debt)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

// GET /debts → listar todas las deudas del usuario
router.get("/", async (req, res) => {
	const debts = await prisma.debt.findMany({
		where: { userId: req.user.id },
	})
	res.json(debts)
})

// PUT /debts/:id → editar deuda (si no está pagada)
router.put("/:id", async (req, res) => {
	const { id } = req.params
	const existing = await prisma.debt.findUnique({ where: { id } })
	if (!existing || existing.userId !== req.user.id) {
		return res.status(404).json({ error: "Debt not found" })
	}
	if (existing.paid)
		return res.status(400).json({ error: "Cannot edit a paid debt" })

	const { amount, currency, description, dueDate } = req.body
	if (amount <= 0)
		return res.status(400).json({ error: "Debt cannot be negative" })

	const updated = await prisma.debt.update({
		where: { id },
		data: {
			amount,
			currency,
			description,
			dueDate: dueDate ? new Date(dueDate) : null,
		},
	})
	res.json(updated)
})

// DELETE /debts/:id
router.delete("/:id", async (req, res) => {
	const { id } = req.params
	const existing = await prisma.debt.findUnique({ where: { id } })
	if (!existing || existing.userId !== req.user.id) {
		return res.status(404).json({ error: "Debt not found" })
	}
	await prisma.debt.delete({ where: { id } })
	res.json({ message: "Debt deleted" })
})

// PATCH /debts/:id/pay → marcar como pagada
router.patch("/:id/pay", async (req, res) => {
	const { id } = req.params
	const existing = await prisma.debt.findUnique({ where: { id } })
	if (!existing || existing.userId !== req.user.id) {
		return res.status(404).json({ error: "Debt not found" })
	}
	if (existing.paid)
		return res.status(400).json({ error: "Debt already paid" })

	const updated = await prisma.debt.update({
		where: { id },
		data: { paid: true, paidAt: new Date() },
	})
	res.json(updated)
})

module.exports = router
