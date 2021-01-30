(function() {

    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        formulario.addEventListener('submit', validarCliente);

        conectarDB();

    })

    function validarCliente(evento) {

        evento.preventDefault();

        // Leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {

            imprimirAlerta('Todos los campos son obligatorios', 'error')

            return;

        }

        // Crear un objecto con la informacion
        const cliente = {

            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()

        }

        crearNuevoCliente(cliente);

    }

    function crearNuevoCliente(cliente) {

        const trans = DB.transaction(['crm'], 'readwrite');

        const objectStore = trans.objectStore('crm');

        objectStore.add(cliente);

        trans.onerror = function() {

            imprimirAlerta('Hubo un error', 'error');

        }

        trans.oncomplete = function() {

            imprimirAlerta('El cliente se agrego correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        }        

    }

})();