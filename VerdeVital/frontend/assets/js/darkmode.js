document.addEventListener('DOMContentLoaded', () => {
  const btnSwitch = document.querySelector('#switch');
  const iconoModo = document.querySelector('#icono-modo');

  // Restaurar estado previo
  const modoOscuro = localStorage.getItem('modo') === 'oscuro';

  if (modoOscuro) {
    document.body.classList.add('dark');
    iconoModo.classList.remove('fa-sun');
    iconoModo.classList.add('fa-moon');
    btnSwitch.classList.add('active');
  } else {
    iconoModo.classList.remove('fa-moon');
    iconoModo.classList.add('fa-sun');
    btnSwitch.classList.remove('active');
  }

  btnSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const esOscuro = document.body.classList.contains('dark');

    if (esOscuro) {
      iconoModo.classList.remove('fa-sun');
      iconoModo.classList.add('fa-moon');
      localStorage.setItem('modo', 'oscuro');
      btnSwitch.classList.add('active');
    } else {
      iconoModo.classList.remove('fa-moon');
      iconoModo.classList.add('fa-sun');
      localStorage.setItem('modo', 'claro');
      btnSwitch.classList.remove('active');
    }
  });
});

