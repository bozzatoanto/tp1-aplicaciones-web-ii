# Primera entrega - Aplicaciones Web II

## Contexto de negocio

El proyecto representa la estructura inicial de datos de un e-commerce dedicado a la venta de productos para mascotas.

La información se encuentra separada en tres archivos JSON relacionados entre sí:

- `usuarios.json`: contiene los usuarios registrados en la tienda.
- `productos.json`: contiene el catálogo de productos disponibles.
- `ventas.json`: contiene las ventas realizadas y relaciona cada operación con un usuario y con uno o más productos.

## Relaciones

- `ventas.id_usuario` corresponde a `usuarios.id`.
- `ventas.productos[].id_producto` corresponde a `productos.id`.

Las estructuras contienen datos de tipo cadena, numérico y booleano.
