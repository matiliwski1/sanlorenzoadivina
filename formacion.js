// Plantillas de formación: coordenadas en % (x: izquierda-derecha, y: 0=arco rival, 150=arco propio, sobre viewBox 100x150).
const PLANTILLAS = {
  '4-3-3': [
    { pos: 'GK',   label: 'Arquero',            x: 50, y: 138 },
    { pos: 'LD',   label: 'Lateral Derecho',     x: 82, y: 108 },
    { pos: 'DFC1', label: 'Defensor Central',    x: 62, y: 116 },
    { pos: 'DFC2', label: 'Defensor Central',    x: 38, y: 116 },
    { pos: 'LI',   label: 'Lateral Izquierdo',   x: 18, y: 108 },
    { pos: 'MC1',  label: 'Volante Central',     x: 65, y: 80 },
    { pos: 'MC2',  label: 'Volante Central',     x: 50, y: 86 },
    { pos: 'MC3',  label: 'Volante Central',     x: 35, y: 80 },
    { pos: 'ED',   label: 'Extremo Derecho',     x: 80, y: 40 },
    { pos: 'DC',   label: 'Delantero Centro',    x: 50, y: 24 },
    { pos: 'EI',   label: 'Extremo Izquierdo',   x: 20, y: 40 },
  ],
  '4-2-3-1': [
    { pos: 'GK',   label: 'Arquero',            x: 50, y: 138 },
    { pos: 'LD',   label: 'Lateral Derecho',     x: 82, y: 108 },
    { pos: 'DFC1', label: 'Defensor Central',    x: 62, y: 116 },
    { pos: 'DFC2', label: 'Defensor Central',    x: 38, y: 116 },
    { pos: 'LI',   label: 'Lateral Izquierdo',   x: 18, y: 108 },
    { pos: 'MCD1', label: 'Volante Central',     x: 62, y: 90 },
    { pos: 'MCD2', label: 'Volante Central',     x: 38, y: 90 },
    { pos: 'MCO',  label: 'Mediapunta',          x: 50, y: 62 },
    { pos: 'ED',   label: 'Extremo Derecho',     x: 78, y: 55 },
    { pos: 'EI',   label: 'Extremo Izquierdo',   x: 22, y: 55 },
    { pos: 'DC',   label: 'Delantero Centro',    x: 50, y: 24 },
  ],
  '4-4-2': [
    { pos: 'GK',  label: 'Arquero',            x: 50, y: 138 },
    { pos: 'LD',  label: 'Lateral Derecho',     x: 82, y: 108 },
    { pos: 'DFC1',label: 'Defensor Central',    x: 62, y: 116 },
    { pos: 'DFC2',label: 'Defensor Central',    x: 38, y: 116 },
    { pos: 'LI',  label: 'Lateral Izquierdo',   x: 18, y: 108 },
    { pos: 'MD',  label: 'Volante Derecho',     x: 82, y: 76 },
    { pos: 'MC1', label: 'Volante Central',     x: 60, y: 80 },
    { pos: 'MC2', label: 'Volante Central',     x: 40, y: 80 },
    { pos: 'MI',  label: 'Volante Izquierdo',   x: 18, y: 76 },
    { pos: 'DC1', label: 'Delantero',           x: 62, y: 30 },
    { pos: 'DC2', label: 'Delantero',           x: 38, y: 30 },
  ],
  '3-4-1-2': [
    { pos: 'GK',   label: 'Arquero',              x: 50, y: 138 },
    { pos: 'DFC1', label: 'Defensor Central',      x: 65, y: 118 },
    { pos: 'DFC2', label: 'Defensor Central',      x: 50, y: 122 },
    { pos: 'DFC3', label: 'Defensor Central',      x: 35, y: 118 },
    { pos: 'LD',   label: 'Carrilero Derecho',     x: 85, y: 95 },
    { pos: 'MC1',  label: 'Volante Central',       x: 60, y: 88 },
    { pos: 'MC2',  label: 'Volante Central',       x: 40, y: 88 },
    { pos: 'LI',   label: 'Carrilero Izquierdo',   x: 15, y: 95 },
    { pos: 'MCO',  label: 'Enganche',              x: 50, y: 58 },
    { pos: 'DC1',  label: 'Delantero',             x: 60, y: 30 },
    { pos: 'DC2',  label: 'Delantero',             x: 40, y: 30 },
  ],
};

const MAX_INTENTOS = 5;

let todosLosPartidos = [];
let partidoActual = null;
let plantillaActual = [];
let estadoPosiciones = {}; // pos -> { intentos: [], resuelta: bool, fallada: bool }
let posicionActiva = null;
let indicePartido = 0;

const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaJuego = document.getElementById('pantalla-juego');
const cantidadPartidosEl = document.getElementById('cantidad-partidos');
const btnEmpezar = document.getElementById('btn-empezar');

const fechaEl = document.getElementById('fecha-partido');
const competicionEl = document.getElementById('competicion-partido');
const rivalEl = document.getElementById('rival-partido');
const formacionNombreEl = document.getElementById('formacion-nombre');
const contadorResueltasEl = document.getElementById('contador-resueltas');
const canchaEl = document.getElementById('cancha');

const panelEl = document.getElementById('panel-adivinanza');
const panelTituloEl = document.getElementById('panel-titulo');
const intentosPreviosEl = document.getElementById('intentos-previos');
const formAdivinanza = document.getElementById('form-adivinanza');
const inputApellido = document.getElementById('input-apellido');
const intentosRestantesEl = document.getElementById('intentos-restantes');
const btnOtroPartido = document.getElementById('btn-otro-partido');

function mostrarPantalla(pantalla) {
  [pantallaInicio, pantallaJuego].forEach(p => p.classList.add('oculta'));
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

function normalizar(texto) {
  return texto
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // saca acentos/diacríticos
}

// Devuelve un array de 'correcta' | 'presente' | 'ausente', alineado a las letras del intento.
function evaluarIntento(intento, objetivo) {
  const guess = normalizar(intento).split('');
  const target = normalizar(objetivo).split('');
  const resultado = new Array(guess.length).fill('ausente');
  const usado = new Array(target.length).fill(false);

  guess.forEach((letra, i) => {
    if (i < target.length && letra === target[i]) {
      resultado[i] = 'correcta';
      usado[i] = true;
    }
  });

  guess.forEach((letra, i) => {
    if (resultado[i] === 'correcta') return;
    const idx = target.findIndex((c, j) => c === letra && !usado[j]);
    if (idx !== -1) {
      resultado[i] = 'presente';
      usado[idx] = true;
    }
  });

  return resultado;
}

btnEmpezar.addEventListener('click', () => {
  indicePartido = 0;
  cargarPartido(mezclar(todosLosPartidos)[0]);
  mostrarPantalla(pantallaJuego);
});

function cargarPartido(partido) {
  partidoActual = partido;
  plantillaActual = PLANTILLAS[partido.formacion] || PLANTILLAS['4-3-3'];
  estadoPosiciones = {};
  posicionActiva = null;

  fechaEl.textContent = partido.date;
  competicionEl.textContent = `Torneo: ${partido.competition}`;
  rivalEl.textContent = `vs ${partido.rival} · San Lorenzo de ${partido.condition === 'Local' ? 'local' : 'visitante'}`;
  formacionNombreEl.textContent = `Formación: ${partido.formacion}`;
  contadorResueltasEl.textContent = '0';
  panelEl.classList.add('oculta');
  btnOtroPartido.classList.add('oculta');

  canchaEl.querySelectorAll('.posicion').forEach(el => el.remove());

  plantillaActual.forEach(slot => {
    estadoPosiciones[slot.pos] = { intentos: [], resuelta: false, fallada: false };
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'posicion';
    btn.style.left = `${slot.x}%`;
    btn.style.top = `${(slot.y / 150) * 100}%`;
    btn.textContent = slot.pos.replace(/[0-9]/g, '');
    btn.dataset.pos = slot.pos;
    btn.addEventListener('click', () => abrirPosicion(slot.pos));
    canchaEl.appendChild(btn);
  });
}

function abrirPosicion(pos) {
  const estado = estadoPosiciones[pos];
  if (estado.resuelta || estado.fallada) return; // ya cerrada, no se puede reintentar

  posicionActiva = pos;
  canchaEl.querySelectorAll('.posicion').forEach(el => {
    el.classList.toggle('activa', el.dataset.pos === pos);
  });

  const slot = plantillaActual.find(s => s.pos === pos);
  panelTituloEl.textContent = slot.label;
  panelEl.classList.remove('oculta');
  renderIntentos();
  inputApellido.value = '';
  inputApellido.focus();
}

function renderIntentos() {
  const estado = estadoPosiciones[posicionActiva];
  intentosPreviosEl.innerHTML = '';
  estado.intentos.forEach(intento => {
    const fila = document.createElement('div');
    fila.className = 'fila-intento';
    intento.resultado.forEach((r, i) => {
      const box = document.createElement('div');
      box.className = `letra-box ${r}`;
      box.textContent = intento.texto[i];
      fila.appendChild(box);
    });
    intentosPreviosEl.appendChild(fila);
  });
  const restantes = MAX_INTENTOS - estado.intentos.length;
  intentosRestantesEl.textContent = `Intentos restantes: ${restantes}`;
}

formAdivinanza.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!posicionActiva) return;
  const valor = inputApellido.value.trim();
  if (!valor) return;

  const jugador = partidoActual.jugadores.find(j => j.pos === posicionActiva);
  const estado = estadoPosiciones[posicionActiva];
  const resultado = evaluarIntento(valor, jugador.apellido);
  estado.intentos.push({ texto: valor, resultado });

  const acerto = normalizar(valor) === normalizar(jugador.apellido);
  const btnPos = canchaEl.querySelector(`.posicion[data-pos="${posicionActiva}"]`);

  if (acerto) {
    estado.resuelta = true;
    btnPos.classList.add('resuelta');
    btnPos.textContent = '✓';
    cerrarPanelTrasResolucion();
  } else if (estado.intentos.length >= MAX_INTENTOS) {
    estado.fallada = true;
    btnPos.classList.add('fallada');
    btnPos.textContent = '✕';
    cerrarPanelTrasResolucion(jugador.apellido);
  } else {
    renderIntentos();
    inputApellido.value = '';
    inputApellido.focus();
  }
});

function cerrarPanelTrasResolucion(apellidoReal) {
  renderIntentos();
  if (apellidoReal) {
    const aviso = document.createElement('p');
    aviso.className = 'info-chica';
    aviso.textContent = `Era: ${apellidoReal}`;
    intentosPreviosEl.appendChild(aviso);
  }
  const resueltas = Object.values(estadoPosiciones).filter(e => e.resuelta || e.fallada).length;
  contadorResueltasEl.textContent = String(resueltas);

  setTimeout(() => {
    panelEl.classList.add('oculta');
    posicionActiva = null;
    canchaEl.querySelectorAll('.posicion').forEach(el => el.classList.remove('activa'));
    if (resueltas === plantillaActual.length) {
      btnOtroPartido.classList.remove('oculta');
    }
  }, 1200);
}

btnOtroPartido.addEventListener('click', () => {
  indicePartido = (indicePartido + 1) % todosLosPartidos.length;
  cargarPartido(mezclar(todosLosPartidos)[indicePartido] || todosLosPartidos[0]);
});

fetch('formaciones.json')
  .then(res => res.json())
  .then(data => {
    todosLosPartidos = data;
    cantidadPartidosEl.textContent = `${data.length} partido${data.length === 1 ? '' : 's'} cargado${data.length === 1 ? '' : 's'} por ahora (vamos sumando más de a poco)`;
  })
  .catch(err => {
    console.error('Error cargando formaciones.json', err);
    cantidadPartidosEl.textContent = 'Error cargando los datos.';
  });
