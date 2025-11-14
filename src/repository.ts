// Réalisé par Thibaud

export class Repository<T extends { id: number }> {
  private storage = new Map<number, T>();

  add(item: T): void {
    if (this.storage.has(item.id)) {
      throw new Error(`L'identifiant ${item.id} existe deja`);
    }
    this.storage.set(item.id, item);
  }

  getAll(): T[] {
    return Array.from(this.storage.values());
  }

  getById(id: number): T | undefined {
    return this.storage.get(id);
  }

  find(predicate: (item: T) => boolean): T | undefined {
    for (const item of this.storage.values()) {
      if (predicate(item)) {
        return item;
      }
    }
    return undefined;
  }

  remove(id: number): boolean {
    return this.storage.delete(id);
  }
}
