// Réalisé par Thibaud

import { Author, demoAuthors } from "./author";
import { Book, demoBooks, BookCategory, isValidCategory } from "./book";
import { demoStudents, demoUsers, Librarian, Student, User } from "./user";
import { getActiveLoans, getLoansByStudent } from "./loan";
import { Library, demoLibrary } from "./library";
import { Repository } from "./repository";

const displayUsers = (users: User[]): void => {
  console.log("\nUtilisateurs et polymorphisme:");
  users.forEach((user) => {
    console.log(`- ${user.getFullName()} (${user.constructor.name})`);
    if (user instanceof Student) {
      console.log(`  -> ${user.study()}`);
    }
    if (user instanceof Librarian) {
      console.log(`  -> ${user.manage()}`);
    }
  });
};

const demoLibraryFlow = (library: Library): void => {
  console.log("\nCatalogue initial disponible:");
  console.log(library.listAvailable().map((book) => book.title));

  const newBook: Book = {
    id: 999,
    title: "Anthologie de la poesie",
    author: demoAuthors[0],
    available: true,
    categories: ["poetry"]
  };

  if (isValidCategory(newBook.categories[0] as BookCategory)) {
    library.addBook(newBook);
    console.log("Livre ajoute par la bibliotheque:", newBook.title);
  }

  const borrower = demoStudents[0];
  const availableBook = library.listAvailable().find((book) => book.available);
  if (availableBook) {
    const loan = library.borrowBook(availableBook.id, borrower);
    console.log(`\n${borrower.getFullName()} emprunte ${availableBook.title}`);
    console.log("Pret cree:", loan);

    const activeLoans = getActiveLoans(library.getLoans());
    console.log("Emprunts actifs:", activeLoans.map((l) => l.book.title));

    library.returnBook(availableBook.id);
    console.log(`Retour effectue pour ${availableBook.title}`);
  }

  const studentLoans = getLoansByStudent(library.getLoans(), borrower.id);
  console.log(
    `Pret(s) pour ${borrower.getFullName()} :`,
    studentLoans.map((loan) => ({
      livre: loan.book.title,
      statut: loan.status
    }))
  );
};

const demoRepositories = (): void => {
  const authorRepo = new Repository<Author>();
  demoAuthors.forEach((author) => authorRepo.add(author));
  console.log("\nRepository auteurs ->", authorRepo.getAll().map((a) => a.name));

  const bookRepo = new Repository<Book>();
  demoBooks.forEach((book) => bookRepo.add(book));
  const scienceBook = bookRepo.find((book) => book.categories.includes("science"));
  console.log("Recherche d'un livre scientifique:", scienceBook?.title);
};

const runDemo = (): void => {
  console.log("=== Prototype de Bibliotheque TypeScript ===");
  displayUsers(demoUsers);
  demoLibraryFlow(new Library(demoBooks, demoLibrary.getLoans()));
  demoRepositories();
};

runDemo();
