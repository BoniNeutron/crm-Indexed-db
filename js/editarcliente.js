(function() {

    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        // ACTUALIZA EL REGISTRO
        formulario.addEventListener('submit', actualizarCliente);
        
        // VERIFICAR EL ID DE LA URL
        const parametrosURL = new URLSearchParams(window.location.search);

        idCliente = parametrosURL.get('id');

        if(idCliente) {

            setTimeout(() => {
                
                obtenerCliente(idCliente);

            }, 100);

        }

    });

    function actualizarCliente(evento) {

        evento.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {

            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;

        }

        // ACTUALIZAR CLIENTE
        const clienteActualizado = {

            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)

        }

        const trans = DB.transaction(['crm'], 'readwrite');
        const objectStore = trans.objectStore('crm');

        objectStore.put(clienteActualizado);

        trans.oncomplete = function() {

            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        }

        trans.onerror = function() {

            imprimirAlerta('Hubo un error', 'error');

        }

    }

    function obtenerCliente(id) {

        const transaction = DB.transaction(['crm'], 'readonly');

        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(evento) {

            const cursor = evento.target.result;

            if(cursor) {

                if(cursor.value.id === Number(id)) {

                    llenarFormulario(cursor.value);

                }

                cursor.continue();

            }

        }

    }

    function llenarFormulario(datosCliente) {

        const {nombre, email, telefono, empresa} = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;


    }

    function conectarDB() {

        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {

            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function() {

            DB = abrirConexion.result;

        }

    }

})();