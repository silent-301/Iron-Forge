import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = path.join(process.cwd(), ".data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readAll<T extends { _id?: string }>(collection: string): T[] {
  ensureDir();
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return [];
  }
}

function writeAll<T>(collection: string, data: T[]): void {
  ensureDir();
  fs.writeFileSync(filePath(collection), JSON.stringify(data, null, 2), "utf-8");
}

export interface Document {
  _id: string;
  [key: string]: unknown;
}

export class Collection<T extends Document> {
  private collection: string;
  private pkField: string;

  constructor(collection: string, pkField = "_id") {
    this.collection = collection;
    this.pkField = pkField;
  }

  private all(): T[] {
    return readAll<T>(this.collection);
  }

  private save(data: T[]): void {
    writeAll(this.collection, data);
  }

  private ensureId(doc: Partial<T>): T {
    const d = { ...doc } as T;
    if (!d[this.pkField as keyof T]) {
      (d as any)[this.pkField] = uuidv4();
    }
    return d;
  }

  find(filter?: Partial<T>): T[] {
    const all = this.all();
    if (!filter || Object.keys(filter).length === 0) return all;
    return all.filter((doc) => {
      return Object.entries(filter).every(([key, val]) => {
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          const objVal = val as Record<string, unknown>;
          const docVal = (doc as any)[key];
          if (typeof docVal === "object" && docVal !== null) {
            return Object.entries(objVal).every(([k, v]) => {
              if (k === "$gte") return docVal >= v;
              if (k === "$lte") return docVal <= v;
              if (k === "$search") {
                const searchStr = String(v).toLowerCase();
                return (
                  String(docVal).toLowerCase().includes(searchStr) ||
                  (Array.isArray(docVal) &&
                    docVal.some((t: string) =>
                      t.toLowerCase().includes(searchStr)
                    ))
                );
              }
              return docVal === v;
            });
          }
          if (k === "$gte") return docVal >= v;
          if (k === "$lte") return docVal <= v;
          return docVal === v;
        }
        if (key === "$text") {
          const searchStr = ((val as any).$search || "").toLowerCase();
          if (!searchStr) return true;
          const d = doc as any;
          return (
            String(d.name || "").toLowerCase().includes(searchStr) ||
            String(d.description || "").toLowerCase().includes(searchStr) ||
            (Array.isArray(d.tags) &&
              d.tags.some((t: string) =>
                t.toLowerCase().includes(searchStr)
              ))
          );
        }
        return (doc as any)[key] === val;
      });
    });
  }

  findById(id: string): T | null {
    return this.all().find((d) => d._id === id) || null;
  }

  findOne(filter: Partial<T>): T | null {
    const results = this.find(filter);
    return results.length > 0 ? results[0] : null;
  }

  create(doc: Partial<T>): T {
    const all = this.all();
    const newDoc = this.ensureId(doc);
    newDoc.createdAt = new Date().toISOString() as any;
    newDoc.updatedAt = new Date().toISOString() as any;
    all.push(newDoc);
    this.save(all);
    return newDoc;
  }

  findByIdAndUpdate(id: string, update: Partial<T>, options?: { new?: boolean }): T | null {
    const all = this.all();
    const idx = all.findIndex((d) => d._id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...update, updatedAt: new Date().toISOString() as any };
    this.save(all);
    return options?.new !== false ? all[idx] : null;
  }

  findByIdAndDelete(id: string): T | null {
    const all = this.all();
    const idx = all.findIndex((d) => d._id === id);
    if (idx === -1) return null;
    const deleted = all.splice(idx, 1)[0];
    this.save(all);
    return deleted;
  }

  countDocuments(filter?: Partial<T>): number {
    if (!filter || Object.keys(filter).length === 0) return this.all().length;
    return this.find(filter).length;
  }

  sort(data: T[], sortObj: Record<string, 1 | -1>): T[] {
    const keys = Object.keys(sortObj);
    return [...data].sort((a, b) => {
      for (const key of keys) {
        const dir = sortObj[key];
        const aVal = (a as any)[key];
        const bVal = (b as any)[key];
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
      }
      return 0;
    });
  }

  deleteMany(): void {
    this.save([]);
  }
}

const collections: Record<string, Collection<any>> = {};

export function getCollection<T extends Document>(name: string): Collection<T> {
  if (!collections[name]) {
    collections[name] = new Collection<T>(name);
  }
  return collections[name];
}

export function initCollections(collections: string[]): void {
  ensureDir();
  for (const name of collections) {
    const fp = filePath(name);
    if (!fs.existsSync(fp)) {
      writeAll(name, []);
    }
  }
}
