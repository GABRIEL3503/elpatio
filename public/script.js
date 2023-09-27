function loadMenuItems() {
  fetch('https://elpatio.onrender.com/api/menu')
    .then(response => response.json())
    .then(data => {
      const container = document.querySelector('.container'); // Obtener el contenedor
      let currentType = null; // Variable para llevar un registro del tipo actual

      data.data.forEach(item => {
        // Verificar si la sección del menú ya existe
        let menuSection = document.querySelector(`.menu-section[data-type="${item.tipo}"]`);

        // Si no existe, crearla
        if (!menuSection) {
          menuSection = document.createElement('div');
          menuSection.className = 'menu-section';
          menuSection.setAttribute('data-type', item.tipo);

          // Crear el título de la sección si es un nuevo tipo
          if (currentType !== item.tipo) {
            const sectionTitle = document.createElement('h2');
            sectionTitle.className = 'section-title';
            sectionTitle.textContent = item.tipo.toUpperCase();
            menuSection.appendChild(sectionTitle);
            currentType = item.tipo;
          }

          container.appendChild(menuSection);  // Añadir al contenedor en lugar del body
        }

        const newItem = createMenuItem(item);
        menuSection.appendChild(newItem);
      });
    });
}


function createMenuItem(item) {

  const newItem = document.createElement('div');
  newItem.className = 'menu-item';
  newItem.innerHTML = `
    <div class="item-header">
      <h3 class="item-title">${item.nombre}</h3>
      <span class="item-price">$${item.precio}</span>
    </div>
    <p class="item-description">${item.descripcion}</p>
    <button class="edit-button">Editar</button>
  `;
  newItem.dataset.id = item.id;
  return newItem;

}

document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('edit-button')) {
    const itemElement = event.target.closest('.menu-item');
    const itemTitle = itemElement.querySelector('.item-title').textContent;
    const itemPrice = itemElement.querySelector('.item-price').textContent.substring(1); // Eliminar el símbolo de dólar
    const itemDescription = itemElement.querySelector('.item-description').textContent;
    const itemType = event.target.closest('.menu-section').getAttribute('data-type');

    Swal.fire({
      title: 'Editar elemento',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nombre" value="' + itemTitle + '">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Precio" value="' + itemPrice + '">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Descripción" value="' + itemDescription + '">' +
        '<select id="swal-input3" class="swal2-input">' +
        '<option value="ENTRADAS" ' + (itemType === 'ENTRADAS' ? 'selected' : '') + '>ENTRADAS</option>' +
        '<option value="PARA COMPARTIR" ' + (itemType === 'PARA COMPARTIR' ? 'selected' : '') + '>PARA COMPARTIR</option>' +
        '<option value="SANDWICHES" ' + (itemType === 'SANDWICHES' ? 'selected' : '') + '>SANDWICHES</option>' +
        '<option value="BEBIDAS" ' + (itemType === 'BEBIDAS' ? 'selected' : '') + '>BEBIDAS</option>' +
        '<option value="CERVEZAS" ' + (itemType === 'CERVEZAS' ? 'selected' : '') + '>CERVEZAS</option>' +
        '<option value="GIN" ' + (itemType === 'GIN' ? 'selected' : '') + '>GIN</option>' +
        '</select>',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Eliminar'
    }).then((result) => {
      const updatedData = {
        nombre: document.getElementById('swal-input1').value,
        precio: document.getElementById('swal-input2').value,
        descripcion: document.getElementById('swal-input4').value,
        tipo: document.getElementById('swal-input3').value
      };


      if (result.isConfirmed) {
        console.log("ID del elemento a editar:", itemElement.dataset.id);
        fetch(`/api/menu/${itemElement.dataset.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
        }).then(response => response.json())
          .then(data => {
            if (data.changes > 0) {
              // El elemento se actualizó correctamente
              console.log('Elemento actualizado');
              // Actualizar el elemento en el frontend
              itemElement.querySelector('.item-title').textContent = updatedData.nombre;
              itemElement.querySelector('.item-price').textContent = `$${updatedData.precio}`;
              itemElement.querySelector('.item-description').textContent = updatedData.descripcion;
            
              const oldMenuSection = event.target.closest('.menu-section');
              const newMenuSection = document.querySelector(`.menu-section[data-type="${updatedData.tipo}"]`);
              if (oldMenuSection !== newMenuSection) {
                oldMenuSection.removeChild(itemElement);
                newMenuSection.appendChild(itemElement);
              }
            }
          });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Eliminar el elemento
        fetch(`/api/menu/${itemElement.dataset.id}`, {
          method: 'DELETE'
        }).then(response => response.json())
          .then(data => {
            if (data.deleted > 0) {
              // El elemento se eliminó correctamente
              console.log('Elemento eliminado');
              itemElement.remove();

            }
          });
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Cargar los elementos del menú
  loadMenuItems();

  // Añadir un evento click al botón "Crear ítem"
  document.getElementById('create-item-button').addEventListener('click', function () {
    Swal.fire({
      title: 'Crear nuevo elemento',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Precio">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Descripción">' +
        '<select id="swal-input3" class="swal2-input">' +
        '<option value="ENTRADAS">ENTRADAS</option>' +
        '<option value="PARA COMPARTIR">PARA COMPARTIR</option>' +
        '<option value="SANDWICHES">SANDWICHES</option>' +
        '<option value="BEBIDAS">BEBIDAS</option>' +
        '<option value="CERVEZAS" >CERVEZAS</option>' +
        '<option value="GIN">GIN</option>' +
      
        '</select>',
      focusConfirm: false,
      preConfirm: () => {
        return {
          nombre: document.getElementById('swal-input1').value,
          precio: document.getElementById('swal-input2').value,
          descripcion: document.getElementById('swal-input4').value,
          tipo: document.getElementById('swal-input3').value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = {
          nombre: document.getElementById('swal-input1').value,
          precio: document.getElementById('swal-input2').value,
          descripcion: document.getElementById('swal-input4').value,
          tipo: document.getElementById('swal-input3').value
        };

        // Crear el nuevo elemento en el servidor
        fetch('https://elpatio.onrender.com/api/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newData)
        }).then(response => response.json())
          .then(data => {
            if (data.id) {
              // El elemento se creó correctamente
              console.log('Elemento creado con ID:', data.id);

              // Verificar si la sección del menú ya existe
              let menuSection = document.querySelector(`.menu-section[data-type="${newData.tipo}"]`);

              // Si no existe, crearla
              if (!menuSection) {
                menuSection = document.createElement('div');
                menuSection.className = 'menu-section';
                menuSection.setAttribute('data-type', newData.tipo);
                // Aquí puedes añadir más elementos al menuSection si es necesario
                document.body.appendChild(menuSection);  // Añadir al lugar apropiado en el DOM
              }

              const newItem = createMenuItem(newData);
              menuSection.appendChild(newItem);
            }
          })


      }
    });
  });
});
