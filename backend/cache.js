const { createClient } = require("redis")

const redisClient = createClient({
	url: `redis://redis:6379`, // el nombre del servicio en docker-compose
})

redisClient.on("error", (err) =>
	console.error("Redis Client Error", err)
)

;(async () => {
	await redisClient.connect()
})()

module.exports = redisClient
