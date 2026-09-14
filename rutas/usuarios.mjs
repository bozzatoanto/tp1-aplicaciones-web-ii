import express from "express";
import { leerJson, escribirJson } from "../utilidades/archivos.mjs";

const router = express.Router();
const rutaUsuarios = new URL("../usuarios.json", import.meta.url);
const rutaVentas = new URL("../ventas.json", import.meta.url);

function sinContrasena(usuario) {
  const { contrasena, ...datos } = usuario;
  return datos;
}

router.get("/", async (req, res) => {
  const usuarios = await leerJson(rutaUsuarios);
  res.json(usuarios.map(sinContrasena));
});

router.get("/:id", async (req, res) => {
  const usuarios = await leerJson(rutaUsuarios);
  const id = Number(req.params.id);
  const usuario = usuarios.find((item) => item.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(sinContrasena(usuario));
});

router.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: "Email y contrasena son obligatorios" });
  }

  const usuarios = await leerJson(rutaUsuarios);
  const usuario = usuarios.find(
    (item) => item.email === email && item.contrasena === contrasena
  );

  if (!usuario) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  if (!usuario.activo) {
    return res.status(403).json({ error: "Usuario inactivo" });
  }

  res.json({
    mensaje: "Inicio de sesion correcto",
    usuario: sinContrasena(usuario)
  });
});

router.post("/", async (req, res) => {
  const { nombre, apellido, email, contrasena, activo = true } = req.body;

  if (!nombre || !apellido || !email || !contrasena) {
    return res.status(400).json({
      error: "Nombre, apellido, email y contrasena son obligatorios"
    });
  }

  const usuarios = await leerJson(rutaUsuarios);

  if (usuarios.some((item) => item.email === email)) {
    return res.status(409).json({ error: "El email ya esta registrado" });
  }

  const id = usuarios.length
    ? Math.max(...usuarios.map((item) => item.id)) + 1
    : 1;

  const nuevoUsuario = {
    id,
    nombre,
    apellido,
    email,
    contrasena,
    activo: Boolean(activo)
  };

  usuarios.push(nuevoUsuario);
  await escribirJson(rutaUsuarios, usuarios);

  res.status(201).json(sinContrasena(nuevoUsuario));
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const usuarios = await leerJson(rutaUsuarios);
  const usuario = usuarios.find((item) => item.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const ventas = await leerJson(rutaVentas);
  const tieneVentas = ventas.some((venta) => venta.id_usuario === id);

  if (tieneVentas) {
    return res.status(409).json({
      error: "No se puede eliminar el usuario porque tiene ventas asociadas"
    });
  }

  const usuariosActualizados = usuarios.filter((item) => item.id !== id);
  await escribirJson(rutaUsuarios, usuariosActualizados);

  res.json({ mensaje: "Usuario eliminado correctamente" });
});

export default router;
