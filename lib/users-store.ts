import { put, list, del, get } from "@vercel/blob";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const PREFIX = "users/";

export type Role = "admin" | "vendedor";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
};

export type SafeUser = Omit<User, "passwordHash">;

function pathFor(id: string) {
  return `${PREFIX}${id}.json`;
}

export async function listUsers(): Promise<User[]> {
  const { blobs } = await list({ prefix: PREFIX });
  const users = await Promise.all(
    blobs.map(async (b) => {
      const result = await get(b.pathname, { access: "private", useCache: false });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as User;
    })
  );
  return users.filter((u): u is User => u !== null);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await listUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await get(pathFor(id), { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as User;
}

export async function createUser(params: {
  email: string;
  name: string;
  role: Role;
  password: string;
}): Promise<User> {
  const existing = await getUserByEmail(params.email);
  if (existing) {
    throw new Error("Ya existe un usuario con ese email");
  }
  const user: User = {
    id: randomUUID().slice(0, 8),
    email: params.email.toLowerCase(),
    name: params.name,
    role: params.role,
    passwordHash: await bcrypt.hash(params.password, 10),
    createdAt: new Date().toISOString(),
  };
  await put(pathFor(user.id), JSON.stringify(user, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return user;
}

export async function deleteUser(id: string) {
  await del(pathFor(id));
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export function toSafeUser(user: User): SafeUser {
  const { passwordHash, ...safe } = user;
  return safe;
}
