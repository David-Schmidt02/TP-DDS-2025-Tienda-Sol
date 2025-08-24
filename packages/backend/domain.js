// Una forma de escribir un "falso enum"
const Categoria = Object.freeze({
  Hotel: "Hotel",
  Departamento: "Departamento",
  Cabana: "Cabana",
  Apart: "Apart",
});

// Una forma de escribir un "falso enum"
const TipoUsuario = Object.freeze({
  Comprador: "Comprador",
  Vendedor: "Vendedor",
  Admin: "Admin",
});

const Moneda = Object.freeze({
  PESO: "PESO_ARG",
  DOLAR: "DOLAR_USA",
  REAL: "REAL"
});

const EstadoPedido = Object.freeze({
  PENDIENTE: "PENDIENTE",
  CONFIRMADO: "CONFIRMADO",
  EN_PREPARACION: "EN_PREPARACION",
  ENVIADO: "ENVIADO",
  ENTREGADO: "ENTREGADO",
  CANCELADO: "CANCELADO"
});


// ====================== Pedido ======================
class Pedido {
  constructor(id, comprador, items, moneda, direccionEntrega, estado, fechaCreacion) {
    this.id = id;
    this.comprador = comprador; // Usuario
    this.items = items; // Array de ItemPedido
    this.total = 0;
    this.moneda = moneda; // type(moneda) = enum Moneda
    this.direccionEntrega = direccionEntrega; // DireccionEntrega
    this.estado = estado; // EstadoPedido
    this.fechaCreacion = fechaCreacion;
    this.historialEstados = []; // Array de CambioEstadoPedido
  }

  calcularTotal() {
    this.total = this.items.reduce((acc, item) => acc + item.subtotal(), 0);
    return this.total;
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    const cambio = new CambioEstadoPedido(new Date(), nuevoEstado, this, quien, motivo);
    this.historialEstados.push(cambio);
    this.estado = nuevoEstado;
  }

  validarStock() {
    return this.items.every(item => item.producto.estaDisponible(item.cantidad));
  }
}

// ====================== CambioEstadoPedido ======================
class CambioEstadoPedido {
  constructor(fecha, estado, pedido, usuario, motivo) {
    this.fecha = fecha;
    this.estado = estado;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}

// ====================== DireccionEntrega ======================
class DireccionEntrega {
  constructor(calle, altura, piso, departamento, codigoPostal, ciudad, provincia, pais, lat, lon) {
    this.calle = calle;
    this.altura = altura;
    this.piso = piso;
    this.departamento = departamento;
    this.codigoPostal = codigoPostal;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.pais = pais;
    this.lat = lat;
    this.lon = lon;
  }
}

// ====================== FactoryNotificacion ======================
class FactoryNotificacion {
  static crearSegunEstadoPedido(estado, pedido) {
    return new Notificacion(
      crypto.randomUUID(),
      pedido.id,
      pedido.comprador,
      `El pedido cambió a estado: ${estado}`,
      new Date(),
      pedido.direccionEntrega,
      pedido.items,
      pedido.calcularTotal()
    );
  }

  static crearSegunPedido(pedido) {
    return new Notificacion(
      crypto.randomUUID(),
      pedido.comprador,
      `Nuevo pedido creado con ID: ${pedido.id}`,
      new Date()
    );
  }
}

// ====================== Notificacion ======================
class Notificacion {
  constructor(id, idPedido, usuarioDestino, mensaje, fechaAlta, direccionEntrega, items, total, leida = false) {
    this.id = id;
    this.usuarioDestino = usuarioDestino;
    this.direccionEntrega = direccionEntrega;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta;
    this.leida = leida;
    this.fechaLeida = null;

    // Sobre el pedido
    this.idPedido = idPedido;
    this.items = items;
    this.total = total;
  }

  marcarComoLeida() {
    this.leida = true;
    this.fechaLeida = new Date();
    this.notificar(this.usuarioDestino.email);
  }

  notificar(email) {
    console.log(`Notificación enviada a ${email}: ${this.mensaje}`);
    // Lógica para enviar notificación al email
  }
}

// ====================== Usuario ======================
class Usuario {
  constructor(id, nombre, email, telefono, tipo, fechaAlta) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo; // TipoUsuario
    this.fechaAlta = fechaAlta;
  }
}

// ====================== Producto ======================
class Producto {
  constructor(id, vendedor, titulo, descripcion, categorias = [], precio, moneda, stock, fotos = [], activo = true) {
    this.id = id;
    this.vendedor = vendedor; // Usuario
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.categorias = categorias; // Array Categoria
    this.precio = precio;
    this.moneda = moneda;
    this.stock = stock;
    this.fotos = fotos;
    this.activo = activo;
  }

  estaDisponible(cantidad) {
    return this.activo && this.stock >= cantidad;
  }

  reducirStock(cantidad) {
    if (this.stock >= cantidad) {
      this.stock -= cantidad;
    } else {
      throw new Error("Stock insuficiente");
    }
  }

  aumentarStock(cantidad) {
    this.stock += cantidad;
  }
}

// ====================== ItemPedido ======================
class ItemPedido {
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto; // Producto
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  subtotal() {
    return this.cantidad * this.precioUnitario;
  }
}

// Exportar todas las clases y enums
export {
  Categoria,
  TipoUsuario,
  Moneda,
  EstadoPedido,
  Pedido,
  CambioEstadoPedido,
  DireccionEntrega,
  FactoryNotificacion,
  Notificacion,
  Usuario,
  Producto,
  ItemPedido
};
