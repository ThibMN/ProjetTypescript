// Réalisé par Agathe

export class User {
    public readonly id: number;
    public firstName: string;
    public lastName: string;
    private _age = 0;

    constructor(id: number, firstName: string, lastName: string, age: number) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    get age(): number {
        return this._age;
    }

    set age(value: number) {
        if (value < 0) {
            throw new Error("L'age doit etre positif");
        }
        this._age = value;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}

export class Student extends User {
    study(): string {
        return `${this.getFullName()} etudie.`;
    }
}

export class Librarian extends User {
    manage(): string {
        return `${this.getFullName()} gere la bibliotheque.`;
    }
}

export const demoUsers: User[] = [
    new Student(1, "Agathe", "Le Goff", 20),
    new Student(2, "Eloane", "Ducrocq", 22),
    new Librarian(3, "Rayan", "kwasnik", 35)
];

export const demoStudents: Student[] = demoUsers.filter(
    (user): user is Student => user instanceof Student
);