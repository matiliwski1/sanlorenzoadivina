const ESCUDO_SAN_LORENZO = 'https://assets.football-logos.cc/logos/argentina/256x256/san-lorenzo-de-almagro.a0e4e931.png';
 
const ESCUDOS_RIVALES = {
  'Boca Juniors': 'https://assets.football-logos.cc/logos/argentina/256x256/boca-juniors.533fd0f6.png',
  'River Plate': 'https://assets.football-logos.cc/logos/argentina/256x256/river-plate.1ac01d84.png',
  'Racing Club': 'https://assets.football-logos.cc/logos/argentina/256x256/racing-club.2e7a0fc0.png',
  'Independiente': 'https://assets.football-logos.cc/logos/argentina/256x256/independiente.fe207eca.png',
  'Huracán': 'https://assets.football-logos.cc/logos/argentina/256x256/ca-huracan.7f8adc63.png',
  'Velez': 'https://assets.football-logos.cc/logos/argentina/256x256/velez-sarsfield.15cda916.png',
  'Lanus': 'https://assets.football-logos.cc/logos/argentina/256x256/lanus.d7276bc2.png',
  'Estudiantes': 'https://assets.football-logos.cc/logos/argentina/256x256/estudiantes-de-la-plata.5e953e40.png',
  'Newell\'s': 'https://assets.football-logos.cc/logos/argentina/256x256/newells-old-boys.44715cf2.png',
  'Rosario Central': 'https://assets.football-logos.cc/logos/argentina/256x256/rosario-central.ce18e01e.png',
  'Colon': 'https://assets.football-logos.cc/logos/argentina/256x256/colon-santa-fe.b70927bf.png',
  'Argentinos Juniors': 'https://assets.football-logos.cc/logos/argentina/256x256/argeninos-juniors.57b88ab8.png',
  'Banfield': 'https://assets.football-logos.cc/logos/argentina/256x256/banfield.f17d9e4b.png',
  'Union': 'https://assets.football-logos.cc/logos/argentina/256x256/union.0d305081.png',
  'Gimnasia y Esgrima La Plata': 'https://assets.football-logos.cc/logos/argentina/256x256/gimnasia-lp.0b23882a.png',
  'Talleres': 'https://assets.football-logos.cc/logos/argentina/256x256/talleres.3c2c2930.png',
  'Belgrano': 'https://assets.football-logos.cc/logos/argentina/256x256/belgrano.1b7471ec.png',
  'Tigre': 'https://assets.football-logos.cc/logos/argentina/256x256/tigre.f0a44434.png',
};
 
function buscarEscudoRival(nombreRival) {
  if (ESCUDOS_RIVALES[nombreRival]) return ESCUDOS_RIVALES[nombreRival];
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
 
  escudoSlEl.onerror = () => { escudoSlEl.style.display = 'none'; };
  escudoSlEl.style.display = '';
  escudoSlEl.src = ESCUDO_SAN_LORENZO;
 
  const escudoRival = buscarEscudoRival(partido.rival);
  if (escudoRival) {
    escudoRivalEl.onerror = () => { escudoRivalEl.style.display = 'none'; };
    escudoRivalEl.style.display = '';
    escudoRivalEl.src = escudoRival;
  } else {
    escudoRivalEl.removeAttribute('src');
    escudoRivalEl.style.display = 'none';
  }
 
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
 
