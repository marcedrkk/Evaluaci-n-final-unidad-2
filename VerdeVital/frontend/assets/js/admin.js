const usuarioActual = JSON.parse(localStorage.getItem('usuario'));

if (!usuarioActual || usuarioActual.rol !== 'admin') {
  alert('Acceso denegado. Esta página es solo para administradores.');
  window.location.href = 'index.html';
}

window.onload = () => {
  obtenerProductosAdmin();
  document.getElementById('formAgregarProducto').addEventListener('submit', agregarProducto);
};

// Obtener productos para el panel de admin
async function obtenerProductosAdmin() {
  try {
    const res = await fetch('http://localhost:3000/api/productos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    const productos = await res.json();
    mostrarProductosAdmin(productos);
  } catch (error) {
    console.error(error);
    alert('Error al obtener productos');
  }
}

// Mostrar productos en tabla con inputs editables
function mostrarProductosAdmin(productos) {
  const tbody = document.querySelector('#tablaAdmin tbody');
  tbody.innerHTML = '';

  productos.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><input value="${p.nombre}" data-id="${p.id}" data-campo="nombre"/></td>
      <td><input type="number" value="${p.precio}" data-id="${p.id}" data-campo="precio"/></td>
      <td><input type="number" value="${p.stock}" data-id="${p.id}" data-campo="stock"/></td>
      <td><input value="${p.categoria}" data-id="${p.id}" data-campo="categoria"/></td>
      <td><input value="${p.descripcion}" data-id="${p.id}" data-campo="descripcion"/></td>
      <td>
        <button onclick="actualizarProducto(${p.id})">Actualizar</button>
        <button onclick="eliminarProducto(${p.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

// Agregar nuevo producto
async function agregarProducto(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const precio = parseFloat(document.getElementById('precio').value);
  const stock = parseInt(document.getElementById('stock').value);
  const descripcion = document.getElementById('descripcion').value.trim();
  const categoria = document.getElementById('categoria').value;

  if (!nombre || isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0 || !descripcion || !categoria) {
    return alert('Por favor completa los campos correctamente');
  }

  try {
    const res = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ nombre, precio, stock, descripcion, categoria })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Producto agregado correctamente');
      e.target.reset();
      obtenerProductosAdmin();
    } else {
      alert(data.mensaje || 'Error al agregar el producto');
    }
  } catch (error) {
    console.error(error);
    alert('Error de red al agregar producto');
  }
}

// Actualizar un producto específico
async function actualizarProducto(id) {
  const inputs = document.querySelectorAll(`input[data-id="${id}"]`);
  const datos = {};

  inputs.forEach(input => {
    const valor = input.value.trim();
    datos[input.dataset.campo] = input.type === 'number' ? parseFloat(valor) : valor;
  });

  if (!datos.nombre || isNaN(datos.precio) || isNaN(datos.stock)) {
    return alert('Datos inválidos al actualizar');
  }

  try {
    const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(datos)
    });

    const data = await res.json();
    if (res.ok) {
      alert('Producto actualizado correctamente');
      obtenerProductosAdmin();
    } else {
      alert(data.mensaje || 'Error al actualizar producto');
    }
  } catch (error) {
    console.error(error);
    alert('Error de red al actualizar producto');
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      alert('Producto eliminado correctamente');
      obtenerProductosAdmin();
    } else {
      alert(data.mensaje || 'Error al eliminar producto');
    }
  } catch (error) {
    console.error(error);
    alert('Error de red al eliminar producto');
  }
}
