import "dotenv/config";
import express from "express";
import cors from "cors";

import { 
  Pedido, 
  Usuario, 
  ItemPedido, 
  Producto, 
  DireccionEntrega,
  Moneda,
  EstadoPedido,
  TipoUsuario
} from "./domain.js";

const pedido1 = new Pedido(
  1,
  new Usuario(1, "Juan Perez", "juan@example.com", "123456789", TipoUsuario.Comprador, new Date()),
  [
    new ItemPedido(
      new Producto(1, null, "Producto 1", "Descripción 1", [], 100, Moneda.PESO, 10), 
      2, 
      100
    ),
    new ItemPedido(
      new Producto(2, null, "Producto 2", "Descripción 2", [], 200, Moneda.PESO, 5), 
      1, 
      200
    ),
  ],
  Moneda.PESO,
  new DireccionEntrega("Calle Falsa", 123, 4, "B", "1234", "Springfield", "Buenos Aires", "Argentina", -34.61, -58.38),
  EstadoPedido.PENDIENTE,
  new Date()
);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.get("/healthCheack", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    //environment: process.env.NODE_ENV || "development"
  });
});


app.get("/crearPedido", (req, res) => {
  res.json({ message: "Pedido creado", pedido: pedido1 });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});
