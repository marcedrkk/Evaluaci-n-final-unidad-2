document.addEventListener('DOMContentLoaded', async () => {
  const loginModal = document.getElementById('modalLogin');
  const btnLogin = document.getElementById('btnLogin');
  const cerrarLogin = document.getElementById('cerrarLogin');
  const formLogin = document.getElementById('formLogin');
  const mensajeError = document.getElementById('mensajeError');
  const nav = document.querySelector('nav');
  let usuario = JSON.parse(localStorage.getItem('usuario')) || null;

  // Si es admin, mostrar "Inventario"
  if (usuario?.rol === 'admin') {
    const inventarioLink = document.createElement('a');
    inventarioLink.href = 'admin.html';
    inventarioLink.textContent = 'Inventario';
    nav.appendChild(inventarioLink);
  }

  // Mostrar el botón de cerrar sesión si el usuario está logueado
  const btnLogout = document.getElementById('btnLogout');
  if (usuario && btnLogout) {
    btnLogout.style.display = 'inline-block';
  }

  // Cerrar sesión
  btnLogout?.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  // Mostrar modal de login al hacer clic en el botón
  btnLogin?.addEventListener('click', () => {
    loginModal.classList.add('activo');
  });

  // Cerrar modal de login
  cerrarLogin?.addEventListener('click', () => {
    loginModal.classList.remove('activo');
  });

  // Inicio de sesión
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const correo = e.target.loginEmail.value;
      const contrasena = e.target.loginPassword.value;
      if (mensajeError) mensajeError.textContent = '';

      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, contrasena })
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
          localStorage.setItem('token', data.token);
          usuario = data.usuario;

          loginModal.classList.remove('activo');
          usuario.rol === 'admin' ? window.location.href = 'admin.html' : alert('Bienvenido');
        } else {
          mensajeError.textContent = data.mensaje || 'Error al iniciar sesión';
        }
      } catch (err) {
        mensajeError.textContent = 'Error en el servidor';
        console.error('Error en fetch login:', err);
      }
    });
  }

  // --- Carrito ---
  const productosDiv = document.getElementById('productos');
  const carritoIcono = document.getElementById('abrirCarrito');
  const modalCarrito = document.getElementById('modalCarrito');
  const cerrarCarrito = document.getElementById('cerrarCarrito');
  const contenidoCarrito = document.getElementById('contenidoCarrito');
  const cantidadCarrito = document.getElementById('cantidadCarrito');
  const comprarCarrito = document.getElementById('comprarCarrito');
  const vaciarCarrito = document.getElementById('vaciarCarrito');
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  console.log('🛒 Carrito cargado desde localStorage:', localStorage.getItem('carrito'));
  console.log('Objeto carrito:', carrito);

  // Mostrar productos
  if (productosDiv) {
    fetch('http://localhost:3000/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('No se pudo obtener productos');
        return res.json();
      })
      .then(productos => {
        productosDiv.innerHTML = '';
        if (!productos.length) {
          productosDiv.innerHTML = '<p>No hay productos disponibles.</p>';
          return;
        }
        productos.forEach(p => {
          const div = document.createElement('div');
          div.className = 'producto';
          div.innerHTML = `
            <h3>${p.nombre}</h3>
            <p>$${p.precio} | Stock: ${p.stock}</p>
            <button data-id="${p.id}">Agregar al carrito</button>
          `;
          div.querySelector('button').onclick = () => agregarAlCarrito(p);
          productosDiv.appendChild(div);
        });
      })
      .catch(err => {
        productosDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
        console.error(err);
      });
  }

  function agregarAlCarrito(producto) {
    console.log('🔹 Agregando producto al carrito:', producto);

    const idx = carrito.findIndex(item => item.id === producto.id);
    if (idx !== -1) {
      if (carrito[idx].cantidad < producto.stock) {
        carrito[idx].cantidad++;
      } else {
        alert('No hay más stock disponible');
        return;
      }
    } else {
      carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    guardarCarrito();
    actualizarCantidadCarrito();
    console.log('✅ Carrito actualizado:', carrito);
  }

  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function actualizarCantidadCarrito() {
    if (cantidadCarrito) cantidadCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  function mostrarCarrito() {
    if (!contenidoCarrito) return;
    if (carrito.length === 0) {
      contenidoCarrito.innerHTML = '<p>El carrito está vacío.</p>';
      return;
    }
    contenidoCarrito.innerHTML = carrito.map(item =>
      `<div>
        ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
        <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      </div>`
    ).join('');
  }

  window.eliminarDelCarrito = function(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    mostrarCarrito();
    actualizarCantidadCarrito();
  };

  carritoIcono?.addEventListener('click', () => {
    mostrarCarrito();
    modalCarrito.classList.add('activo');
  });
  cerrarCarrito?.addEventListener('click', () => {
    modalCarrito.classList.remove('activo');
  });

  comprarCarrito?.addEventListener('click', async () => {
    if (carrito.length === 0) return alert('El carrito está vacío');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    try {
      const res = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productos: carrito, usuario: usuario ? usuario.id : null })
      });

      const data = await res.json();
      if (res.ok) {
        console.log('✅ Compra realizada con éxito:', data);
        localStorage.removeItem('carrito');
        setTimeout(() => { location.reload(); }, 500);
      } else {
        alert(data.mensaje || 'Error al procesar la compra');
      }
    } catch (e) {
      alert('Error de red al comprar');
    }
  });

  vaciarCarrito?.addEventListener('click', () => {
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
    actualizarCantidadCarrito();
  });

  document.getElementById('cerrarSuccess')?.addEventListener('click', () => {
    document.getElementById('modalSuccess').classList.remove('activo');
  });

  actualizarCantidadCarrito();
  
  // --- Filtros de productos ---
  const buscarInput = document.getElementById('buscarProducto');
  const filtrarCategoria = document.getElementById('filtrarCategoria');
  const filtrarPrecio = document.getElementById('filtrarPrecio');
  let productos = [];

  async function cargarProductos() {
    try {
      const res = await fetch('http://localhost:3000/api/productos');
      if (!res.ok) throw new Error('Error al obtener productos');
      productos = await res.json();
      mostrarProductos(productos);
    } catch (err) {
      productosDiv.innerHTML = '<p>Error al cargar productos.</p>';
    }
  }

  function mostrarProductos(lista) {
    productosDiv.innerHTML = '';
    lista.forEach(prod => {
      const div = document.createElement('div');
      div.className = 'producto';
      div.innerHTML = `
        <h3>${prod.nombre}</h3>
        <h5>${prod.descripcion}</h5>
        <p>Desde: $${prod.precio}</p>
        <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
      `;
      const btnAgregar = div.querySelector('button');
      btnAgregar.addEventListener('click', () => agregarAlCarrito(prod));
      productosDiv.appendChild(div);
    });
  }

  function filtrarProductos() {
    let filtroNombre = buscarInput.value.toLowerCase();
    let filtroCategoria = filtrarCategoria.value;
    let filtroPrecio = filtrarPrecio.value;

    let productosFiltrados = productos.filter(prod => {
      let coincideNombre = prod.nombre.toLowerCase().includes(filtroNombre);
      let coincideCategoria = filtroCategoria === "" || prod.categoria === filtroCategoria;
      let coincidePrecio = filtroPrecio === "" || (filtroPrecio === "10-50" ? prod.precio >= 10 && prod.precio <= 50 : filtroPrecio === "50+" ? prod.precio > 50 : prod.precio < 10);

      return coincideNombre && coincideCategoria && coincidePrecio;
    });

    mostrarProductos(productosFiltrados);
  }

  buscarInput?.addEventListener('input', filtrarProductos);
  filtrarCategoria?.addEventListener('change', filtrarProductos);
  filtrarPrecio?.addEventListener('change', filtrarProductos);

  await cargarProductos();
});
