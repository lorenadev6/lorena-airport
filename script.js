import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const traducciones = {
    de: {
        welcome: "WELCOME ABOARD · LC / 2026",
        headline: ["DEIN", "NÄCHSTES", "ZIEL:", "LORENA."],
        intro: "Eine kreative Reise durch Code, Teamarbeit und menschenzentrierte Technologie.",
        hint: "ISOMETRIC TERMINAL · FLUG AUSWÄHLEN UND KAMERA BEWEGEN",
        departures: "DEPARTURES",
        prompt: "FLUG AUSWÄHLEN",
        labels: { about: "ÜBER MICH", skills: "KENNTNISSE", projects: "PROJEKTE", contact: "KONTAKT" },
        terminal: "LORENA AIRPORT · TERMINAL 01",
        status: "ALL GATES OPEN",
        selected: "DESTINATION SELECTED",
        back: "← BACK TO DEPARTURES",
        destinations: {
            about: { title: "ÜBER MICH", description: "Lerne meinen kreativen Weg und meine Arbeitsweise kennen." },
            skills: { title: "KENNTNISSE", description: "Ein Überblick über meine technischen Fähigkeiten und Werkzeuge." },
            projects: { title: "PROJEKTE", description: "Ausgewählte digitale Produkte und interaktive Arbeiten." },
            contact: { title: "KONTAKT", description: "Lass uns über eine gemeinsame Idee sprechen." }
        }
    },
    en: {
        welcome: "WELCOME ABOARD · LC / 2026",
        headline: ["YOUR NEXT", "DESTINATION:", "", "LORENA."],
        intro: "A creative journey through code, collaboration and human-centred technology.",
        hint: "ISOMETRIC TERMINAL · SELECT A DESTINATION TO MOVE THE CAMERA",
        departures: "DEPARTURES",
        prompt: "CHOOSE A FLIGHT",
        labels: { about: "ABOUT ME", skills: "SKILLS", projects: "PROJECTS", contact: "CONTACT" },
        terminal: "LORENA AIRPORT · TERMINAL 01",
        status: "ALL GATES OPEN",
        selected: "DESTINATION SELECTED",
        back: "← BACK TO DEPARTURES",
        destinations: {
            about: { title: "ABOUT ME", description: "Get to know my creative journey and the way I work." },
            skills: { title: "SKILLS", description: "A look at my technical skills and favourite tools." },
            projects: { title: "PROJECTS", description: "Selected digital products and interactive work." },
            contact: { title: "CONTACT", description: "Let’s talk about building something together." }
        }
    },
    es: {
        welcome: "BIENVENIDA A BORDO · LC / 2026",
        headline: ["TU PRÓXIMO", "DESTINO:", "", "LORENA."],
        intro: "Un viaje creativo entre código, colaboración y tecnología centrada en las personas.",
        hint: "TERMINAL ISOMÉRICA · ELIGE UN DESTINO PARA MOVER LA CÁMARA",
        departures: "SALIDAS",
        prompt: "ELIGE DESTINO",
        labels: { about: "SOBRE MÍ", skills: "HABILIDADES", projects: "PROYECTOS", contact: "CONTACTO" },
        terminal: "LORENA AIRPORT · TERMINAL 01",
        status: "TODAS LAS PUERTAS ABIERTAS",
        selected: "DESTINO SELECCIONADO",
        back: "← VOLVER A SALIDAS",
        destinations: {
            about: { title: "SOBRE MÍ", description: "Conoce mi recorrido creativo y mi forma de trabajar." },
            skills: { title: "HABILIDADES", description: "Un resumen de mis habilidades técnicas y herramientas." },
            projects: { title: "PROYECTOS", description: "Una selección de productos digitales y trabajos interactivos." },
            contact: { title: "CONTACTO", description: "Hablemos de una idea que podamos construir juntas." }
        }
    }
};

const escena = new THREE.Scene();
escena.background = new THREE.Color("#CDE6FA");

const contenedor = document.getElementById("escenario-3d");
if (!contenedor) {
    throw new Error('No se encontró el contenedor "escenario-3d".');
}

function calcularAlturaVista(proporcion) {
    return proporcion < 0.9 ? 13.5 : Math.max(11.8, 21 / proporcion);
}

const proporcionInicial = contenedor.clientWidth / contenedor.clientHeight;
const alturaVista = calcularAlturaVista(proporcionInicial);
const camara = new THREE.OrthographicCamera(
    -alturaVista * proporcionInicial,
    alturaVista * proporcionInicial,
    alturaVista,
    -alturaVista,
    0.1,
    1000
);
const enfoqueCamara = new THREE.Vector3(0, 2.4, -1.5);
camara.position.set(12, 18.3, 24);
camara.lookAt(enfoqueCamara);
const azimutCamara = Math.atan2(
    camara.position.x - enfoqueCamara.x,
    camara.position.z - enfoqueCamara.z
);

const poseInicialCamara = {
    posicion: camara.position.clone(),
    enfoque: enfoqueCamara.clone()
};
const posesCamara = {
    about: { posicion: new THREE.Vector3(7.5, 24.8, 27), enfoque: new THREE.Vector3(-10.5, 2, 5) },
    skills: { posicion: new THREE.Vector3(25.1596, 23.8, 21.6024), enfoque: new THREE.Vector3(7.1596, 1, -0.3976) },
    projects: { posicion: new THREE.Vector3(32.5, 26.3, 13.5), enfoque: new THREE.Vector3(14.5, 3.5, -8.5) },
    contact: { posicion: new THREE.Vector3(6.5, 24.3, 29), enfoque: new THREE.Vector3(-11.5, 1.5, 7) }
};

const duracionMovimientoCamara = 900;
let transicionCamara = null;
let destinoCamaraActual = "inicio";

function moverCamara(destino) {
    const poseDestino = destino === "inicio" ? poseInicialCamara : posesCamara[destino];
    if (!poseDestino) return;
    if (transicionCamara?.destino === destino ||
        (!transicionCamara && destinoCamaraActual === destino)) return;

    transicionCamara = {
        destino,
        inicio: performance.now(),
        posicionInicio: camara.position.clone(),
        posicionFin: poseDestino.posicion.clone(),
        enfoqueInicio: enfoqueCamara.clone(),
        enfoqueFin: poseDestino.enfoque.clone()
    };
}

const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
contenedor.appendChild(renderizador.domElement);

const luzAmbiente = new THREE.HemisphereLight(0xFFFFFF, 0xAEB7C1, 1.55);
escena.add(luzAmbiente);

const luzSolar = new THREE.DirectionalLight(0xFFFFFF, 2.1);
luzSolar.position.set(-10, 24, 16);
luzSolar.castShadow = true;
luzSolar.shadow.mapSize.set(1024, 1024);
luzSolar.shadow.camera.left = -24;
luzSolar.shadow.camera.right = 24;
luzSolar.shadow.camera.top = 24;
luzSolar.shadow.camera.bottom = -24;
luzSolar.shadow.camera.far = 70;
luzSolar.shadow.bias = -0.0002;
luzSolar.shadow.camera.updateProjectionMatrix();
escena.add(luzSolar);

const azul = new THREE.MeshStandardMaterial({ color: "#2454F4", roughness: 0.72 });
const coral = new THREE.MeshStandardMaterial({ color: "#FF643B", roughness: 0.76 });
const amarillo = new THREE.MeshStandardMaterial({ color: "#F8DA3D", roughness: 0.8 });
const rosa = new THREE.MeshStandardMaterial({ color: "#F5A7D7", roughness: 0.78 });
const negro = new THREE.MeshStandardMaterial({ color: "#171717", roughness: 0.82 });
const hormigon = new THREE.MeshStandardMaterial({ color: "#F2F1EE", roughness: 0.88 });
const cristal = new THREE.MeshStandardMaterial({
    color: "#B7DCFA",
    transparent: true,
    opacity: 0.36,
    roughness: 0.12,
    metalness: 0.08,
    depthWrite: false
});

function crearBloque(ancho, alto, fondo, material, x, y, z, sombra = true) {
    const objeto = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material);
    objeto.position.set(x, y, z);
    objeto.castShadow = sombra && !material.transparent;
    objeto.receiveShadow = true;
    escena.add(objeto);
    return objeto;
}

function orientarHaciaCamara(objeto) {
    objeto.rotation.y = azimutCamara;
    return objeto;
}

function crearPanelTexto(texto, colorFondo, colorTexto, ancho, alto, x, y, z, materialSoporte = null, orientacionFija = null) {
    const soporte = crearBloque(ancho + 0.28, alto + 0.24, 0.28, materialSoporte || negro, x, y, z);
    if (orientacionFija === null) orientarHaciaCamara(soporte);
    else soporte.rotation.y = orientacionFija;

    const lienzo = document.createElement("canvas");
    lienzo.width = 768;
    lienzo.height = 192;
    const contexto = lienzo.getContext("2d");
    contexto.fillStyle = colorFondo;
    contexto.fillRect(0, 0, lienzo.width, lienzo.height);
    contexto.fillStyle = colorTexto;
    contexto.font = "900 76px Arial, sans-serif";
    contexto.textAlign = "center";
    contexto.textBaseline = "middle";
    contexto.fillText(texto, lienzo.width / 2, lienzo.height / 2, lienzo.width - 38);

    const textura = new THREE.CanvasTexture(lienzo);
    textura.colorSpace = THREE.SRGBColorSpace;
    const frente = new THREE.Mesh(
        new THREE.PlaneGeometry(ancho, alto),
        new THREE.MeshBasicMaterial({ map: textura, side: THREE.DoubleSide })
    );
    const normal = new THREE.Vector3(
        Math.sin(soporte.rotation.y),
        0,
        Math.cos(soporte.rotation.y)
    );
    frente.position.set(x, y, z).addScaledVector(normal, 0.16);
    frente.rotation.y = soporte.rotation.y;
    escena.add(frente);
    return soporte;
}

// Distribución de la terminal: ala de embarque izquierda, eje central y ala derecha.
const zonasTerminal = {
    gate: { x: -11.5, z: 4.8 },
    checkin: { x: -8.5, z: -5.6 },
    departures: { x: 4.5, z: -11.15 },
    skills: { x: 7.1596, z: -0.3976 },
    shop: { x: 8.7, z: 10.7 },
    cafe: { x: 13.4, z: 10.85 },
    contact: { x: -11.5, z: 8.0 },
    projects: { x: 14.5, z: -9.5 }
};

// Plataforma ampliada al otro lado del vidrio para dejar sitio al exterior.
const zocalo = crearBloque(38.5, 0.32, 42, hormigon, 0, -0.34, -5.5, false);
const suelo = crearBloque(38, 0.22, 41.5, new THREE.MeshStandardMaterial({
    color: "#FCFBF8",
    roughness: 0.96
}), 0, -0.06, -5.5, false);
suelo.receiveShadow = true;
crearBloque(38.3, 0.09, 41.8, azul, 0, -0.55, -5.5, false);

// Fachada de vidrio posterior y retornos laterales, con montantes espaciados.
crearBloque(35.5, 7.2, 0.13, cristal, 0, 3.65, -12.1, false);
crearBloque(0.13, 7.0, 24, cristal, -18.0, 3.55, -1.0, false);
crearBloque(0.13, 7.0, 24, cristal, 18.0, 3.55, -1.0, false);

[-17, -11, -5, 1, 7, 13, 17].forEach((x) => {
    crearBloque(0.34, 7.4, 0.34, hormigon, x, 3.75, -12.0);
});
[-9, -3, 3, 9].forEach((z) => {
    crearBloque(0.34, 7.2, 0.34, hormigon, -17.8, 3.65, z);
    crearBloque(0.34, 7.2, 0.34, hormigon, 17.8, 3.65, z);
});
crearBloque(37, 0.36, 0.42, hormigon, 0, 7.35, -12.0);
crearBloque(0.36, 0.36, 24, hormigon, -17.8, 7.35, -1.0);
crearBloque(0.36, 0.36, 24, hormigon, 17.8, 7.35, -1.0);

// Plataforma exterior visible a través de la fachada; el avión se añadirá en la fase 2.
const asfaltoExterior = new THREE.MeshStandardMaterial({ color: "#DCE4E8", roughness: 0.94 });
crearBloque(34.5, 0.035, 11.8, asfaltoExterior, 0, 0.075, -19.2, false);
[-24.0, -14.4].forEach((z) => {
    crearBloque(29, 0.025, 0.08, hormigon, 0, 0.105, z, false);
});
for (let x = -12; x <= 12; x += 4) {
    crearBloque(1.8, 0.025, 0.12, amarillo, x, 0.108, -19.2, false);
}

// Tramo de pista al fondo de la plataforma exterior.
const materialPistaExterior = new THREE.MeshStandardMaterial({ color: "#AEB8BE", roughness: 0.96 });
crearBloque(36, 0.035, 5.0, materialPistaExterior, 0, 0.075, -27.55, false);
[-14, -9, -4, 1, 6, 11].forEach((x) => {
    crearBloque(1.35, 0.025, 0.12, hormigon, x, 0.105, -27.55, false);
});

// Avión estacionado: todas sus piezas pertenecen a este único grupo 3D.
const avionExterior = new THREE.Group();
avionExterior.position.set(-11.1, 0.1, -19.0);
escena.add(avionExterior);

const materialAvionBlanco = new THREE.MeshStandardMaterial({ color: "#F7F7F4", roughness: 0.58, metalness: 0.06 });
const materialVentanasAvion = negro;
const materialNeumaticoAvion = new THREE.MeshStandardMaterial({ color: "#34383B", roughness: 0.9 });

const geometriaFuselajeAvion = new THREE.CylinderGeometry(0.65, 0.7, 9.4, 20, 1);
geometriaFuselajeAvion.rotateZ(-Math.PI / 2);
const fuselajeAvion = new THREE.Mesh(geometriaFuselajeAvion, materialAvionBlanco);
fuselajeAvion.position.set(0, 2.25, 0);
fuselajeAvion.castShadow = true;
fuselajeAvion.receiveShadow = true;
avionExterior.add(fuselajeAvion);

const geometriaMorroAvion = new THREE.SphereGeometry(0.66, 20, 14);
geometriaMorroAvion.scale(1.28, 1, 1);
const morroAvion = new THREE.Mesh(geometriaMorroAvion, materialAvionBlanco);
morroAvion.position.set(4.55, 2.25, 0);
morroAvion.castShadow = true;
avionExterior.add(morroAvion);

const geometriaConoColaAvion = new THREE.ConeGeometry(0.64, 1.45, 18);
geometriaConoColaAvion.rotateZ(Math.PI / 2);
const conoColaAvion = new THREE.Mesh(geometriaConoColaAvion, materialAvionBlanco);
conoColaAvion.position.set(-5.15, 2.25, 0);
conoColaAvion.castShadow = true;
avionExterior.add(conoColaAvion);

// Ala principal trapezoidal y estabilizadores con grosor real.
const formaAlaAvion = new THREE.Shape();
formaAlaAvion.moveTo(0.8, -0.68);
formaAlaAvion.lineTo(0.05, -5.1);
formaAlaAvion.lineTo(-0.95, -5.1);
formaAlaAvion.lineTo(-2.8, -0.68);
formaAlaAvion.lineTo(-2.8, 0.68);
formaAlaAvion.lineTo(-0.95, 5.1);
formaAlaAvion.lineTo(0.05, 5.1);
formaAlaAvion.lineTo(0.8, 0.68);
formaAlaAvion.closePath();
const geometriaAlaAvion = new THREE.ExtrudeGeometry(formaAlaAvion, { depth: 0.15, bevelEnabled: false, steps: 1 });
const alaAvion = new THREE.Mesh(geometriaAlaAvion, materialAvionBlanco);
alaAvion.rotation.x = Math.PI / 2;
alaAvion.position.y = 2.34;
alaAvion.castShadow = true;
alaAvion.receiveShadow = true;
avionExterior.add(alaAvion);

const formaEstabilizadorAvion = new THREE.Shape();
formaEstabilizadorAvion.moveTo(-3.9, -0.35);
formaEstabilizadorAvion.lineTo(-4.55, -2.2);
formaEstabilizadorAvion.lineTo(-5.15, -2.2);
formaEstabilizadorAvion.lineTo(-5.35, -0.35);
formaEstabilizadorAvion.lineTo(-5.35, 0.35);
formaEstabilizadorAvion.lineTo(-5.15, 2.2);
formaEstabilizadorAvion.lineTo(-4.55, 2.2);
formaEstabilizadorAvion.lineTo(-3.9, 0.35);
formaEstabilizadorAvion.closePath();
const geometriaEstabilizadorAvion = new THREE.ExtrudeGeometry(formaEstabilizadorAvion, { depth: 0.12, bevelEnabled: false, steps: 1 });
const estabilizadorAvion = new THREE.Mesh(geometriaEstabilizadorAvion, materialAvionBlanco);
estabilizadorAvion.rotation.x = Math.PI / 2;
estabilizadorAvion.position.y = 2.42;
estabilizadorAvion.castShadow = true;
avionExterior.add(estabilizadorAvion);

const formaDerivaAvion = new THREE.Shape();
formaDerivaAvion.moveTo(-1.3, 0);
formaDerivaAvion.lineTo(0.85, 0);
formaDerivaAvion.lineTo(0.25, 2.45);
formaDerivaAvion.lineTo(-0.58, 2.45);
formaDerivaAvion.lineTo(-1.05, 1.1);
formaDerivaAvion.closePath();
const geometriaDerivaAvion = new THREE.ExtrudeGeometry(formaDerivaAvion, { depth: 0.16, bevelEnabled: false, steps: 1 });
const derivaAvion = new THREE.Mesh(geometriaDerivaAvion, coral);
derivaAvion.position.set(-4.65, 1.9, -0.08);
derivaAvion.castShadow = true;
avionExterior.add(derivaAvion);

const franjaDerivaAvion = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.9, 0.025), azul);
franjaDerivaAvion.position.set(-4.78, 3.38, 0.105);
avionExterior.add(franjaDerivaAvion);

const franjaPuntaAvion = new THREE.BoxGeometry(0.82, 0.035, 0.2);
[-4.62, 4.62].forEach((z) => {
    const franja = new THREE.Mesh(franjaPuntaAvion, azul);
    franja.position.set(-0.48, 2.35, z);
    avionExterior.add(franja);
});

// Cabina oscura y ventanillas repetidas con una sola geometría instanciada.
const geometriaVidrioAvion = new THREE.SphereGeometry(1, 10, 8);
const cabinaAvion = new THREE.Mesh(geometriaVidrioAvion, materialVentanasAvion);
cabinaAvion.position.set(4.05, 2.72, 0.08);
cabinaAvion.scale.set(0.82, 0.32, 0.48);
avionExterior.add(cabinaAvion);

const instanciasVentanillasAvion = new THREE.InstancedMesh(geometriaVidrioAvion, materialVentanasAvion, 34);
const transformacionVentanaAvion = new THREE.Object3D();
let indiceVentanaAvion = 0;
for (const lado of [-1, 1]) {
    for (let x = -3.7; x <= 3.51; x += 0.45) {
        transformacionVentanaAvion.position.set(x, 2.48, lado * 0.58);
        transformacionVentanaAvion.scale.set(0.09, 0.055, 0.025);
        transformacionVentanaAvion.updateMatrix();
        instanciasVentanillasAvion.setMatrixAt(indiceVentanaAvion, transformacionVentanaAvion.matrix);
        indiceVentanaAvion += 1;
    }
}
instanciasVentanillasAvion.count = indiceVentanaAvion;
instanciasVentanillasAvion.instanceMatrix.needsUpdate = true;
avionExterior.add(instanciasVentanillasAvion);

// Dos motores bajo las alas, con tomas frontales oscuras.
const geometriaMotorAvion = new THREE.CylinderGeometry(0.37, 0.43, 1.35, 16, 1);
geometriaMotorAvion.rotateZ(-Math.PI / 2);
const geometriaAroMotorAvion = new THREE.TorusGeometry(0.34, 0.045, 8, 16);
const geometriaTomaMotorAvion = new THREE.CylinderGeometry(0.29, 0.29, 0.035, 14);
geometriaTomaMotorAvion.rotateZ(-Math.PI / 2);
for (const lado of [-1, 1]) {
    const zMotor = lado * 2.35;
    const motorAvion = new THREE.Mesh(geometriaMotorAvion, materialAvionBlanco);
    motorAvion.position.set(-0.75, 1.56, zMotor);
    motorAvion.castShadow = true;
    avionExterior.add(motorAvion);

    const aroMotorAvion = new THREE.Mesh(geometriaAroMotorAvion, materialAvionBlanco);
    aroMotorAvion.rotation.y = Math.PI / 2;
    aroMotorAvion.position.set(-0.06, 1.56, zMotor);
    avionExterior.add(aroMotorAvion);

    const tomaMotorAvion = new THREE.Mesh(geometriaTomaMotorAvion, negro);
    tomaMotorAvion.position.set(-0.075, 1.56, zMotor);
    avionExterior.add(tomaMotorAvion);
}

// Tren de aterrizaje de tres puntos, con neumáticos sencillos.
const geometriaPataAvion = new THREE.CylinderGeometry(0.045, 0.065, 0.72, 8);
const geometriaRuedaAvion = new THREE.TorusGeometry(0.19, 0.065, 8, 12);
const puntosTrenAvion = [
    { x: -1.2, z: -1.55 },
    { x: -1.2, z: 1.55 },
    { x: 4.0, z: 0 }
];
puntosTrenAvion.forEach(({ x, z }) => {
    const pataAvion = new THREE.Mesh(geometriaPataAvion, materialAvionBlanco);
    pataAvion.position.set(x, 0.63, z);
    pataAvion.castShadow = true;
    avionExterior.add(pataAvion);

    const ruedaAvion = new THREE.Mesh(geometriaRuedaAvion, materialNeumaticoAvion);
    ruedaAvion.position.set(x, 0.2475, z);
    ruedaAvion.scale.set(1, 1, 0.7);
    avionExterior.add(ruedaAvion);
});

// Pantalla ancha de salidas en la pared posterior.
crearBloque(12.8, 4.6, 0.5, negro, zonasTerminal.departures.x, 4.95, zonasTerminal.departures.z);

// CHECK-IN centrado bajo el panel, dejando libre la circulación central.
const geometriaFrenteCheckin = new THREE.BoxGeometry(2.38, 0.78, 0.07);
const geometriaMarcoMonitor = new THREE.BoxGeometry(1.72, 1.15, 0.2);
const geometriaCristalMonitor = new THREE.BoxGeometry(1.52, 0.95, 0.035);
[-12.0, -8.5, -5.0].forEach((x) => {
    // Base clara, panel frontal azul insetado y sobre azul de atención.
    crearBloque(2.72, 1.34, 1.48, hormigon, x, 0.73, -5.6);
    crearBloque(2.98, 0.24, 1.74, azul, x, 1.51, -5.6);
    const frenteMostrador = new THREE.Mesh(geometriaFrenteCheckin, azul);
    frenteMostrador.position.set(x, 0.78, -4.81);
    frenteMostrador.castShadow = true;
    frenteMostrador.receiveShadow = true;
    escena.add(frenteMostrador);

    // Soporte fino y monitor rectangular con carcasa y pantalla orientados juntos.
    crearBloque(0.12, 1.05, 0.12, hormigon, x, 2.17, -6.3);
    const grupoMonitor = new THREE.Group();
    grupoMonitor.position.set(x, 3.08, -6.3);
    grupoMonitor.rotation.y = azimutCamara;
    const marcoMonitor = new THREE.Mesh(geometriaMarcoMonitor, hormigon);
    marcoMonitor.castShadow = true;
    marcoMonitor.receiveShadow = true;
    grupoMonitor.add(marcoMonitor);
    const cristalMonitor = new THREE.Mesh(geometriaCristalMonitor, negro);
    cristalMonitor.position.z = 0.112;
    grupoMonitor.add(cristalMonitor);
    escena.add(grupoMonitor);
});
crearPanelTexto("CHECK-IN", "#171717", "#FFFFFF", 7.0, 0.9, -8.5, 3.95, -8.8, null, 0);

// GATE A1 y la espera ocupan el ala izquierda; el vano conserva una vista abierta.
crearBloque(0.95, 5.8, 0.9, coral, -15.0, 2.9, 4.8);
crearBloque(0.95, 5.8, 0.9, coral, -8.0, 2.9, 4.8);
crearBloque(7.8, 0.9, 0.9, coral, -11.5, 5.8, 4.8);
crearPanelTexto("GATE A1", "#171717", "#F8DA3D", 4.8, 0.78, -11.5, 5.55, 5.38, null, 0);

// Zona de espera 4 × 2 frente al arco Gate A1.
const metalAsientos = new THREE.MeshStandardMaterial({
    color: "#C7CDD2",
    metalness: 0.68,
    roughness: 0.38
});

const centroPrimeraFila = new THREE.Vector3(-5.8, 0, 6.5);
// El arco está en el plano XY, así que su frente normal sigue el eje Z.
const direccionFrontal = new THREE.Vector3(
    0,
    0,
    Math.sign(zonasTerminal.gate.z - centroPrimeraFila.z)
);
const rotacionAsientos = Math.atan2(-direccionFrontal.x, -direccionFrontal.z);
const ejeLateralAsientos = new THREE.Vector3(
    Math.cos(rotacionAsientos),
    0,
    -Math.sin(rotacionAsientos)
);
const ejeProfundidadAsientos = direccionFrontal.clone().negate();
const separacionFilas = 3.3;

function crearFilaAsientos(centroFila, plazas = 4) {
    const grupoFila = new THREE.Group();
    grupoFila.position.copy(centroFila);
    grupoFila.rotation.y = rotacionAsientos;
    escena.add(grupoFila);

    const crearPiezaAsiento = (ancho, alto, fondo, material, x, y, z) => {
        const pieza = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material);
        pieza.position.set(x, y, z);
        pieza.castShadow = !material.transparent;
        pieza.receiveShadow = true;
        grupoFila.add(pieza);
        return pieza;
    };

    const paso = 1.32;
    const offsets = Array.from({ length: plazas }, (_, indice) =>
        (indice - (plazas - 1) / 2) * paso
    );

    offsets.forEach((offset) => {
        // Patas de acero, asiento y respaldo azul con una leve inclinación.
        [-0.39, 0.39].forEach((dx) => {
            [-0.31, 0.31].forEach((dz) => {
                crearPiezaAsiento(0.09, 0.7, 0.09, metalAsientos, offset + dx, 0.4, dz);
            });
        });
        crearPiezaAsiento(1.18, 0.19, 0.96, azul, offset, 0.84, 0);
        const respaldo = crearPiezaAsiento(1.18, 1.2, 0.2, azul, offset, 1.51, 0.38);
        respaldo.rotation.x = 0.08;
    });

    // Traviesas metálicas comunes que unen la estructura inferior de cada fila.
    const anchoEstructura = (plazas - 1) * paso + 0.78;
    [-0.31, 0.31].forEach((dz) => {
        crearPiezaAsiento(anchoEstructura, 0.1, 0.1, metalAsientos, 0, 0.69, dz);
    });

    // Brazos compartidos entre plazas, con soporte vertical y apoyabrazos.
    const inicio = -(plazas - 1) * paso / 2 - paso / 2;
    for (let indice = 0; indice <= plazas; indice += 1) {
        const localX = inicio + indice * paso;
        crearPiezaAsiento(0.1, 0.43, 0.1, metalAsientos, localX, 1.08, 0);
        crearPiezaAsiento(0.15, 0.12, 0.78, metalAsientos, localX, 1.34, 0);
    }
}

crearFilaAsientos(centroPrimeraFila, 4);
crearFilaAsientos(
    centroPrimeraFila.clone().addScaledVector(ejeProfundidadAsientos, separacionFilas),
    4
);

crearBloque(1.65, 2.9, 1.25, rosa, -11.5, 1.45, 8.0);
crearBloque(1.9, 0.24, 1.48, negro, -11.5, 2.98, 8.0);
crearPanelTexto("CONTACT", "#171717", "#F8DA3D", 2.1, 0.48, -11.5, 3.45, 8.9, null, 0);

// Mostrador SKILLS en primer plano a la derecha del pasillo.
const grupoSkills = new THREE.Group();
escena.add(grupoSkills);
const agregarEscenaAntesSkills = escena.add.bind(escena);
escena.add = (...objetos) => {
    const elementosSkills = objetos.filter((objeto) => objeto !== grupoSkills && objeto !== escena);
    if (elementosSkills.length) grupoSkills.add(...elementosSkills);
    return escena;
};
grupoSkills.position.set(zonasTerminal.skills.x - 8.0, 0, zonasTerminal.skills.z - 3.0);
const materialFrontalSkills = new THREE.MeshStandardMaterial({ color: "#E95332", roughness: 0.78 });
const materialMarcoSkills = new THREE.MeshStandardMaterial({ color: "#343434", roughness: 0.62 });
const geometriaMonitorSkills = new THREE.BoxGeometry(1.68, 1.04, 0.17);
const geometriaPantallaSkills = new THREE.BoxGeometry(1.52, 0.88, 0.025);
const geometriaPanelFrontalSkills = new THREE.BoxGeometry(2.12, 0.92, 0.06);
const geometriaDetalleSkills = new THREE.BoxGeometry(0.48, 0.055, 0.035);
const geometriaTecladoSkills = new THREE.BoxGeometry(0.82, 0.055, 0.32);

// Zócalo amarillo, cuerpo coral y sobre superior grueso con un pequeño vuelo.
crearBloque(8.1, 0.28, 2.72, amarillo, 8.0, 0.18, 3.0, false);
crearBloque(7.5, 1.58, 2.1, coral, 8.0, 1.10, 3.0);
crearBloque(7.82, 0.24, 2.34, coral, 8.0, 2.01, 3.0);

// Paneles frontales separados y pequeños acentos amarillos, sin recargar el mueble.
[-2.2, 0, 2.2].forEach((dx) => {
    const panelFrontal = new THREE.Mesh(geometriaPanelFrontalSkills, materialFrontalSkills);
    panelFrontal.position.set(8.0 + dx, 1.08, 4.08);
    panelFrontal.castShadow = true;
    panelFrontal.receiveShadow = true;
    escena.add(panelFrontal);

    const detalleFrontal = new THREE.Mesh(geometriaDetalleSkills, amarillo);
    detalleFrontal.position.set(8.0 + dx, 1.58, 4.13);
    escena.add(detalleFrontal);
});

// Tres estaciones iguales: soporte fino, marco oscuro y pantalla negra orientados a cámara.
[-2.45, 0, 2.45].forEach((dx) => {
    const xMonitor = 8.0 + dx;
    crearBloque(0.12, 0.95, 0.12, hormigon, xMonitor, 2.6025, 2.15);

    const grupoMonitorSkills = new THREE.Group();
    grupoMonitorSkills.position.set(xMonitor, 3.53, 2.15);
    grupoMonitorSkills.rotation.y = azimutCamara;

    const marcoSkills = new THREE.Mesh(geometriaMonitorSkills, materialMarcoSkills);
    marcoSkills.castShadow = true;
    marcoSkills.receiveShadow = true;
    grupoMonitorSkills.add(marcoSkills);

    const pantallaSkills = new THREE.Mesh(geometriaPantallaSkills, negro);
    pantallaSkills.position.z = 0.097;
    grupoMonitorSkills.add(pantallaSkills);
    escena.add(grupoMonitorSkills);

    // Teclado bajo y plano, colocado sobre la zona de trabajo.
    const tecladoSkills = new THREE.Mesh(geometriaTecladoSkills, materialMarcoSkills);
    tecladoSkills.position.set(xMonitor, 2.155, 3.48);
    tecladoSkills.castShadow = true;
    escena.add(tecladoSkills);
});

crearPanelTexto("SKILLS", "#171717", "#F8DA3D", 5.8, 0.82, 8.0, 2.7, 4.16, coral, 0);
escena.add = agregarEscenaAntesSkills;

// PROJECTS y espacios reservados para tienda y café en el ala derecha.
crearPanelTexto("PROJECTS", "#F9F4EC", "#171717", 5.7, 0.9, 14.3, 4.75, -11.45, hormigon, 0);
[-7.0, -5.0, -3.0].forEach((z, indice) => {
    const materialTarjeta = [rosa, azul, amarillo][indice];
    crearBloque(0.2, 1.7, 1.5, hormigon, 12.1, 1.1, z);
    crearBloque(0.08, 1.3, 1.15, materialTarjeta, 12.0, 2.1, z);
});

// AIRPORT SHOP: fachada abierta al pasillo, con escaparates y equipaje visible.
const shopX = zonasTerminal.shop.x;
const shopZ = zonasTerminal.shop.z;
const tiendaAirport = new THREE.Group();
escena.add(tiendaAirport);
const agregarElementoTienda = escena.add.bind(escena);
escena.add = (...objetos) => {
    const elementosTienda = objetos.filter((objeto) => objeto !== tiendaAirport && objeto !== escena);
    if (elementosTienda.length) tiendaAirport.add(...elementosTienda);
    return escena;
};
const shopFloor = new THREE.MeshStandardMaterial({ color: "#FFF7E9", roughness: 0.88 });
const shopPink = new THREE.MeshStandardMaterial({ color: "#F04491", roughness: 0.66 });
const shopGlass = new THREE.MeshStandardMaterial({
    color: "#C9EDFF", transparent: true, opacity: 0.28, roughness: 0.14,
    metalness: 0.06, depthWrite: false, side: THREE.DoubleSide
});
const shopWarm = new THREE.MeshStandardMaterial({ color: "#FFD878", emissive: "#FFB52E", emissiveIntensity: 0.55, roughness: 0.7 });
const shopDark = new THREE.MeshStandardMaterial({ color: "#51465A", roughness: 0.78 });
const shopWhite = new THREE.MeshStandardMaterial({ color: "#FFFDF8", roughness: 0.7 });

// Low, warm floor and bright cornice define the compact retail footprint.
crearBloque(4.65, 0.12, 2.55, shopFloor, shopX, 0.02, shopZ);
crearBloque(4.85, 0.22, 2.76, shopPink, shopX, 3.08, shopZ);
crearBloque(4.65, 0.12, 2.56, amarillo, shopX, 2.91, shopZ);

// Side piers and rear wall frame an open entrance facing the terminal aisle (+Z).
crearBloque(0.22, 2.78, 2.55, shopPink, shopX - 2.22, 1.48, shopZ);
crearBloque(0.22, 2.78, 2.55, shopPink, shopX + 2.22, 1.48, shopZ);
crearBloque(4.25, 2.72, 0.16, hormigon, shopX, 1.46, shopZ - 1.18);
crearBloque(0.13, 2.42, 0.12, azul, shopX - 2.08, 1.53, shopZ + 1.22);
crearBloque(0.13, 2.42, 0.12, azul, shopX + 2.08, 1.53, shopZ + 1.22);

// Store sign sits on the canopy and faces the starting camera.
crearPanelTexto("AIRPORT SHOP", "#F04491", "#FFFFFF", 4.45, 0.7, shopX, 3.68, shopZ + 0.09, shopPink, null);

// Two transparent display windows with slim colored frames; the center stays open.
[-1.13, 1.13].forEach((dx) => {
    crearBloque(1.85, 1.72, 0.045, shopGlass, shopX + dx, 1.43, shopZ + 1.18, false);
    [-0.93, 0.93].forEach((edge) => crearBloque(0.055, 1.8, 0.07, shopPink, shopX + dx + edge, 1.43, shopZ + 1.19));
    crearBloque(1.9, 0.06, 0.07, shopPink, shopX + dx, 2.31, shopZ + 1.19);
});

// Warm ceiling lights are visible through the open entrance.
[-1.35, 0, 1.35].forEach((dx) => crearBloque(0.52, 0.055, 0.58, shopWarm, shopX + dx, 2.76, shopZ - 0.18, false));

// Back shelving: restrained rows of luggage, bags and gift boxes.
[-1.35, 1.35].forEach((dx) => {
    crearBloque(1.12, 1.62, 0.38, shopWhite, shopX + dx, 1.02, shopZ - 0.91);
    [0.56, 1.12, 1.65].forEach((y) => crearBloque(1.02, 0.055, 0.48, shopPink, shopX + dx, y, shopZ - 0.67));
});

// Luggage uses rounded, softened boxes with separate handles and wheels.
function crearMaleta(x, z, color, escala = 1) {
    const colorMaleta = new THREE.MeshStandardMaterial({ color, roughness: 0.62 });
    const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(0.48 * escala, 0.68 * escala, 0.3 * escala, 2, 2, 1), colorMaleta);
    cuerpo.position.set(x, 0.42 * escala, z);
    cuerpo.castShadow = true;
    cuerpo.receiveShadow = true;
    escena.add(cuerpo);
    crearBloque(0.2 * escala, 0.055 * escala, 0.055 * escala, shopDark, x, 0.79 * escala, z, false);
    [-0.15, 0.15].forEach((dx) => crearBloque(0.09 * escala, 0.08 * escala, 0.07 * escala, shopDark, x + dx * escala, 0.06 * escala, z, false));
}
crearMaleta(shopX - 1.42, shopZ + 0.35, "#2454F4", 0.88);
crearMaleta(shopX - 0.88, shopZ + 0.48, "#F8DA3D", 0.72);
crearMaleta(shopX + 1.41, shopZ + 0.31, "#FF643B", 0.9);
crearMaleta(shopX + 0.89, shopZ - 0.05, "#F04491", 0.68);

// A compact checkout counter and a few large gift bags anchor the entrance.
crearBloque(1.12, 0.9, 0.55, coral, shopX + 0.1, 0.49, shopZ + 0.56);
crearBloque(1.18, 0.09, 0.62, shopWhite, shopX + 0.1, 0.98, shopZ + 0.56);
[-0.34, 0.37].forEach((dx, index) => {
    const bolsa = [azul, amarillo][index];
    crearBloque(0.36, 0.48, 0.28, bolsa, shopX + 0.95 + dx, 0.28, shopZ - 0.31);
    crearBloque(0.17, 0.07, 0.1, shopPink, shopX + 0.95 + dx, 0.57, shopZ - 0.31, false);
});

// Small display plinths keep gift boxes readable without crowding the storefront.
crearBloque(0.72, 0.13, 0.56, azul, shopX - 0.62, 0.12, shopZ - 0.18);
crearBloque(0.38, 0.38, 0.34, amarillo, shopX - 0.62, 0.38, shopZ - 0.18);
crearBloque(0.34, 0.29, 0.31, rosa, shopX - 0.21, 0.34, shopZ - 0.2);

// CAFÉ: compact coral counter with a readable sign and visible barista equipment.
const cafeX = zonasTerminal.cafe.x;
const cafeZBase = 12.7;
const cafeZ = cafeZBase;
const cafeGroup = new THREE.Group();
// Register the café as a sibling of the shop, then route its geometry into it.
escena.add = agregarElementoTienda;
escena.add(cafeGroup);
cafeGroup.position.z = zonasTerminal.cafe.z - cafeZBase;
escena.add = (...objetos) => {
    const elementosCafe = objetos.filter((objeto) => objeto !== cafeGroup && objeto !== escena);
    if (elementosCafe.length) cafeGroup.add(...elementosCafe);
    return escena;
};
const cafeBlanco = new THREE.MeshStandardMaterial({ color: "#FFF9EF", roughness: 0.78 });
const cafeOscuro = new THREE.MeshStandardMaterial({ color: "#382C2C", roughness: 0.58 });
const cafeVidrio = new THREE.MeshStandardMaterial({ color: "#C7E8F8", transparent: true, opacity: 0.38, roughness: 0.15, metalness: 0.04, depthWrite: false, side: THREE.DoubleSide });
const cafeProducto = new THREE.MeshStandardMaterial({ color: "#D88A45", roughness: 0.76 });

// Defined footprint and back wall keep all café objects in their own zone.
crearBloque(4.3, 0.12, 2.45, cafeBlanco, cafeX, 0.02, cafeZ);
crearBloque(4.45, 2.35, 0.18, coral, cafeX, 1.31, cafeZ - 1.08);
crearBloque(0.18, 2.35, 2.3, coral, cafeX - 2.12, 1.31, cafeZ - 0.02);
crearBloque(0.18, 2.35, 2.3, coral, cafeX + 2.12, 1.31, cafeZ - 0.02);
crearBloque(4.55, 0.2, 2.55, coral, cafeX, 2.58, cafeZ);

// Large black fascia and white lettering, facing the initial camera.
crearPanelTexto("CAFÉ", "#171717", "#FFFFFF", 3.0, 0.72, cafeX, 3.18, cafeZ + 0.12, negro, null);

// Service bar, glass pastry case, and a few clearly readable pastries.
crearBloque(3.55, 0.98, 0.62, coral, cafeX, 0.52, cafeZ + 0.62);
crearBloque(3.7, 0.12, 0.76, cafeBlanco, cafeX, 1.07, cafeZ + 0.62);
crearBloque(1.28, 0.74, 0.58, cafeVidrio, cafeX - 0.95, 1.47, cafeZ + 0.56, false);
crearBloque(1.32, 0.08, 0.64, cafeOscuro, cafeX - 0.95, 1.08, cafeZ + 0.56);
[[ -1.31, 1.34], [-0.96, 1.36], [-0.61, 1.34]].forEach(([dx, y]) => {
    const pastel = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), cafeProducto);
    pastel.position.set(cafeX + dx, y, cafeZ + 0.56);
    pastel.scale.set(1.15, 0.7, 0.9);
    pastel.castShadow = true;
    cafeGroup.add(pastel);
});

// Espresso machine and grinder sit together at the far end of the counter.
crearBloque(0.72, 0.72, 0.48, cafeOscuro, cafeX + 0.78, 1.48, cafeZ + 0.58);
crearBloque(0.58, 0.12, 0.44, cafeBlanco, cafeX + 0.78, 1.88, cafeZ + 0.58);
crearBloque(0.26, 0.42, 0.3, hormigon, cafeX + 1.43, 1.32, cafeZ + 0.58);
crearBloque(0.34, 0.06, 0.37, cafeOscuro, cafeX + 1.43, 1.55, cafeZ + 0.58);

// Three stools line the customer side without reaching the central blue aisle.
[-1.22, 0, 1.22].forEach((dx) => {
    crearBloque(0.46, 0.14, 0.46, amarillo, cafeX + dx, 0.78, cafeZ + 1.55);
    crearBloque(0.1, 0.66, 0.1, cafeOscuro, cafeX + dx, 0.42, cafeZ + 1.55);
    [-0.14, 0.14].forEach((side) => crearBloque(0.34, 0.07, 0.08, cafeOscuro, cafeX + dx, 0.18, cafeZ + 1.55 + side));
});

// Two small café tables with paired seats occupy the right-hand apron.
[-0.9, 0.9].forEach((dx) => {
    const tableX = cafeX + dx;
    const tableZ = cafeZ + 2.18;
    crearBloque(0.82, 0.12, 0.72, cafeBlanco, tableX, 0.86, tableZ);
    crearBloque(0.12, 0.72, 0.12, cafeOscuro, tableX, 0.44, tableZ);
    [-0.56, 0.56].forEach((side) => {
        crearBloque(0.42, 0.11, 0.42, azul, tableX, 0.55, tableZ + side);
        crearBloque(0.08, 0.48, 0.08, cafeOscuro, tableX, 0.28, tableZ + side);
    });
});

// Restore the scene's normal add method before creating the other terminal pieces.
escena.add = agregarElementoTienda;

// Pasarela azul diagonal con marcas blancas de guiado.
const inicioPasarela = new THREE.Vector3(-2.0, 0.03, 12.0);
const finPasarela = new THREE.Vector3(0.0, 0.03, -9.0);
const vectorPasarela = new THREE.Vector3().subVectors(finPasarela, inicioPasarela);
const longitudPasarela = vectorPasarela.length();
const anguloPasarela = Math.atan2(-vectorPasarela.z, vectorPasarela.x);
const pasarela = crearBloque(
    longitudPasarela,
    0.07,
    1.9,
    azul,
    (inicioPasarela.x + finPasarela.x) / 2,
    0.03,
    (inicioPasarela.z + finPasarela.z) / 2,
    false
);
pasarela.rotation.y = anguloPasarela;
for (let t = 0.08; t < 0.95; t += 0.105) {
    const marca = crearBloque(
        0.72, 0.035, 0.17, hormigon,
        inicioPasarela.x + vectorPasarela.x * t,
        0.085,
        inicioPasarela.z + vectorPasarela.z * t,
        false
    );
    marca.rotation.y = anguloPasarela;
}

// Señalización del acceso y detalles de suelo.
crearBloque(0.28, 2.4, 0.28, azul, 2.8, 1.2, 11.2);
crearBloque(0.28, 2.4, 0.28, coral, 4.0, 1.2, 11.2);
crearBloque(20, 0.045, 0.16, amarillo, 0, 0.025, 14.2, false);

// Panel DEPARTURES en Three.js, con textura localizada y Raycaster propio.
const panelSalidas = crearBloque(12.8, 4.6, 0.5, negro, zonasTerminal.departures.x, 4.95, zonasTerminal.departures.z);
panelSalidas.rotation.y = 0;

const canvasPanel = document.createElement("canvas");
canvasPanel.width = 1200;
canvasPanel.height = 520;
const contextoPanel = canvasPanel.getContext("2d");
let texturaPanel = null;

function dibujarPanelSalidas(idioma) {
    const copy = traducciones[idioma];
    contextoPanel.fillStyle = "#171717";
    contextoPanel.fillRect(0, 0, canvasPanel.width, canvasPanel.height);
    contextoPanel.fillStyle = "#F8DA3D";
    contextoPanel.font = "900 54px Arial, sans-serif";
    contextoPanel.fillText(copy.departures, 58, 72);
    ["about", "skills", "projects", "contact"].forEach((destino, indice) => {
        contextoPanel.fillStyle = "#F8DA3D";
        contextoPanel.font = "900 25px Arial, sans-serif";
        const y = 170 + indice * 82;
        contextoPanel.fillText(`LC-00${indice + 1}`, 62, y);
        contextoPanel.fillStyle = "#FFFFFF";
        contextoPanel.font = "900 40px Arial, sans-serif";
        contextoPanel.fillText(copy.labels[destino], 205, y, 600);
    });
    if (texturaPanel) texturaPanel.needsUpdate = true;
}

dibujarPanelSalidas("de");
texturaPanel = new THREE.CanvasTexture(canvasPanel);
texturaPanel.colorSpace = THREE.SRGBColorSpace;
const pantalla = new THREE.Mesh(
    new THREE.PlaneGeometry(12.5, 4.3),
    new THREE.MeshBasicMaterial({ map: texturaPanel, side: THREE.DoubleSide })
);
const direccionPanel = new THREE.Vector3(
    Math.sin(panelSalidas.rotation.y),
    0,
    Math.cos(panelSalidas.rotation.y)
);
pantalla.position.copy(panelSalidas.position).addScaledVector(direccionPanel, 0.27);
pantalla.rotation.y = panelSalidas.rotation.y;
escena.add(pantalla);

const raycaster = new THREE.Raycaster();
const raton = new THREE.Vector2();
renderizador.domElement.addEventListener("click", (evento) => {
    const rect = renderizador.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    raton.x = ((evento.clientX - rect.left) / rect.width) * 2 - 1;
    raton.y = -((evento.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(raton, camara);

    const interseccion = raycaster.intersectObject(pantalla)[0];
    if (!interseccion?.uv) return;
    const posicionY = (1 - interseccion.uv.y) * canvasPanel.height;
    const primerCentroFila = 170;
    const alturaFila = 82;
    const indice = Math.floor((posicionY - (primerCentroFila - 34)) / alturaFila);
    const destinosPanel = ["about", "skills", "projects", "contact"];
    if (indice >= 0 && indice < destinosPanel.length) {
        mostrarDestino(destinosPanel[indice]);
    }
});

function animar() {
    requestAnimationFrame(animar);
    if (transicionCamara) {
        const progreso = Math.min(
            (performance.now() - transicionCamara.inicio) / duracionMovimientoCamara,
            1
        );
        const suavizado = progreso * progreso * (3 - 2 * progreso);
        camara.position.lerpVectors(
            transicionCamara.posicionInicio,
            transicionCamara.posicionFin,
            suavizado
        );
        enfoqueCamara.lerpVectors(
            transicionCamara.enfoqueInicio,
            transicionCamara.enfoqueFin,
            suavizado
        );
        camara.lookAt(enfoqueCamara);
        if (progreso === 1) {
            destinoCamaraActual = transicionCamara.destino;
            transicionCamara = null;
        }
    }
    renderizador.render(escena, camara);
}
animar();

const informacion = document.getElementById("informacion");
const titulo = document.getElementById("titulo-destino");
const descripcion = document.getElementById("descripcion-destino");
const botonVolver = document.getElementById("volver");
const botonesDestino = document.querySelectorAll("[data-destino]");
const botonesIdioma = document.querySelectorAll("[data-idioma]");
let idiomaActual = "de";
let destinoSeleccionado = null;

function actualizarIdioma(idioma) {
    const copy = traducciones[idioma];
    if (!copy) return;
    idiomaActual = idioma;
    document.documentElement.lang = idioma;

    document.getElementById("welcome-tag").textContent = copy.welcome;
    copy.headline.forEach((linea, indice) => {
        document.getElementById(`hero-line-${indice + 1}`).textContent = linea;
    });
    document.getElementById("hero-intro").textContent = copy.intro;
    document.getElementById("hero-hint").textContent = copy.hint;
    document.getElementById("departures-heading").lastChild.textContent = ` ${copy.departures}`;
    document.getElementById("departures-prompt").textContent = copy.prompt;
    document.getElementById("terminal-caption").textContent = copy.terminal;
    document.getElementById("gate-status-label").textContent = copy.status;
    document.getElementById("destination-kicker").textContent = copy.selected;
    botonVolver.textContent = copy.back;

    botonesDestino.forEach((boton) => {
        boton.querySelector("[data-label]").textContent = copy.labels[boton.dataset.destino];
    });
    botonesIdioma.forEach((boton) => {
        boton.setAttribute("aria-pressed", String(boton.dataset.idioma === idioma));
    });

    dibujarPanelSalidas(idioma);
    if (destinoSeleccionado) {
        const destino = copy.destinations[destinoSeleccionado];
        titulo.textContent = destino.title;
        descripcion.textContent = destino.description;
    }
}

function mostrarDestino(destino) {
    const contenido = traducciones[idiomaActual].destinations[destino];
    if (!contenido) return;
    destinoSeleccionado = destino;
    titulo.textContent = contenido.title;
    descripcion.textContent = contenido.description;
    informacion.hidden = false;
    document.body.classList.add("has-destination");
    botonesDestino.forEach((boton) => {
        if (boton.dataset.destino === destino) boton.setAttribute("aria-current", "true");
        else boton.removeAttribute("aria-current");
    });
    moverCamara(destino);
}

botonesDestino.forEach((boton) => {
    boton.addEventListener("click", () => mostrarDestino(boton.dataset.destino));
});

botonesIdioma.forEach((boton) => {
    boton.addEventListener("click", () => actualizarIdioma(boton.dataset.idioma));
});

botonVolver.addEventListener("click", () => {
    informacion.hidden = true;
    destinoSeleccionado = null;
    document.body.classList.remove("has-destination");
    botonesDestino.forEach((boton) => boton.removeAttribute("aria-current"));
    moverCamara("inicio");
});

window.addEventListener("resize", () => {
    const nuevoAncho = contenedor.clientWidth;
    const nuevoAlto = contenedor.clientHeight;
    const proporcion = nuevoAncho / nuevoAlto;
    const nuevaAlturaVista = calcularAlturaVista(proporcion);
    camara.left = -nuevaAlturaVista * proporcion;
    camara.right = nuevaAlturaVista * proporcion;
    camara.top = nuevaAlturaVista;
    camara.bottom = -nuevaAlturaVista;
    camara.updateProjectionMatrix();
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderizador.setSize(nuevoAncho, nuevoAlto);
});

actualizarIdioma("de");
