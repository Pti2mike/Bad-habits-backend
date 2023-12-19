/*
// Pour les fonctions qui vont intéragir avec la database

// prend un id et un paramètre done et qui ajoute ou modifie la date du jour dans l'objet doneDays de l'habitude
const updateHabit = () => {};
*/

import path from "path";
import fs from "fs/promises";

const databaseFile = path.join(process.cwd(), "database.json");

const readDatabase = async () => {
  const database = await fs.readFile(databaseFile, "utf-8");

  const json = JSON.parse(database);

  return json;
};

// Fonction pour écrire dans la DB
const writeDatabase = async (newDatabase) => {
  const database = await readDatabase();

  await fs.writeFile(
    databaseFile,
    JSON.stringify(
      {
        ...database,
        ...newDatabase,
      },
      null,
      2
    )
  );
};

export const getHabits = async () => {
  const database = await readDatabase();
  return database.habits;
};

export const getTodayHabits = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const habits = await getHabits();

  return habits.map((habit) => {
    return {
      id: habit.id,
      title: habit.title,
      done: habit.daysDone[today] || false,
    };
  });
};

export const addHabit = async (title) => {
  const habits = await getHabits();

  const newHabit = {
    id: (habits[habits.length - 1].id || 0) + 1,
    title,
    daysDone: {},
  };

  habits.push(newHabit);

  await writeDatabase({ habits });

  return newHabit;
};

export const updateHabit = async (habitId, done) => {
  const habits = await getHabits();
  const habitToEdit = habits.find((a) => a.id === habitId);

  if (!habitToEdit) {
    throw new Error("HabitId is invalid");
  }

  const today = new Date().toISOString().slice(0, 10);

  habitToEdit.daysDone[today] = done;

  await writeDatabase({ habits });

  return habitToEdit;
};
