const ESCUDO_SAN_LORENZO = 'https://assets.football-logos.cc/logos/argentina/1500x1500/san-lorenzo-de-almagro.a0e4e931.png';
 
const ESCUDOS_RIVALES = {
  'Boca Juniors': 'https://assets.football-logos.cc/logos/argentina/1500x1500/boca-juniors.009a4e59.png',
  'River Plate': 'https://assets.football-logos.cc/logos/argentina/1500x1500/river-plate.1ac01d84.png',
  'Racing Club': 'https://assets.football-logos.cc/logos/argentina/1500x1500/racing-club.2e7a0fc0.png',
  'Independiente': 'https://assets.football-logos.cc/logos/argentina/1500x1500/independiente.fe207eca.png',
  'Huracán': 'https://assets.football-logos.cc/logos/argentina/1500x1500/ca-huracan.7f8adc63.png',
  'Velez': 'https://assets.football-logos.cc/logos/argentina/1500x1500/velez-sarsfield.15cda916.png',
  'Lanus': 'https://assets.football-logos.cc/logos/argentina/700x700/lanus.d7276bc2.png',
  'Estudiantes': 'https://assets.football-logos.cc/logos/argentina/700x700/estudiantes-de-la-plata.5e953e40.png',
  'Newell\'s': 'https://assets.football-logos.cc/logos/argentina/1500x1500/newells-old-boys.44715cf2.png',
  'Rosario Central': 'https://assets.football-logos.cc/logos/argentina/1500x1500/rosario-central.ce18e01e.png',
  'Colon': 'https://assets.football-logos.cc/logos/argentina/700x700/colon-santa-fe.b70927bf.png',
  'Argentinos Juniors': 'https://assets.football-logos.cc/logos/argentina/700x700/argeninos-juniors.57b88ab8.png',
  'Banfield': 'https://assets.football-logos.cc/logos/argentina/700x700/banfield.f17d9e4b.png',
  'Union': 'https://assets.football-logos.cc/logos/argentina/1500x1500/union.0d305081.png',
  'Gimnasia y Esgrima La Plata': 'https://assets.football-logos.cc/logos/argentina/700x700/gimnasia-lp.0b23882a.png',
  'Talleres': 'https://assets.football-logos.cc/logos/argentina/700x700/talleres.3c2c2930.png',
  'Belgrano': 'https://assets.football-logos.cc/logos/argentina/700x700/belgrano.1b7471ec.png',
  'Tigre': 'https://assets.football-logos.cc/logos/argentina/1500x1500/tigre.f0a44434.png',
};
 
function buscarEscudoRival(nombreRival) {
  if (ESCUDOS_RIVALES[nombreRival]) return ESCUDOS_RIVALES[nombreRival];
  const clave = Object.keys(ESCUDOS_RIVALES).find(k => nombreRival.includes(k));
  return clave ? ESCUDOS_RIVALES[clave] : null;
}
 
// Clasifica el texto de competición en una de 4 categorías para el filtro.
function clasificarCompeticion(comp) {
  const c = comp.toLowerCase();
  if (/(sudamericana|libertadores|recopa|conmebol|mercosur|interamericana)/.test(c)) return 'internacional';
  if (/(copa argentina|copa maradona|copa diego maradona)/.test(c)) return 'copa';
  return 'liga';
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
const filtroCompeticion = document.getElementById('filtro-competicion');
const cantidadPartidosEl = document.getElementById('cantidad-partidos');
const btnEmpezar = document.getElementById('btn-empezar');
 
const puntosEl = document.getElementById('puntos');
const fechaEl = document.getElementById('fecha-partido');
const competicionEl = document.getElementById('competicion-partido');
const condicionEl = document.getElementById('condicion-partido');
const escudoIzqEl = document.getElementById('escudo-izquierda');
const escudoDerEl = document.getElementById('escudo-derecha');
const nombreIzqEl = document.getElementById('nombre-izquierda');
const nombreDerEl = document.getElementById('nombre-derecha');
const labelIzqEl = document.getElementById('label-izquierda');
const labelDerEl = document.getElementById('label-derecha');
const formPrediccion = document.getElementById('form-prediccion');
const golesIzqInput = document.getElementById('goles-izquierda');
const golesDerInput = document.getElementById('goles-derecha');
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
  const comp = filtroCompeticion.value;
  const cantidad = todosLosPartidos.filter(p =>
    p.year >= min && p.year <= max &&
    (comp === 'todas' || clasificarCompeticion(p.competition) === comp)
  ).length;
  cantidadPartidosEl.textContent = `${cantidad} partidos disponibles en ese período`;
}
 
selectDesde.addEventListener('change', actualizarCantidad);
selectHasta.addEventListener('change', actualizarCantidad);
filtroCompeticion.addEventListener('change', actualizarCantidad);
 
btnEmpezar.addEventListener('click', () => {
  const desde = parseInt(selectDesde.value);
  const hasta = parseInt(selectHasta.value);
  const [min, max] = desde <= hasta ? [desde, hasta] : [hasta, desde];
  const comp = filtroCompeticion.value;
 
  const filtrados = todosLosPartidos.filter(p =>
    p.year >= min && p.year <= max &&
    (comp === 'todas' || clasificarCompeticion(p.competition) === comp)
  );
  if (filtrados.length === 0) {
    alert('No hay partidos con esos filtros. Elegí otro rango o competencia.');
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
  condicionEl.textContent = traducirCondicion(partido.condition);
 
  // San Lorenzo va del lado que le corresponda según si jugó de local o visitante.
  const slLocal = partido.condition !== 'Visitante';
  const nombreIzq = slLocal ? 'San Lorenzo' : partido.rival;
  const nombreDer = slLocal ? partido.rival : 'San Lorenzo';
  const escudoIzq = slLocal ? ESCUDO_SAN_LORENZO : buscarEscudoRival(partido.rival);
  const escudoDer = slLocal ? buscarEscudoRival(partido.rival) : ESCUDO_SAN_LORENZO;
 
  nombreIzqEl.textContent = nombreIzq;
  nombreDerEl.textContent = nombreDer;
  labelIzqEl.textContent = nombreIzq;
  labelDerEl.textContent = nombreDer;
 
  [ [escudoIzqEl, escudoIzq], [escudoDerEl, escudoDer] ].forEach(([el, url]) => {
    if (url) {
      el.onerror = () => { el.style.display = 'none'; };
      el.style.display = '';
      el.src = url;
    } else {
      el.removeAttribute('src');
      el.style.display = 'none';
    }
  });
 
  golesIzqInput.value = '';
  golesDerInput.value = '';
  feedbackEl.classList.add('oculta');
  golesIzqInput.focus();
}
 
formPrediccion.addEventListener('submit', (e) => {
  e.preventDefault();
  const partido = mazoActual[indiceActual];
  const slLocal = partido.condition !== 'Visitante';
  const golesIzq = parseInt(golesIzqInput.value);
  const golesDer = parseInt(golesDerInput.value);
 
  // Traducimos "izquierda/derecha" a "San Lorenzo/rival" según corresponda.
  const golesSl = slLocal ? golesIzq : golesDer;
  const golesRival = slLocal ? golesDer : golesIzq;
 
  const acerto = golesSl === partido.goals_for && golesRival === partido.goals_against;
 
  if (acerto) {
    puntos++;
    puntosEl.textContent = puntos;
    feedbackEl.textContent = `¡Correcto! ${partido.goals_for}-${partido.goals_against}`;
    feedbackEl.className = 'feedback acierto';
    indiceActual++;
    setTimeout(mostrarSiguientePartido, 700);
  } else {
    resultadoRealFinEl.textContent = slLocal
      ? `${partido.goals_for} - ${partido.goals_against}`
      : `${partido.goals_against} - ${partido.goals_for}`;
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
 
