import {
  addHabit,
  getHabits,
  getTodayHabits,
  updateHabit,
} from "../habits.helper.js";

export async function habitsRoute(fastify) {
  // Route pour récupérer toutes les habitudes créées
  fastify.get("/", async (request, reply) => {
    try {
      const habits = await getHabits();

      return habits;
    } catch (error) {
      reply.code(400).send({
        error: error.message,
      });
    }
  });

  // Route pour récupérer les habitudes du jour
  fastify.get("/today", async (request, reply) => {
    try {
      const todayHabits = await getTodayHabits();

      return todayHabits;
    } catch (error) {
      reply.code(400).send({
        error: error.message,
      });
    }
  });

  // Route pour créer un habitude
  fastify.post("/", async (request, reply) => {
    const body = request.body;
    console.log(body);

    if (body.title === undefined) {
      reply.code(400).send({
        error: "Title is required in the body",
      });
    }

    try {
      const newHabit = await addHabit(body.title);

      return newHabit;
    } catch (error) {
      reply.code(400).send({
        error: error.message,
      });
    }
  });

  // Route pour modifier une habitude
  fastify.patch("/:habitId", async (request, reply) => {
    const body = request.body;

    if (body.done === undefined) {
      reply.code(400).send({
        error: "done is required in the body",
      });
    }

    if (typeof body.done !== "boolean") {
      reply.code(400).send({
        error: "done value in the body must be a boolean",
      });
    }

    const habitId = Number(request.params.habitId);

    if (!habitId || Number.isNaN(habitId)) {
      reply.code(400).send({
        error: "habitID params must be a number",
      });
    }

    try {
      const updatedHabit = await updateHabit(habitId, body.done);

      return updatedHabit;
    } catch (error) {
      reply.code(400).send({
        error: error.message,
      });
    }
  });
}
