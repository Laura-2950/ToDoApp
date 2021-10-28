window.addEventListener('load',function(){
    const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1'
    const token= this.localStorage.getItem('token')?localStorage.getItem('token'):sessionStorage.getItem('token');    
    const divAvatar=document.querySelector('.user-info p'); 
    const fomulario=document.querySelector('.nueva-tarea');
    const divTareaPendientes= document.querySelector('.tareas-pendientes #skeleton')
    const divTareaTeminadas= document.querySelector('.tareas-terminadas #skeleton')
    const btnCerrarSesion=document.querySelector('#closeApp')

    console.log();


    obtenerDatosUsuario(`${apiUrl}/users/getMe`,token);    


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
            console.log(dataUsuario);
            console.log(dataUsuario.firstName);
            divAvatar.innerText=dataUsuario.firstName;
            if (dataUsuario.firstName) {
                obtenerTareas (`${apiUrl}/tasks`,token);
            }
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
            console.log(dataTareas);
            const arrayTareas=dataTareas
            for (let i = 0; i < arrayTareas.length; i++) {
                const element = arrayTareas[i];
                const template=`<li class="tarea">
                <div class="not-done">${element.completed}</div>
                <div class="descripcion">
                  <p class="nombre">${element.description}</p>
                  <p class="timestamp">Creada: ${element.createdAt}</p>
                </div>
              </li>`;
                if (element.completed== false) {
                    divTareaPendientes.innerHTML+=template;                    
                }else{
                    divTareaTeminadas.innerHTML+=template;
                }
            }     
        })

    }


    fomulario.addEventListener('submit',function(e){
        e.preventDefault();
        const nuevaTarea=document.querySelector('#nuevaTarea');
        const resultadoValidacion= validarTarea(nuevaTarea.value)
        const tareaLista = resultadoValidacion?  normalizacionTarea(nuevaTarea.value) : alert('Ingrese un detalle para la tarrea que desea agregar.');
        crearTareas(`${apiUrl}/tasks`,token, tareaLista);
        fomulario.reset();
    })

    function validarTarea(tarea) {
        return tarea===''?false:true;
    }

    function normalizacionTarea(tarea) {
        const usuario = {
            description: tarea,
            completed:true
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
            location.reload();    
        })
    }

    btnCerrarSesion.addEventListener('click',function(e){        
        e.preventDefault();
        sessionStorage.getItem('token')!=undefined?sessionStorage.removeItem('token'):localStorage.removeItem('token');
        location.href = '/index.html';
    })
    




















})