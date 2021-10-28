checksession();
function checksession(){    
    if (localStorage.getItem('token')) {
        location.href = '/mis-tareas.html';            
    }
    else{
            window.addEventListener('load', function(){
                /* -------------------------------------------------------------------------- */
                /*                              logica del login                              */
                /* -------------------------------------------------------------------------- */
                
                const formulario =  this.document.forms[0];
                const inputEmail =  this.document.querySelector('#inputEmail');
                const inputPassword = this.document.querySelector('#inputPassword');
                const inputChecBox= document.querySelector('#mantenerInicioSesion')
                const expresionCorreo = /[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+\.[a-zA-Z]{3}/;
                const expresionPassword= /[a-zA-Z0-9_.-]{4,8}/;    
                const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1/users/login'
                
                
                
                formulario.addEventListener('submit', function(event){
                    event.preventDefault();
                    
                    const resultadoValidacion = validarBackEnd(inputEmail.value) && validarBackEnd(inputPassword.value);

                    if(resultadoValidacion){
                        //desplegamos la logica de una validacion correcta
                        document.querySelector('#formulario__mensaje').classList.remove('formulario__mensaje-activo')
                        const datosUsuario = normalizacionLogin(inputEmail.value, inputPassword.value)
                        console.log(datosUsuario);
                        fetchApiLogin(apiUrl, datosUsuario,inputChecBox.checked);
                    } else{
                        console.log("no pasó alguna validacion");
                    }
                    
                    formulario.reset();
                });
                
                
                
                
                /* -------------------------------------------------------------------------- */
                /*                               funcionalidades                              */
                /* -------------------------------------------------------------------------- */
                
                
                
                inputEmail.addEventListener('blur',function validarFrontEnd() {
                    if (expresionCorreo.test(inputEmail.value)) {       
                        document.getElementById('grupo__correo').classList.remove('formulario__grupo-incorrecto');
                    }else {
                        document.getElementById('grupo__correo').classList.add('formulario__grupo-incorrecto'); 
                    } 
                    
                })
                
                inputPassword.addEventListener('blur',function validarFrontEnd() {
                    if (expresionPassword.test(inputPassword.value)) {  
                        document.getElementById('grupo__password').classList.remove('formulario__grupo-incorrecto');
                    }else {
                        document.getElementById('grupo__password').classList.add('formulario__grupo-incorrecto'); 
                    } 
                })
                
                
                
                function validarBackEnd(dato) {
                    let restultado = true;
                    // causales de que no pase la validacion
                    if(dato === ""){
                        restultado = false;
                    }
                    return restultado;
                }
                
                
                
                
                function normalizacionLogin(email, password) {
                    const usuario = {
                        email: email.toLowerCase().trim(),
                        password: password.trim()
                    }        
                    return usuario;
                }
                
                function fetchApiLogin(url, payload, infocheck) {
                    
                    const settings = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    }
                    
                    fetch(url, settings)
                    .then( respuesta => respuesta.json())
                    .then( data => {
                        if(data.jwt){        
                                console.log(infocheck);
                                if (infocheck) {
                                    localStorage.setItem('token', data.jwt)
                                }else{                        
                                sessionStorage.setItem('token', data.jwt);
                                }
                        // accionar pensando en que el resultado es un usuario y contraseña correctos
                        /* localStorage.setItem('token', data.jwt); */
                        //redijo a la pantalla de tareas
                        location.href = './mis-tareas.html';
                    }else{
                        document.querySelector('#formulario__mensaje').classList.add('formulario__mensaje-activo')
                    }
                })   
            
            }
        }
    )}

};