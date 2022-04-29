const seccion = document.querySelector('.contenedor');
const openModal = document.querySelector('.addPoke');
const modalDex = document.getElementById('modalPokedex');
const closeModal = document.getElementById('closePokedex');
const forNameId = document.querySelector('.forNameOID');
const show = document.querySelector('.forType');
const audio = document.getElementById('audio1');
const iconSound = document.getElementById('iconSound');
const formName = document.getElementById('formName');
const formType = document.getElementById('formType');
const modalType = document.getElementById('modalType');
const buttonBackType = document.querySelector('.backModalType');
const conteinerTypePokemon = document.querySelector('.conteinerTypeCard');
const dialogName = document.querySelector('.dialogName');
const searchName = document.getElementById('searchName');
const backName = document.getElementById('backName');
const dialog = document.querySelector('.dialogType');
const search = document.querySelector('.search');
const back = document.querySelector('.back');

/// -----------------  EVENTOS --------------------------///


//Evento para mutear y reproducir sonidos y sus estilos
iconSound.addEventListener('click', (e) =>{
    if (iconSound.classList.contains('active')) {
        audio.pause();
        iconSound.classList.remove('active');
        iconSound.style.background = 'black';
        iconSound.style.color = 'white';
        iconSound.style.border = '2px solid white'       
    } else{
        audio.play();
        iconSound.classList.add('active')
        iconSound.style.removeProperty('color');
        iconSound.style.removeProperty('background');
        iconSound.style.border = '2px solid black';  
    }
})

// Abrir y cerrar Modal Primario Pokedex
openModal.addEventListener('click',(e)=>{
    e.preventDefault();    
    modalDex.classList.add('show');
})
closeModal.addEventListener('click',(e)=>{
    e.preventDefault();
    modalDex.classList.remove('show');
    SoundManager();
})

// MODAL PARA BUSCAR POR ID Y NOMBRES

//Modal Para buscar por nombre o ID
forNameId.addEventListener('click', (e)=>{
    e.preventDefault();
    dialogName.showModal();
})

backName.addEventListener('click', (e) =>{
    e.preventDefault();
    dialogName.close();
})

// evento para agregar cards y pokemones seleccinados
searchName.addEventListener('click', (e)=>{   
    
    const inputNameId = document.getElementById('inputName').value;
    formName.reset();
    //Url modificable de forma dinamica
    const urlApiPokemon = `https://pokeapi.co/api/v2/pokemon/${inputNameId}`;
    
    if (inputNameId > 898) {
        swal("Oops...", "Solo Puedes Ingresar un numero del 1 al 899", "error");
    } 
    if (inputNameId == '') {
        swal("Oops...", "Tiene que ingresar un nombre o ID del Pokémon", "error");               
    } else {
        //Peticion el la Api y Creacion de la Card
        obtenerPokemon(urlApiPokemon);        
    }
    dialogName.close();
    modalDex.classList.remove('show');
    SoundManager();
    
})

//MODAL PARA BUSCAR POR TIPO DE POKEMON

//Modal Selector de tipos
show.addEventListener('click', (e)=>{
    e.preventDefault();
    dialog.showModal();
})

back.addEventListener('click', (e)=>{
    e.preventDefault();
    dialog.close();
})

//Modal Mostrar Tipos de Pokemon
search.addEventListener('click',(e)=>{
    e.preventDefault();
    const typePokSelect = document.getElementById('pokeType').value;
    //Reset Etiqueta Select
    document.getElementById('pokeType').selectedIndex = 0;

    if (typePokSelect == 'Elige tu Pokemon') {
        swal("Oops...", "Tienes que seleccionar un tipo de Pokémon", "error");        
    } else {
        //Obtener pokemones del tipo seleccionado para crear card
        obtenertypesPokemon(typePokSelect);
        modalType.classList.add('show');
        conteinerTypePokemon.innerHTML = '';
    }

    dialog.close();
    modalDex.classList.remove('show');
    SoundManager();
})

//Evento para volver a pantalle principal
buttonBackType.addEventListener('click',(e)=>{
    e.preventDefault();
    conteinerTypePokemon.innerHTML = '';
    modalDex.classList.add('show');
    modalType.classList.remove('show');
    SoundManager();
    
})

///--------------------------- PETICIONES A LA API POKEMON -------------------------//

// Peticion para obtener pokemon por nombre o ID
const obtenerPokemon = async(urlApi) =>{
    try {
        const res = await fetch(urlApi);
        const data = await res.json();
        
        let tipo2 = [];

        for (let i = 0; i <data.types.length ; i++) {            
            tipo2.push(data.types[i].type.name)
        }

        const pokemon = {
            id: data.id,
            name: data.name,
            img: data.sprites.other.home.front_default,
            imgShiny:data.sprites.other.home.front_shiny,
            type1:tipo2[0],
            type2:tipo2[1] == undefined? '': tipo2[1],
            imgCaptura:data.sprites.front_default           
        }

        crearCard(pokemon);

    } catch (error) {
        swal("Oops...", "Tiene que ingresar un nombre o ID del Pokémon", "error"); 
    }
}

//Peticion de tipos de pokemon
const obtenertypesPokemon = async(typePokemon) =>{
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${typePokemon}/`);
        const data = await res.json();

        data.pokemon.forEach(element => {
            const urlType = `https://pokeapi.co/api/v2/pokemon/${element.pokemon.name}`;

            obtenerPoke(urlType, typePokemon);
        });        
        

    } catch (error) {
        console.log(error)
    }
}

// peticion de cada pokemon que estan dentro de determinado tipo
const obtenerPoke = async(urlType, typeColor) =>{
    try {
        const res = await fetch(urlType);
        const data = await res.json();        

        const poke = {
            id: data.id,
            name: data.name,
            img: data.sprites.other.home.front_default                      
        }
        if (poke.id < 898) {
            crearMiniCard(poke, typeColor);            
        }


    } catch (error) {
        swal("Oops...", "Tiene que ingresar un nombre o ID del Pokémon", "error"); 
    }
}
///-------------------- Creacion Elementos DOM ---------------------///

//Crear Card pagina principal con los tipos y nombres pokemon
const crearCard = (pokemon) =>{   
    const div = document.createElement('div')

    color(pokemon , div);
    
    const namePok = pokemon.name.charAt(0).toUpperCase()+pokemon.name.substring(1).toLowerCase();

    if (pokemon.type2 == '') {

        div.classList.add('card')
        
        div.innerHTML = `<img src="${pokemon.img}" alt="${pokemon.name}">
            <p class="name">${namePok}</p>
            <p class="type" id="type">${pokemon.type1}</p>
            <button class="remove" onclick="removeCard(event)"><ion-icon name="close-circle-outline"></ion-icon></button>`
        seccion.appendChild(div);

        div.childNodes[4].style.color =`var(--${pokemon.type1})`;

    } else {
        div.classList.add('card2')
        
        div.innerHTML = `<img src="${pokemon.img}" alt="${pokemon.name}">
            <p class="name">${namePok}</p>
            <p class="type" id="type">${pokemon.type1}</p>
            <p class="type2" id="type">${pokemon.type2}</p>
            <button class="remove" onclick="removeCard(event)"><ion-icon name="close-circle-outline"></ion-icon></button>`
        seccion.appendChild(div);
        
        div.childNodes[4].style.color =`var(--${pokemon.type1})`;
        div.childNodes[6].style.color =`var(--${pokemon.type2})`;
        
    }        
}

//Crear Mini card para modal por tipos
const crearMiniCard = (poke,typeColor) =>{
    const div = document.createElement('div');

    color('' , div, typeColor);

    div.classList.add('miniCard')
        
        div.innerHTML = `<div class="pokeContent">
        <img title="${poke.name}" class="imgType" src="${poke.img}" alt="${poke.name}">
        <p class="textId">ID.: ${poke.id}</p>
    </div> 
    <button class="catchPokemon" onclick="capturarPorTipo(${poke.id})">Capturar</button>`
    
    conteinerTypePokemon.appendChild(div);
} 

///------------------------------ FUNCIONES ----------------------------------///

//Funcion para pausar sonido page
const SoundManager = () => {
    if (iconSound.classList.contains('active')) {
        audio.play();
    } else {
        audio.pause();
    }
}

//Funcion para borrar cards del DOM
function removeCard (e){    
    e.target.offsetParent.remove();    
    
}

//Pinta el fondo dependiendo la cantidad de tipos tenga el pokemon y pinta miniCard con el 3° argumento
const color =(pokemon , div, type)=>{
    
    const tipo1 = pokemon.type1;   
    const tipo2 = pokemon.type2; 
    const tipo3 = type;

    if (tipo2 == ''){
        div.style.background = ColorGradient[tipo1]
    }else{
        div.style.backgroundImage = 'linear-gradient(130deg, '+ColorGradient[tipo1]+' 40%,'+ColorGradient[tipo2]+' 60%)'
    }

    if (tipo3 != '') {
        div.style.background = ColorGradient[tipo3]
    }
}

//Funcion para Cerrar Modal de tipospokemon y obtener card.
const capturarPorTipo = (idPoke) =>{
    
    const urlId = `https://pokeapi.co/api/v2/pokemon/${idPoke}`

    obtenerPokemon(urlId)
    modalType.classList.remove('show');
}

///------------------------------- OBJETOS y CLASES -------------------------------//

// Objeto donde se obtiene el color por tipo.
const ColorGradient = {
    steel :'#696969',
    water : '#188BE0',
    bug : '#A8B820',
    dragon : '#7766EE',
    electric : '#F8D030',
    ghost : '#705898',
    fire : '#FF4422',
    fairy : '#EE99AC',
    ice : '#82DEF5',
    fighting : '#C03028',
    normal : '#A8A878',
    grass : '#78C850',
    psychic : '#F85888',
    rock : '#B8A038',
    dark : '#554940',
    ground : '#E0C068',
    poison : '#A040A0',
    flying : '#A890F0'
}