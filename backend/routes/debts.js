const express = require("express")
const { PrismaClient } = require("@prisma/client")
const auth = require("../middleware/auth")
const redisClient = require("../cache")

const router = express.Router()
const prisma = new PrismaClient()

// TTL en segundos para el cache
const CACHE_TTL = 300

// Helper: clave de cache por usuario
const debtCacheKey = (userId) => `debts:${userId}`

// Middleware de autenticación en todas las rutas
router.use(auth)

// POST /debts → crear deuda
router.post("/", async (req, res) => {
	const { amount, currency, description, dueDate } = req.body

	if (!amount || amount <= 0)
		return res
			.status(400)
			.json({ error: "Debt must be greater than 0" })

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

		// Limpiar cache
		await redisClient.del(debtCacheKey(req.user.id))

		res.status(201).json(debt)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

// GET /debts → listar todas las deudas del usuario
router.get("/", async (req, res) => {
	try {
		// Revisar cache
		const cached = await redisClient.get(debtCacheKey(req.user.id))
		if (cached) return res.json(JSON.parse(cached))

		// Si no hay cache, consultar DB
		const debts = await prisma.debt.findMany({
			where: { userId: req.user.id },
		})

		// Guardar en cache
		await redisClient.setEx(
			debtCacheKey(req.user.id),
			CACHE_TTL,
			JSON.stringify(debts)
		)

		res.json(debts)
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch debts" })
	}
})

router.get("/:id", async (req, res) => {
	const { id } = req.params
	try {
		const debt = await prisma.debt.findUnique({
			where: { id },
		})

		if (!debt || debt.userId !== req.user.id)
			return res.status(404).json({ error: "Debt not found" })

		res.json(debt)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

// PUT /debts/:id → actualizar deuda
router.put("/:id", async (req, res) => {
	const { id } = req.params
	const { amount, currency, description, dueDate } = req.body

	if (!amount || amount <= 0)
		return res
			.status(400)
			.json({ error: "Debt must be greater than 0" })

	try {
		const existing = await prisma.debt.findUnique({ where: { id } })
		if (!existing || existing.userId !== req.user.id)
			return res.status(404).json({ error: "Debt not found" })
		if (existing.paid)
			return res
				.status(400)
				.json({ error: "Cannot edit a paid debt" })

		const updated = await prisma.debt.update({
			where: { id },
			data: {
				amount,
				currency: currency || existing.currency,
				description: description || existing.description,
				dueDate: dueDate ? new Date(dueDate) : existing.dueDate,
			},
		})

		await redisClient.del(debtCacheKey(req.user.id))
		res.json(updated)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

// DELETE /debts/:id
router.delete("/:id", async (req, res) => {
	const { id } = req.params
	try {
		const existing = await prisma.debt.findUnique({ where: { id } })
		if (!existing || existing.userId !== req.user.id)
			return res.status(404).json({ error: "Debt not found" })

		await prisma.debt.delete({ where: { id } })
		await redisClient.del(debtCacheKey(req.user.id))
		res.json({ message: "Debt deleted" })
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

// PATCH /debts/:id/pay → marcar como pagada
router.patch("/:id/pay", async (req, res) => {
	const { id } = req.params
	try {
		const existing = await prisma.debt.findUnique({ where: { id } })
		if (!existing || existing.userId !== req.user.id)
			return res.status(404).json({ error: "Debt not found" })
		if (existing.paid)
			return res.status(400).json({ error: "Debt already paid" })

		const updated = await prisma.debt.update({
			where: { id },
			data: { paid: true, paidAt: new Date() },
		})

		await redisClient.del(debtCacheKey(req.user.id))
		res.json(updated)
	} catch (err) {
		res.status(400).json({ error: err.message })
	}
})

module.exports = router
