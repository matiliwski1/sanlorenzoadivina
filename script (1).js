// Escudos vía Wikimedia Commons (Special:FilePath resuelve al archivo real).
// Si un rival no está en la lista, o el archivo no carga, el escudo simplemente no se muestra.
function urlEscudo(nombreArchivo) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(nombreArchivo)}`;
}

const ESCUDO_SAN_LORENZO = urlEscudo('Escudo del Club Atlético San Lorenzo de Almagro.svg');

const ESCUDOS_RIVALES = {
  'Boca Juniors': urlEscudo('CABJ 70 años.png'),
  'River Plate': urlEscudo('River Plate logo.svg'),
  'Racing Club': urlEscudo('Racing Club de Avellaneda logo.svg'),
  'Independiente': urlEscudo('Club Atlético Independiente Logo.svg'),
  'Huracán': urlEscudo('Club Atlético Huracán logo.svg'),
  'Velez': urlEscudo('Club Atlético Vélez Sársfield logo.svg'),
  'Estudiantes': urlEscudo('Club Estudiantes de La Plata.svg'),
  'Gimnasia y Esgrima La Plata': urlEscudo('Gimnasia y Esgrima La Plata Logo.svg'),
  'Newell\'s': urlEscudo('Newells Old Boys.svg'),
  'Rosario Central': urlEscudo('Club Atlético Rosario Central.svg'),
  'Lanus': urlEscudo('Club Atlético Lanús Logo.svg'),
  'Banfield': urlEscudo('Club Atlético Banfield.svg'),
  'Colon': urlEscudo('Club Atlético Colón Logo.svg'),
  'Union': urlEscudo('Club Atlético Unión (Santa Fe) Logo.svg'),
  'Talleres': urlEscudo('Talleres de Córdoba.svg'),
  'Godoy Cruz': urlEscudo('Club Godoy Cruz Antonio Tomba.svg'),
  'Argentinos Juniors': urlEscudo('Argentinos Juniors.svg'),
  'Tigre': urlEscudo('Club Atlético Tigre.svg'),
  'Defensa y Justicia': urlEscudo('Club Social y Deportivo Defensa y Justicia.svg'),
  'Platense': urlEscudo('Club Atlético Platense logo.svg'),
  'Instituto': urlEscudo('Instituto Atlético Central Córdoba.svg'),
  'Atletico Tucuman': urlEscudo('Club Atlético Tucumán.svg'),
  'Sarmiento': urlEscudo('Club Atlético Sarmiento (Junín).svg'),
  'Belgrano': urlEscudo('Club Atlético Belgrano.svg'),
  'Arsenal': urlEscudo('Arsenal Fútbol Club (Argentina).svg'),
  'Quilmes': urlEscudo('Quilmes Atlético Club logo.svg'),
};

function buscarEscudoRival(nombreRival) {
  if (ESCUDOS_RIVALES[nombreRival]) return ESCUDOS_RIVALES[nombreRival];
  // Coincidencia parcial por si el nombre viene con aclaraciones, ej. "Central Cordoba Sgo del Estero"
  const clave = Object.keys(ESCUDOS_RIVALES).find(k => nombreRival.includes(k));
  return clave ? ESCUDOS_RIVALES[clave] : null;
}

let todosLosPartidos = [];
let mazoActual = [];
let indiceActual = 0;
let puntos = 0;

const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaJuego = document.getElementById('pantalla-juego');
const pantallaFin = document.getElementById('pantalla-fin');

const selectDesde = document.getElementById('anio-desde');
const selectHasta = document.getElementById('anio-hasta');
const cantidadPartidosEl = document.getElementById('cantidad-partidos');
const btnEmpezar = document.getElementById('btn-empezar');

const puntosEl = document.getElementById('puntos');
const fechaEl = document.getElementById('fecha-partido');
const competicionEl = document.getElementById('competicion-partido');
const rivalEl = document.getElementById('rival-partido');
const condicionEl = document.getElementById('condicion-partido');
const escudoSlEl = document.getElementById('escudo-sl');
const escudoRivalEl = document.getElementById('escudo-rival');
const labelRivalEl = document.getElementById('label-rival');
const formPrediccion = document.getElementById('form-prediccion');
const golesSlInput = document.getElementById('goles-sl');
const golesRivalInput = document.getElementById('goles-rival');
const feedbackEl = document.getElementById('resultado-feedback');

const resultadoRealFinEl = document.getElementById('resultado-real-fin');
const puntosFinEl = document.getElementById('puntos-fin');
const btnReintentar = document.getElementById('btn-reintentar');

function mostrarPantalla(pantalla) {
  [pantallaInicio, pantallaJuego, pantallaFin].forEach(p => p.classList.add('oculta'));
  pantalla.classList.remove('oculta');
}

function mezclar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function traducirCondicion(cond) {
  if (cond === 'Local') return 'San Lorenzo de local';
  if (cond === 'Visitante') return 'San Lorenzo de visitante';
  return 'Cancha neutral';
}

function poblarSelectoresAnio() {
  const anios = [...new Set(todosLosPartidos.map(p => p.year))].sort((a, b) => a - b);
  anios.forEach(anio => {
    const opt1 = document.createElement('option');
    opt1.value = anio;
    opt1.textContent = anio;
    selectDesde.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = anio;
    opt2.textContent = anio;
    selectHasta.appendChild(opt2);
  });
  selectDesde.value = anios[0];
  selectHasta.value = anios[anios.length - 1];
  actualizarCantidad();
}

function actualizarCantidad() {
  const desde = parseInt(selectDesde.value);
  const hasta = parseInt(selectHasta.value);
  const [min, max] = desde <= hasta ? [desde, hasta] : [hasta, desde];
  const cantidad = todosLosPartidos.filter(p => p.year >= min && p.year <= max).length;
  cantidadPartidosEl.textContent = `${cantidad} partidos disponibles en ese período`;
}

selectDesde.addEventListener('change', actualizarCantidad);
selectHasta.addEventListener('change', actualizarCantidad);

btnEmpezar.addEventListener('click', () => {
  const desde = parseInt(selectDesde.value);
  const hasta = parseInt(selectHasta.value);
  const [min, max] = desde <= hasta ? [desde, hasta] : [hasta, desde];

  const filtrados = todosLosPartidos.filter(p => p.year >= min && p.year <= max);
  if (filtrados.length === 0) {
    alert('No hay partidos en ese período. Elegí otro rango.');
    return;
  }

  mazoActual = mezclar(filtrados);
  indiceActual = 0;
  puntos = 0;
  puntosEl.textContent = puntos;
  mostrarPantalla(pantallaJuego);
  mostrarSiguientePartido();
});

function mostrarSiguientePartido() {
  if (indiceActual >= mazoActual.length) {
    // Se acabaron los partidos del período elegido: se vuelve a mezclar y se sigue
    mazoActual = mezclar(mazoActual);
    indiceActual = 0;
  }

  const partido = mazoActual[indiceActual];
  fechaEl.textContent = partido.date;
  competicionEl.textContent = `Torneo: ${partido.competition}`;
  rivalEl.textContent = partido.rival;
  labelRivalEl.textContent = partido.rival;
  condicionEl.textContent = traducirCondicion(partido.condition);

  escudoSlEl.src = ESCUDO_SAN_LORENZO;
  const escudoRival = buscarEscudoRival(partido.rival);
  escudoRivalEl.src = escudoRival || '';
  escudoRivalEl.onerror = () => { escudoRivalEl.removeAttribute('src'); };
  escudoSlEl.onerror = () => { escudoSlEl.removeAttribute('src'); };

  golesSlInput.value = '';
  golesRivalInput.value = '';
  feedbackEl.classList.add('oculta');
  golesSlInput.focus();
}

formPrediccion.addEventListener('submit', (e) => {
  e.preventDefault();
  const partido = mazoActual[indiceActual];
  const golesSl = parseInt(golesSlInput.value);
  const golesRival = parseInt(golesRivalInput.value);

  const acerto = golesSl === partido.goals_for && golesRival === partido.goals_against;

  if (acerto) {
    puntos++;
    puntosEl.textContent = puntos;
    feedbackEl.textContent = `¡Correcto! ${partido.goals_for}-${partido.goals_against}`;
    feedbackEl.className = 'feedback acierto';
    indiceActual++;
    setTimeout(mostrarSiguientePartido, 700);
  } else {
    resultadoRealFinEl.textContent = `${partido.goals_for} - ${partido.goals_against}`;
    puntosFinEl.textContent = puntos;
    mostrarPantalla(pantallaFin);
  }
});

btnReintentar.addEventListener('click', () => {
  mostrarPantalla(pantallaInicio);
});

fetch('partidos.json')
  .then(res => res.json())
  .then(data => {
    todosLosPartidos = data;
    poblarSelectoresAnio();
  })
  .catch(err => {
    console.error('Error cargando partidos.json', err);
    cantidadPartidosEl.textContent = 'Error cargando los datos de partidos.';
  });
