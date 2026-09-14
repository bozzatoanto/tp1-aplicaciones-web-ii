import express from "express";
import { leerJson, escribirJson } from "../utilidades/archivos.mjs";

const router = express.Router();
const rutaProductos = new URL("../productos.json", import.meta.url);

router.get("/", async (req, res) => {
  const productos = await leerJson(rutaProductos);
  res.json(productos);
});

router.get("/:id", async (req, res) => {
  const productos = await leerJson(rutaProductos);
  const id = Number(req.params.id);
  const producto = productos.find((item) => item.id === id);

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(producto);
});

router.post("/", async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen } = req.body;

  if (
    !nombre ||
    !descripcion ||
    typeof precio !== "number" ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    precio < 0 ||
    !imagen
  ) {
    return res.status(400).json({ error: "Datos de producto invalidos" });
  }

  const productos = await leerJson(rutaProductos);
  const id = productos.length
    ? Math.max(...productos.map((item) => item.id)) + 1
    : 1;

  const nuevoProducto = {
    id,
    nombre,
    descripcion,
    precio,
    stock,
    imagen,
    disponible: stock > 0
  };

  productos.push(nuevoProducto);
  await escribirJson(rutaProductos, productos);

  res.status(201).json(nuevoProducto);
});

router.put("/:id", async (req, res) => {
  const productos = await leerJson(rutaProductos);
  const id = Number(req.params.id);
  const indice = productos.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const { nombre, descripcion, precio, stock, imagen } = req.body;

  if (precio !== undefined && (typeof precio !== "number" || precio < 0)) {
    return res.status(400).json({ error: "Precio invalido" });
  }

  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
    return res.status(400).json({ error: "Stock invalido" });
  }

  const productoActual = productos[indice];

  const productoActualizado = {
    ...productoActual,
    nombre: nombre ?? productoActual.nombre,
    descripcion: descripcion ?? productoActual.descripcion,
    precio: precio ?? productoActual.precio,
    stock: stock ?? productoActual.stock,
    imagen: imagen ?? productoActual.imagen
  };

  productoActualizado.disponible = productoActualizado.stock > 0;
  productos[indice] = productoActualizado;

  await escribirJson(rutaProductos, productos);

  res.json(productoActualizado);
});

export default router;
