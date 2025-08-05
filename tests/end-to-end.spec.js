import { test, expect } from "@playwright/test";
import fs from "fs"; // fs = file system ->> archivos del sistema
import mysql from "mysql2/promise"; // libreria que permite conectarme con la base de datos

// configuro la conexion
const connectionConfig = {
  host: "cursotesting.com.ar", // esto podria ser un ip tambien
  user: "testing",
  password: "cursoperformance",
  database: "productos", // esto define cual es la base de datos
};

/* 
// Probar la conexión
connection.connect((err) => {
  if (err) {
    console.log("Error al conectarse a la base de datos", err);
    return;
  } else {
    console.log("Conexión exitosa!");
  }
}); 
*/

// ACA ARRANCA EL TEST:
var precio_bd;

test("test", async ({ page }) => {
  // CONEXION ASYNCRONICA A LA DB
  const connection = await mysql.createConnection(connectionConfig);

  // ir a la web de saucedemo
  await page.goto("https://www.saucedemo.com/");

  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  // adiciono al carrito de compras el producto 1
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // click sobre el ícono del carrito de compras
  await page.locator('[data-test="shopping-cart-link"]').click();

  // click en boton checkout
  await page.locator('[data-test="checkout"]').click();

  // ingreso datos personales
  await page.locator('[data-test="firstName"]').fill("Cami");
  await page.locator('[data-test="lastName"]').fill("cami");
  await page.locator('[data-test="postalCode"]').fill("1404");
  await page.locator('[data-test="continue"]').click();

  // obtengo el texto del nombre del producto
  const nombre = await page
    .locator('[data-test="item-4-title-link"]')
    .textContent();

  // obtengo el importe a facturar por el ecommerce por el producto
  const precio = await page
    .locator('[data-test="inventory-item-price"]')
    .textContent();

  // Realizar la búsqueda en la base de datos para obtener el precio:
  // (ecommerce => tabla), (nombre y precio => columnas)
  var busqueda = `SELECT precio FROM ecommerce WHERE nombre = '${nombre}'`;

  const [results] = await connection.execute(busqueda);
  precio_bd = results[0].precio;

  /* 
  // Ejecución de la búsqueda con query
  connection.query(busqueda, (err, results) => {
    if (results.length > 0) {
      // largo del resultado mayor que cero
      precio_bd = results[0].precio; // si no pongo .precio (columna precio) falla el test
    }
  }); 
  */

  console.log("El precio de la base de datos es: " + precio_bd);
  console.log("El producto es: " + nombre);
  console.log("El precio es: " + precio);

  // saco el símbolo $ reemplazandolo por "" (sino el expect fallara)
  var nuevo_precio = precio.replace("$", "");
  console.log("Precio sin el signo $ :" + nuevo_precio);

  //
  expect(nuevo_precio).toBe(precio_bd);

  // Finalizar la compra
  await page.locator('[data-test="finish"]').click();

  // Hacer click en el boton volver a la página principal
  try {
    await page
      .locator('[data-test="back-to-products"]')
      .click({ timeout: 2000 });
  } catch {
    // Genera el archivo testing.log que registrará los errores a pesar de que el test continue
    var fecha_hora = new Date();
    fs.appendFileSync(
      "testing.log",
      fecha_hora + " - " + "\n" + "Falló el boton Back to Products" + "\n"
    );
  }

  // Cerrar cesion:
  // click para abrir el menu
  await page.getByRole("button", { name: "Open Menu" }).click();

  // click para hacer un logout
  await page.locator('[data-test="logout-sidebar-link"]').click();

  /*   
// Cerrar la conexión de base de datos después de que todo el test haya terminado
  connection.end(); 
  */
});
