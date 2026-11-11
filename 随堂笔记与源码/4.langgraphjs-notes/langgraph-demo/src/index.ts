import "dotenv/config"

console.log(1)

// 只要是用模型，都需要三个东西
// 1. model
// 2. apiKey
// 3. baseURL
console.log(process.env.MODEL)
console.log(process.env.API_KEY)
console.log(process.env.BASE_URL)