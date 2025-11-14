// Réalisé par Thibaud

import readline from "readline";
import { createDemoLibrary, Library } from "./library";
import { Student, demoStudents } from "./user";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt: string): Promise<string> =>
  new Promise((resolve) => rl.question(prompt, resolve));

const library: Library = createDemoLibrary();

const selectStudent = async (): Promise<Student | undefined> => {
  console.log("Etudiants disponibles:");
  demoStudents.forEach((student) =>
    console.log(`${student.id} - ${student.getFullName()}`)
  );
  const id = Number(await question("Choisissez l'identifiant etudiant: "));
  const student = demoStudents.find((item) => item.id === id);
  if (!student) {
    console.log("Etudiant inconnu.");
  }
  return student;
};

const listAvailable = (): void => {
  const titles = library.listAvailable().map((book) => `${book.id} - ${book.title}`);
  if (titles.length === 0) {
    console.log("Aucun livre disponible.");
    return;
  }
  console.log("Livres disponibles:");
  titles.forEach((title) => console.log(`- ${title}`));
};

const borrowFlow = async (): Promise<void> => {
  const student = await selectStudent();
  if (!student) {
    return;
  }
  const bookId = Number(await question("Id du livre a emprunter: "));
  try {
    const loan = library.borrowBook(bookId, student);
    console.log(
      `${student.getFullName()} emprunte ${loan.book.title}. Retour attendu le ${loan.dueDate.toDateString()}`
    );
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
  }
};

const returnFlow = async (): Promise<void> => {
  const bookId = Number(await question("Id du livre a retourner: "));
  const loan = library.returnBook(bookId);
  if (!loan) {
    console.log("Aucun pret en cours pour ce livre.");
  } else {
    console.log(`Retour enregistre pour ${loan.book.title}.`);
  }
};

const reserveFlow = async (): Promise<void> => {
  const student = await selectStudent();
  if (!student) {
    return;
  }
  const bookId = Number(await question("Id du livre a reserver: "));
  try {
    const reservation = library.reserveBook(bookId, student);
    console.log(
      `${student.getFullName()} rejoint la file pour le livre ${reservation.bookId}`
    );
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
  }
};

const showReservations = (): void => {
  const reservations = library.getReservations();
  if (reservations.length === 0) {
    console.log("Aucune reservation en cours.");
    return;
  }
  console.log("Reservations en attente:");
  reservations.forEach((reservation) =>
    console.log(
      `- Livre ${reservation.bookId} pour ${reservation.student.getFullName()} (depuis ${reservation.requestedAt.toDateString()})`
    )
  );
};

const showPenalties = (): void => {
  const penalties = library.getPenalties();
  if (penalties.length === 0) {
    console.log("Aucun retard detecte aujourd'hui.");
    return;
  }
  console.log("Retards et penalites actuels:");
  penalties.forEach(({ loan, penalty }) =>
    console.log(
      `- ${loan.book.title} (emprunte par ${loan.student.getFullName()}): ${penalty}€`
    )
  );
};

const menuLoop = async (): Promise<void> => {
  while (true) {
    console.log(`
=== Menu Bibliotheque ===
1. Lister les livres disponibles
2. Emprunter un livre
3. Retourner un livre
4. Reserver un livre
5. Voir les reservations
6. Voir les retards et penalites
7. Quitter
`);
    const choice = await question("Votre choix: ");
    switch (choice.trim()) {
      case "1":
        listAvailable();
        break;
      case "2":
        await borrowFlow();
        break;
      case "3":
        await returnFlow();
        break;
      case "4":
        await reserveFlow();
        break;
      case "5":
        showReservations();
        break;
      case "6":
        showPenalties();
        break;
      case "7":
        console.log("Au revoir !");
        rl.close();
        return;
      default:
        console.log("Choix invalide.");
    }
  }
};

menuLoop();
