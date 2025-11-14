// Réalisé par Eloane

import { Author, demoAuthors } from "./author";

export type BookCategory = "novel" | "history" | "science" | "poetry";

export interface Book {
  id: number;
  title: string;
  author: Author;
  available: boolean;
  categories: BookCategory[];
}

export const isValidCategory = (cat: BookCategory): boolean => {
  return ["novel", "history", "science", "poetry"].includes(cat);
};

export const demoBooks: Book[] = [
{
    id: 101,
    title: "Notre-Dame de Paris",
    author: demoAuthors[0],
    available: true,
    categories: ["novel"]
  },
  {
    id: 102,
    title: "Le Deuxième Sexe",
    author: demoAuthors[1],
    available: true,
    categories: ["history", "science"]
  },
  {
    id: 103,
    title: "L'Étranger",
    author: demoAuthors[2],
    available: false,
    categories: ["novel"]
  }
];