

window.addEventListener('load',function(){
    const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1'
    const token= this.localStorage.getItem('token')?localStorage.getItem('token'):sessionStorage.getItem('token');    
    const divAvatar=document.querySelector('.user-info p'); 
    const fomulario=document.querySelector('.nueva-tarea');
    const listaTareaPendientes= document.querySelector('.tareas-pendientes')
    const listaTareaTeminadas= document.querySelector('.tareas-terminadas')
    const btnCerrarSesion=document.querySelector('#closeApp')

    
    // escuchamos el click para cerrar sesion
    btnCerrarSesion.addEventListener('click',function(e){        
        if(confirm("¿Desea cerrar sesión?")){
            localStorage.clear();
            sessionStorage.clear();
            location.replace('./index.html');
        }
    })
    
    
    /* ------------------- acciones apenas arranca nuestra app ------------------ */
    obtenerDatosUsuario(`${apiUrl}/users/getMe`,token);
    obtenerTareas (`${apiUrl}/tasks`,token);    
    
    fomulario.addEventListener('submit',function(e){
        e.preventDefault();
        const nuevaTarea=document.querySelector('#nuevaTarea');
        const resultadoValidacion= validarTarea(nuevaTarea.value)
        const tareaLista = resultadoValidacion?  normalizacionTarea(nuevaTarea.value) : alert('Ingrese un detalle para la tarrea que desea agregar.');
        crearTareas(`${apiUrl}/tasks`,token, tareaLista);
        obtenerTareas (`${apiUrl}/tasks`,token);
        fomulario.reset();
    })

        /* -------------------------------------------------------------------------- */
    /*                                  funciones                                 */
    /* -------------------------------------------------------------------------- */

    

    /* ---------------------- Pintar las tareas en pantalla --------------------- */
    
    function obtenerDatosUsuario(url, autorizacion){
        const settings = {
            method: 'GET',
            headers: {
                'authorization': autorizacion,
            },
        }        
        fetch(url, settings)
        .then( respuesta => respuesta.json())
        .then( dataUsuario => {
            divAvatar.innerText=dataUsuario.firstName;
            
        })        
    }

    function obtenerTareas (url, autorizacion){
        const settings = {
            method: 'GET',
            headers: {
                'authorization': autorizacion,
            },
        }        
        fetch(url, settings)
        .then( respuesta => respuesta.json())
        .then( dataTareas => {
            const arrayTareas=dataTareas
            listaTareaPendientes.innerHTML = "";
            listaTareaTeminadas.innerHTML = "";
            for (let i = 0; i < arrayTareas.length; i++) {
                const element = arrayTareas[i];
                const templateTareasFinalizadas=`<li class="tarea">
                <div class="done"></div>
                <div class="descripcion">
                  <p class="nombre">${element.description}</p>
                  <div>
                  <button><i id="${element.id}" class="fas fa-undo-alt change"></i></button>
                  <button><i id="${element.id}" class="far fa-trash-alt"></i></button>
                  </div>
                </div>
              </li>`;
              const templateTareasPendientes=`<li class="tarea">
                <div class="not-done change" id="${element.id}"></div>
                <div class="descripcion">
                  <p class="nombre">${element.description}</p>
                  <p class="timestamp"><i class="far fa-calendar-alt"></i> ${element.createdAt}</p>
                </div>
              </li>`;
                if (element.completed== false) {
                    listaTareaPendientes.innerHTML+=templateTareasPendientes;                    
                }else{
                    listaTareaTeminadas.innerHTML+=templateTareasFinalizadas;
                }
            }     
        })
    }



    function validarTarea(tarea) {
        return tarea===''?false:true;
    }

    function normalizacionTarea(tarea) {
        const usuario = {
            description: tarea,
            completed:false
        }        
        return usuario;
    }

    function crearTareas (url, autorizacion, payload){
        const settings = {
            method: 'POST',
            headers: {
                'authorization': autorizacion,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }        
        fetch(url, settings)
        .then( respuesta => respuesta.json())
        .then( dataTarea => {
            console.log(dataTarea);
            obtenerTareas (`${apiUrl}/tasks`,token)   
        })
    }
    //esccucho el evento click del area de tareas TERMINADAS para borar o modificar
    listaTareaTeminadas.addEventListener('click', function (e) {
        if (e.target.classList.contains('fa-trash-alt') ) {
            const id= e.target.id
            const apiUrlDelete=`${apiUrl}/tasks/${id}`
            borrarTarea(apiUrlDelete,token)
        }
        if (e.target.classList.contains('fa-undo-alt') ) {
            const id= e.target.id
            const apiUrlDelete=`${apiUrl}/tasks/${id}`
            const tareaActualizada=normalizacionTareaTerminada(e.path[3].querySelector('.nombre').innerText)
            actualizarTarea(apiUrlDelete,token,tareaActualizada)
        }        
    })


    listaTareaPendientes.addEventListener('click', function (e) {
        console.log('click en pendiente');
        if (e.target.classList.contains('not-done') ) {            
            const id= e.target.id
            const apiUrlDelete=`${apiUrl}/tasks/${id}`
            const tareaActualizada=normalizacionTareaPendiente(e.path[1].querySelector('.nombre').innerText)
            actualizarTarea(apiUrlDelete,token,tareaActualizada)
        }        
    })

    function borrarTarea(url,autorizacion) {
        const settings = {
            method: 'DELETE',
            headers: {
                'authorization': autorizacion,
            },
        }        
        fetch(url, settings)
        .then( respuesta => respuesta.json())
        .then( dataTarea => {
            console.log(dataTarea);
            obtenerTareas (`${apiUrl}/tasks`,token);    
        })
    }

    function normalizacionTareaTerminada(tarea) {
        const usuario = {
            description: tarea,
            completed:false
        }        
        return usuario;
    }
    function normalizacionTareaPendiente(tarea) {
        const usuario = {
            description: tarea,
            completed:true
        }     
        return usuario;
    }
    
    function actualizarTarea(url,autorizacion,payload) {
        const settings = {
            method: 'PUT',
            headers: {
                'authorization': autorizacion,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }        
        fetch(url, settings)
        .then( respuesta => respuesta.json())
        .then( dataTarea => {
            console.log(dataTarea);
            obtenerTareas (`${apiUrl}/tasks`,token);    
        })
    }




















})