// Réalisé par Eloane

export interface Author {
  id: number;
  name: string;
  birthYear?: number;
}

export const demoAuthors: Author[] = [
  { id: 1, name: "Victor Hugo", birthYear: 1802 },
  { id: 2, name: "Simone de Beauvoir", birthYear: 1908 },
  { id: 3, name: "Albert Camus" }
];