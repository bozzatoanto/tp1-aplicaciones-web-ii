import express from "express";
import usuariosRouter from "./rutas/usuarios.mjs";
import productosRouter from "./rutas/productos.mjs";
import ventasRouter from "./rutas/ventas.mjs";

const app = express();
const puerto = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    proyecto: "Ecommerce de productos para mascotas",
    endpoints: {
      usuarios: "/usuarios",
      productos: "/productos",
      ventas: "/ventas"
    }
  });
});

app.use("/usuarios", usuariosRouter);
app.use("/productos", productosRouter);
app.use("/ventas", ventasRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(puerto, () => {
  console.log(`Servidor iniciado en http://localhost:${puerto}`);
});
