var url = window.location.href;
var swLocation = '/mensajero/sw.js';

var swReg;

if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }


    window.addEventListener('load', function() {

        navigator.serviceWorker.register( swLocation ).then( function(reg){

            swReg = reg;
            swReg.pushManager.getSubscription().then( verificaSuscripcion );

        });

    });

}

// Referencias de jQuery

// Referencias de jQuery
var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8';

// Google Maps llaves alternativas - desarrollo
// AIzaSyDyJPPlnIMOLp20Ef1LlTong8rYdTnaTXM
// AIzaSyDzbQ_553v-n8QNs2aafN9QaZbByTyM7gQ
// AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8
// AIzaSyCroCERuudf2z02rCrVa6DTkeeneQuq8TA
// AIzaSyBkDYSVRVtQ6P2mf2Xrq0VBjps8GEcWsLU
// AIzaSyAu2rb0mobiznVJnJd6bVb5Bn2WsuXP2QI
// AIzaSyAZ7zantyAHnuNFtheMlJY1VvkRBEjvw9Y
// AIzaSyDSPDpkFznGgzzBSsYvTq_sj0T0QCHRgwM
// AIzaSyD4YFaT5DvwhhhqMpDP2pBInoG8BTzA9JY
// AIzaSyAbPC1F9pWeD70Ny8PHcjguPffSLhT-YF8


var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

var btnActivadas    = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');


var btnLocation      = $('#location-btn');

var modalMapa        = $('.modal-mapa');

var btnTomarFoto     = $('#tomar-foto-btn');
var btnPhoto         = $('#photo-btn');
var contenedorCamara = $('.camara-contenedor');

var lat  = null;
var lng  = null; 
var foto = null; 

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;

const camara = new Camara( $('#player')[0] );

// ===== Codigo de la aplicaciÃ³n

function crearMensajeHTML(mensaje, personaje, lat, lng, foto) {

    // console.log(mensaje, personaje, lat, lng);

    var content =`
    <li class="animated fadeIn fast"
        data-user="${ personaje }"
        data-mensaje="${ mensaje }"
        data-tipo="mensaje">


        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
                `;
    
    if ( foto ) {
        content += `
                <br>
                <img class="foto-mensaje" src="${ foto }">
        `;
    }
        
    content += `</div>        
                <div class="arrow"></div>
            </div>
        </li>
    `;

    
    // si existe la latitud y longitud, 
    // llamamos la funcion para crear el mapa
    if ( lat ) {
        crearMensajeMapa( lat, lng, personaje );
    }
    
    // Borramos la latitud y longitud por si las usó
    lat = null;
    lng = null;

    $('.modal-mapa').remove();

    timeline.prepend(content);
    cancelarBtn.click();

}

function crearMensajeMapa(lat, lng, personaje) {


    let content = `
    <li class="animated fadeIn fast"
        data-tipo="mapa"
        data-user="${ personaje }"
        data-lat="${ lat }"
        data-lng="${ lng }">
                <div class="avatar">
                    <img src="img/avatars/${ personaje }.jpg">
                </div>
                <div class="bubble-container">
                    <div class="bubble">
                        <iframe
                            width="100%"
                            height="250"
                            frameborder="0" style="border:0"
                            src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                            </iframe>
                    </div>
                    
                    <div class="arrow"></div>
                </div>
            </li> 
    `;

    timeline.prepend(content);
}

// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});


// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
    if ( !modal.hasClass('oculto') ) {
        modal.animate({ 
            marginTop: '+=1000px',
            opacity: 0
         }, 200, function() {
             modal.addClass('oculto');
             txtMensaje.val('');
         });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    var data = {
        message: mensaje,
        user: usuario,
        lat: lat,
        lng: lng,
        photo: foto
    };

    console.log(data);

    fetch('http://proyectoPWA.test/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    })
    .then( res => res.json() )
    .then( res => console.log( 'app.js', res ))
    .catch( err => console.log( 'app.js error:', err ));



    crearMensajeHTML( mensaje, usuario, lat, lng, foto );

});



// Obtener mensajes del servidor
function getMensajes() {

    fetch('http://proyectoPWA.test/api/messages')
        .then( res => res.json() )
        .then( respuesta => {
            console.log(respuesta);
            posts = respuesta;
            console.log(posts);
            posts.forEach( post =>{
                lat= post.latitude;
                lng = post.longitude;
                crearMensajeHTML( post.message, post.user, lat, lng, post.photo );
            });

        });


}

getMensajes();



// Detectar cambios de conexión
function isOnline() {

    if ( navigator.onLine ) {
        // tenemos conexión
        // console.log('online');
        $.mdtoast('Online', {
            interaction: true,
            interactionTimeout: 1000,
            actionText: 'OK!'
        });


    } else{
        // No tenemos conexión
        $.mdtoast('Offline', {
            interaction: true,
            actionText: 'OK',
            type: 'warning'
        });
    }

}

window.addEventListener('online', isOnline );
window.addEventListener('offline', isOnline );

isOnline();

function enviarNotificacion(mensaje) {

    const notificationOpts = {
        body: mensaje,
        icon: 'img/icons/icon-72x72.png'
    };


    const n = new Notification('Mensajero', notificationOpts);

    n.onclick = () => {
        console.log('Click');
    };

}


function notificarme() {

    if ( !window.Notification ) {
        console.log('Este navegador no soporta notificaciones');
        return;
    }

    if ( Notification.permission === 'granted' ) {
        
        // new Notification('Hola Mundo! - granted');
        enviarNotificacion("Con permisos activados");

    } else if ( Notification.permission !== 'denied' || Notification.permission === 'default' )  {

        Notification.requestPermission( function( permission ) {

            console.log( permission );

            if ( permission === 'granted' ) {
                // new Notification('Hola Mundo! - pregunta');
                enviarNotificacion("Acepto envio de notificaciones");
            }

        });

    }
}

//notificarme();

function verificaSuscripcion( activadas ) {

    if ( activadas ) {
        
        btnActivadas.removeClass('oculto');
        btnDesactivadas.addClass('oculto');

    } else {
        btnActivadas.addClass('oculto');
        btnDesactivadas.removeClass('oculto');
    }

}

// Get Key
function getPublicKey() {

     /*fetch('api-push/key')
         .then( res => res.text())
         .then( console.log );*/

    return fetch('api-push/key')
        .then( res => res.arrayBuffer())
        // returnar arreglo, pero como un Uint8array
        .then( key => new Uint8Array(key) );


}

//getPublicKey();
//getPublicKey().then(console.log);

btnDesactivadas.on( 'click', function() {

    if ( !swReg ) return console.log('No hay registro de SW');

    getPublicKey().then( function( key ) {

        //Generar la subscripción
        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
        .then( res => res.toJSON() )
        .then( suscripcion => {

             //console.log(suscripcion);
             //verificaSuscripcion(suscripcion);
            fetch('api-push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( suscripcion )
            })
            .then( verificaSuscripcion )
            .catch( cancelarSuscripcion );


        });


    });


});

function cancelarSuscripcion() {

    swReg.pushManager.getSubscription().then( subs => {

        subs.unsubscribe().then( () =>  verificaSuscripcion(false) );

    });


}

btnActivadas.on( 'click', function() {

    cancelarSuscripcion();


});


// Crear mapa en el modal
function mostrarMapaModal(lat, lng) {

    $('.modal-mapa').remove();
    
    var content = `
            <div class="modal-mapa">
                <iframe
                    width="100%"
                    height="250"
                    frameborder="0"
                    src="https://www.google.com/maps/embed/v1/view?key=${ googleMapKey }&center=${ lat },${ lng }&zoom=17" allowfullscreen>
                    </iframe>
            </div>
    `;

    modal.append( content );
}


// Sección - Recursos Nativos


// Obtener la geolocalización
btnLocation.on('click', () => {

//    console.log('Botón geolocalización');
    if (navigator.geolocation){
        $.mdtoast('Cargando mapa ...',{
            interation: true,
            interactionTimeout: 2000,
            actionText: 'Ok!'
        });

        navigator.geolocation.getCurrentPosition(pos => {
          console.log(pos);

          mostrarMapaModal( pos.coords.latitude, pos.coords.longitude);

          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        });
    } else {
        console.log("No hace uso de la geolocalización");
    }

      

});



// Boton de la camara
// usamos la funcion de fleca para prevenir
// que jQuery me cambie el valor del this
btnPhoto.on('click', () => {

    console.log('Inicializar camara');
    contenedorCamara.removeClass('oculto');

    camara.encender();

});


// Boton para tomar la foto
btnTomarFoto.on('click', () => {

    console.log('Botón tomar foto');

    foto = camara.tomarFoto();

    camara.apagar();
    
    // console.log(foto);

});


// Share API
/*if ( navigator.share ){
    console.log("Navegador lo soporta");
} else {
    console.log("Navegador no lo soporta");    
}*/


timeline.on('click', 'li', function() {

    // console.log(  $(this)  );
    
    let tipo    = $(this).data('tipo');
    let lat     = $(this).data('lat');
    let lng     = $(this).data('lng');
    let mensaje = $(this).data('mensaje');
    let user    = $(this).data('user');
    
    console.log({ tipo, lat, lng, mensaje, user  });


    const shareOpts = {
        title: user,
        text: mensaje
    };

    if ( tipo === 'mapa' ) {
        shareOpts.text = 'Mapa';
        shareOpts.url  = `https://www.google.com/maps/@${ lat },${ lng },15z`;
    }

    navigator.share(shareOpts)
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));

});
