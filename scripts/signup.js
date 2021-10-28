
            window.addEventListener('load', function(){
                /* -------------------------------------------------------------------------- */
                /*                              logica del login                              */
                /* -------------------------------------------------------------------------- */
                
                const formulario =  this.document.forms[0];
                const inputNombre =  this.document.querySelector('#inputNombre');
                const inputApellido =  this.document.querySelector('#inputApellido');
                const inputEmail =  this.document.querySelector('#inputEmail');
                const inputPassword = this.document.querySelector('#inputPassword');
                const inputPassword2 = this.document.querySelector('#inputPassword2');
                const expresionCorreo = /[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+\.[a-zA-Z]{3}/;
                const expresionPassword= /[a-zA-Z0-9_.-]{4,8}/;
                const expresionNomyAp= /^[a-zA-ZÀ-ÿ\s]{1,40}$/;

                const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1/users'
                
                formulario.addEventListener('submit', function(event){
                    event.preventDefault();
                    
                    const resultadoValidacion = validarBackEnd(inputEmail.value) && validarBackEnd(inputPassword.value) && validarBackEnd(inputNombre.value) && validarBackEnd(inputApellido.value);

                    if(resultadoValidacion){
                        //desplegamos la logica de una validacion correcta
                        document.querySelector('#formulario__mensaje').classList.remove('formulario__mensaje-activo')
                        const datosUsuario = normalizacionLogin(inputNombre.value, inputApellido.value,inputEmail.value, inputPassword.value,)
                        console.log(datosUsuario);
                        fetchApiLogin(apiUrl, datosUsuario);
                    } else{
                        console.log("no pasó alguna validacion");
                    }
                    
                    formulario.reset();
                });
                
                
                
                
                /* -------------------------------------------------------------------------- */
                /*                               funcionalidades                              */
                /* -------------------------------------------------------------------------- */
                
                
                inputNombre.addEventListener('blur',function validarFrontEnd() {
                    if (expresionNomyAp.test(inputNombre.value)) {       
                        document.getElementById('grupo__nombre').classList.remove('formulario__grupo-incorrecto');
                    }else {
                        document.getElementById('grupo__nombre').classList.add('formulario__grupo-incorrecto'); 
                    }                     
                })

                inputApellido.addEventListener('blur',function validarFrontEnd() {
                    if (expresionNomyAp.test(inputApellido.value)) {       
                        document.getElementById('grupo__apellido').classList.remove('formulario__grupo-incorrecto');
                    }else {
                        document.getElementById('grupo__apellido').classList.add('formulario__grupo-incorrecto'); 
                    }                     
                })

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
                
                inputPassword2.addEventListener('blur',function validarFrontEnd() {
                    if (inputPassword.value === inputPassword2.value) {  
                        document.getElementById('grupo__password2').classList.remove('formulario__grupo-incorrecto');
                    }else {
                        document.getElementById('grupo__password2').classList.add('formulario__grupo-incorrecto'); 
                    } 
                })
                
                function validarBackEnd(dato) {
                    let restultado = true;
                    // causales de que no pase la validacion
                    if(dato === ""){
                        restultado = false;
                    }
                    if (dato.value === inputPassword.value) {
                        if (dato.value !== inputPassword2.value) {
                            restultado = false;
                        }
                    }
                    return restultado;
                }   
                
                function normalizacionLogin(name, apellido, email, password) {
                    const usuario = {
                        firstName: name.trim(),
                        lastName:apellido.trim(),
                        email: email.toLowerCase().trim(),
                        password: password.trim()
                    }        
                    return usuario;
                }
                
                function fetchApiLogin(url, payload) {
                    
                    const settings = {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload)
                    }
                    
                    fetch(url, settings)
                    .then( respuesta => respuesta.json())
                    .then( data => {
                        if(data.jwt){        
                                sessionStorage.setItem('token', data.jwt);
                                // accionar pensando en que el resultado es un usuario y contraseña correctos
                                /* localStorage.setItem('token', data.jwt); */
                                //redijo a la pantalla de tareas
                                location.href = '/mis-tareas.html';
                        }
                    else{
                        document.querySelector('#formulario__mensaje').classList.add('formulario__mensaje-activo')
                    }
                })
            }
        })
