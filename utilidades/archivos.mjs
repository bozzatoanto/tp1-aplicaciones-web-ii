import { readFile, writeFile } from "node:fs/promises";

export async function leerJson(ruta) {
  const contenido = await readFile(ruta, "utf-8");
  return JSON.parse(contenido);
}

export async function escribirJson(ruta, datos) {
  await writeFile(ruta, JSON.stringify(datos, null, 2) + "\n", "utf-8");
}
