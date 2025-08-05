# Playwright + MySQL Test Project

Este proyecto automatiza un flujo de compra en el sitio [saucedemo.com](https://www.saucedemo.com) utilizando **Playwright con JavaScript**. Además, realiza una validación cruzada con una base de datos **MySQL** para comprobar que el precio mostrado en el e-commerce coincide con el precio almacenado en la base de datos.

## Características

- Automatiza el login, la compra de un producto y el checkout.
- Extrae el nombre y precio del producto desde la web.
- Consulta una base de datos remota (`productos.ecommerce`) para validar el precio.
- Registra errores en un archivo `testing.log` si ocurren fallos (por ejemplo, si un botón no se encuentra).
- Incluye manejo de excepciones y cierre de sesión.

## Requisitos

- Node.js
- Playwright
- MySQL2 (librería Node.js)

## Instalación

```bash
npm install
npx playwright install
```
