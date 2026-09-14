import express from "express";
import { leerJson, escribirJson } from "../utilidades/archivos.mjs";

const router = express.Router();
const rutaVentas = new URL("../ventas.json", import.meta.url);
const rutaUsuarios = new URL("../usuarios.json", import.meta.url);
const rutaProductos = new URL("../productos.json", import.meta.url);

router.get("/", async (req, res) => {
  const ventas = await leerJson(rutaVentas);
  res.json(ventas);
});

router.get("/:id", async (req, res) => {
  const ventas = await leerJson(rutaVentas);
  const id = Number(req.params.id);
  const venta = ventas.find((item) => item.id === id);

  if (!venta) {
    return res.status(404).json({ error: "Venta no encontrada" });
  }

  res.json(venta);
});

router.post("/", async (req, res) => {
  const { id_usuario, direccion, productos, pagada = false } = req.body;

  if (
    !Number.isInteger(id_usuario) ||
    !direccion ||
    !Array.isArray(productos) ||
    productos.length === 0
  ) {
    return res.status(400).json({ error: "Datos de venta invalidos" });
  }

  const [ventas, usuarios, catalogo] = await Promise.all([
    leerJson(rutaVentas),
    leerJson(rutaUsuarios),
    leerJson(rutaProductos)
  ]);

  const usuario = usuarios.find((item) => item.id === id_usuario);

  if (!usuario) {
    return res.status(400).json({ error: "El usuario indicado no existe" });
  }

  let total = 0;
  const productosVenta = [];

  for (const item of productos) {
    if (!Number.isInteger(item.id_producto) || !Number.isInteger(item.cantidad) || item.cantidad <= 0) {
      return res.status(400).json({ error: "Producto o cantidad invalidos" });
    }

    const producto = catalogo.find((registro) => registro.id === item.id_producto);

    if (!producto) {
      return res.status(400).json({
        error: `El producto con id ${item.id_producto} no existe`
      });
    }

    total += producto.precio * item.cantidad;
    productosVenta.push({
      id_producto: item.id_producto,
      cantidad: item.cantidad
    });
  }

  const id = ventas.length
    ? Math.max(...ventas.map((item) => item.id)) + 1
    : 1001;

  const nuevaVenta = {
    id,
    id_usuario,
    fecha: new Date().toISOString().slice(0, 10),
    total,
    direccion,
    pagada: Boolean(pagada),
    enviada: false,
    productos: productosVenta
  };

  ventas.push(nuevaVenta);
  await escribirJson(rutaVentas, ventas);

  res.status(201).json(nuevaVenta);
});

export default router;
