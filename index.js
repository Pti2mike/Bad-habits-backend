import cors from "@fastify/cors";
import Fastify from "fastify";
import { habitsRoute } from "./routes/habits.js";
// import database from "./database.json" assert { type: "json" };

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
await fastify.register(habitsRoute, { prefix: "/habits" });

// Test si le serveur fonctionne
fastify.get("/", async () => {
  // return { hello: "world" };
  return "Welcome! You are Habit tracker backends.";
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
