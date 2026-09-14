# Aplicaciones Web II - Entregas 1 y 2

## Contexto de negocio

El proyecto representa un e-commerce dedicado a la venta de productos para mascotas.

La información se encuentra separada en tres archivos JSON relacionados entre sí:

- `usuarios.json`: usuarios registrados.
- `productos.json`: catálogo de productos.
- `ventas.json`: ventas realizadas.

## Relaciones

- `ventas.id_usuario` corresponde a `usuarios.id`.
- `ventas.productos[].id_producto` corresponde a `productos.id`.

## Segunda entrega

Se incorporó un servidor desarrollado con Express.js que permite consultar, crear, actualizar y eliminar registros manteniendo la relación entre las estructuras JSON.

### Instalación

```bash
npm install
```

### Ejecución

```bash
npm start
```

El servidor se ejecuta por defecto en:

```text
http://localhost:3000
```

## Rutas disponibles

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/` | Muestra información general de la API |
| GET | `/usuarios` | Lista los usuarios sin mostrar contraseñas |
| GET | `/usuarios/:id` | Consulta un usuario por ID |
| POST | `/usuarios` | Crea un nuevo usuario |
| POST | `/usuarios/login` | Valida email y contraseña |
| DELETE | `/usuarios/:id` | Elimina un usuario si no posee ventas asociadas |
| GET | `/productos` | Lista todos los productos |
| GET | `/productos/:id` | Consulta un producto por ID |
| POST | `/productos` | Crea un nuevo producto |
| PUT | `/productos/:id` | Actualiza un producto existente |
| GET | `/ventas` | Lista todas las ventas |
| GET | `/ventas/:id` | Consulta una venta por ID |
| POST | `/ventas` | Crea una nueva venta |

## Ejemplos de solicitudes

### Crear usuario

`POST /usuarios`

```json
{
  "nombre": "Valentina",
  "apellido": "Perez",
  "email": "valentina.perez@email.com",
  "contrasena": "vale123",
  "activo": true
}
```

### Iniciar sesión

`POST /usuarios/login`

```json
{
  "email": "lucia.fernandez@email.com",
  "contrasena": "lucia123"
}
```

### Crear producto

`POST /productos`

```json
{
  "nombre": "Rascador para gatos",
  "descripcion": "Rascador de carton con catnip",
  "precio": 28990,
  "stock": 10,
  "imagen": "rascador-gatos.jpg"
}
```

### Actualizar producto

`PUT /productos/2`

```json
{
  "precio": 27990,
  "stock": 16
}
```

### Crear venta

`POST /ventas`

```json
{
  "id_usuario": 5,
  "direccion": "Obispo Trejo 950, Cordoba",
  "pagada": true,
  "productos": [
    {
      "id_producto": 2,
      "cantidad": 1
    },
    {
      "id_producto": 5,
      "cantidad": 2
    }
  ]
}
```

## Integridad de datos

La ruta `DELETE /usuarios/:id` verifica si el usuario tiene ventas asociadas antes de eliminarlo.

Si existe al menos una venta cuyo `id_usuario` corresponde al usuario solicitado, el servidor responde con estado `409 Conflict` y no realiza la eliminación.

Esto evita que una venta quede relacionada con un usuario inexistente.

## Archivos principales

```text
servidor.mjs
rutas/
  usuarios.mjs
  productos.mjs
  ventas.mjs
utilidades/
  archivos.mjs
usuarios.json
productos.json
ventas.json
package.json
.gitignore
```
