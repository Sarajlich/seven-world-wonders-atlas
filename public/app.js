import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const app = document.querySelector("#app");
const topnav = document.querySelector("#topnav");
let wonders = [];
let globeCleanup = null;

const textureUrls = {
  earth: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  normal: "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
  specular: "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
};

async function loadWonders() {
  const response = await fetch("/api/wonders");
  if (!response.ok) throw new Error("Could not load wonders");
  return response.json();
}

function setActiveNav(slug) {
  topnav.innerHTML = wonders
    .map(
      (wonder) =>
        `<a class="nav-link ${wonder.slug === slug ? "active" : ""}" href="/wonder/${wonder.slug}" data-link>${wonder.name}</a>`
    )
    .join("");
}

function navigate(path) {
  history.pushState({}, "", path);
  renderRoute();
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-link]");
  if (!link) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin) return;
  event.preventDefault();
  navigate(url.pathname);
});

window.addEventListener("popstate", renderRoute);

function renderHome() {
  setActiveNav("");
  app.innerHTML = `
    <section class="home">
      <div class="home-copy">
        <p class="eyebrow">Interactive world guide</p>
        <h1>7 World Wonders</h1>
        <p>Rotate the Earth, find each illuminated pin, and travel from the globe to a focused guide with images, location, history, and essential details.</p>
        <div class="hero-actions">
          <a class="primary-action" href="/wonder/${wonders[0].slug}" data-link>Start exploring</a>
          <a class="secondary-action" href="#wonder-list">View all wonders</a>
        </div>
      </div>
      <div class="globe-stage" aria-label="Interactive 3D globe with pins for the seven world wonders">
        <div class="globe-frame">
          <canvas id="globe-canvas"></canvas>
          <div class="globe-hint">Drag to rotate. Select a glowing pin to open its wonder.</div>
        </div>
      </div>
      <aside class="wonder-rail" id="wonder-list" aria-label="Seven wonder links">
        <div class="rail-title">Destinations</div>
        ${wonders
          .map(
            (wonder, index) => `
              <a class="wonder-link" href="/wonder/${wonder.slug}" data-link>
                <span class="wonder-index">${index + 1}</span>
                <span>
                  <span class="wonder-name">${wonder.name}</span>
                  <span class="wonder-place">${wonder.country}</span>
                </span>
              </a>
            `
          )
          .join("")}
      </aside>
    </section>
  `;
  initGlobe();
}

function renderWonder(slug) {
  const wonder = wonders.find((item) => item.slug === slug);
  if (!wonder) {
    app.innerHTML = `<div class="error-state">That wonder could not be found.</div>`;
    return;
  }

  setActiveNav(slug);
  const otherWonders = wonders.filter((item) => item.slug !== slug).slice(0, 3);
  const mapUrl = `https://www.google.com/maps?q=${wonder.coordinates.lat},${wonder.coordinates.lng}&z=9&output=embed`;

  app.innerHTML = `
    <article class="wonder-page">
      <section class="wonder-hero" style="--hero-image: url('${wonder.images[0]}')">
        <div class="wonder-hero-inner">
          <div>
            <a class="back-link" href="/" data-link>Back to globe</a>
            <h1>${wonder.name}</h1>
            <p>${wonder.lead}</p>
          </div>
          <div class="meta-strip" aria-label="${wonder.name} essential details">
            <div class="meta-item">
              <span class="meta-label">Location</span>
              <span class="meta-value">${wonder.country}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Period</span>
              <span class="meta-value">${wonder.built}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Site type</span>
              <span class="meta-value">${wonder.type}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Coordinates</span>
              <span class="meta-value">${wonder.coordinates.lat.toFixed(4)}, ${wonder.coordinates.lng.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="content-band">
        <div class="story">
          <p class="eyebrow">History and significance</p>
          <h2>Why it matters</h2>
          <p>${wonder.summary}</p>
          <ul class="fact-list">
            ${wonder.facts.map((fact) => `<li>${fact}</li>`).join("")}
          </ul>
        </div>
        <div class="gallery">
          <p class="eyebrow">Visual record</p>
          <h2>High resolution views</h2>
          <div class="gallery-grid">
            ${wonder.images
              .map((image, index) => `<img src="${image}" alt="${wonder.name} view ${index + 1}" loading="lazy" />`)
              .join("")}
          </div>
        </div>
      </section>

      <section class="map-band">
        <div class="map-panel">
          <p class="eyebrow">Geography</p>
          <h2>Find it on the map</h2>
          <p>${wonder.name} is located at ${wonder.coordinates.lat.toFixed(4)} latitude and ${wonder.coordinates.lng.toFixed(4)} longitude. The map is centered on the monument so its landscape and nearest region are easy to understand.</p>
        </div>
        <div class="map-frame">
          <iframe title="Google map for ${wonder.name}" src="${mapUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>

      <section class="nearby-grid" aria-label="More wonders to explore">
        ${otherWonders
          .map(
            (item) => `
              <a class="nearby-card" href="/wonder/${item.slug}" data-link>
                <span>Explore next</span>
                <strong>${item.name}</strong>
              </a>
            `
          )
          .join("")}
      </section>
    </article>
  `;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderRoute() {
  if (globeCleanup) {
    globeCleanup();
    globeCleanup = null;
  }

  const match = location.pathname.match(/^\/wonder\/([^/]+)$/);
  if (match) {
    renderWonder(match[1]);
  } else {
    renderHome();
  }
  app.focus({ preventScroll: true });
}

function latLngToVector3(lat, lng, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function initGlobe() {
  const canvas = document.querySelector("#globe-canvas");
  const frame = canvas?.parentElement;
  if (!canvas || !frame) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.4, 4.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 2.65;
  controls.maxDistance = 5.6;
  controls.rotateSpeed = 0.72;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.45;

  scene.add(new THREE.AmbientLight(0x9fb8c4, 1.05));

  const sun = new THREE.DirectionalLight(0xffefca, 2.35);
  sun.position.set(4, 1.5, 3);
  scene.add(sun);

  const rim = new THREE.DirectionalLight(0x79dbff, 1.2);
  rim.position.set(-4, 0.2, -2);
  scene.add(rim);

  const loader = new THREE.TextureLoader();
  const earthMap = loader.load(textureUrls.earth);
  const normalMap = loader.load(textureUrls.normal);
  const specularMap = loader.load(textureUrls.specular);
  const cloudMap = loader.load(textureUrls.clouds);

  [earthMap, normalMap, specularMap, cloudMap].forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  });

  const globe = new THREE.Group();
  scene.add(globe);

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 96),
    new THREE.MeshPhongMaterial({
      map: earthMap,
      normalMap,
      normalScale: new THREE.Vector2(0.82, 0.82),
      specularMap,
      specular: new THREE.Color("#57737e"),
      shininess: 18
    })
  );
  globe.add(earth);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.012, 96, 96),
    new THREE.MeshLambertMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.44,
      depthWrite: false
    })
  );
  globe.add(clouds);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.04, 96, 96),
    new THREE.MeshBasicMaterial({
      color: 0x73d9ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    })
  );
  globe.add(atmosphere);

  const pinMeshes = [];
  wonders.forEach((wonder) => {
    const normal = latLngToVector3(wonder.coordinates.lat, wonder.coordinates.lng, 1).normalize();
    const group = new THREE.Group();
    group.position.copy(normal.multiplyScalar(1.045));
    group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal.clone().normalize());
    group.userData = { slug: wonder.slug, name: wonder.name };

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0xfff0c1, metalness: 0.4, roughness: 0.28 })
    );
    stem.position.y = 0.04;

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0xf06e2f,
        emissive: 0x9c2b10,
        emissiveIntensity: 0.62,
        metalness: 0.12,
        roughness: 0.3
      })
    );
    head.position.y = 0.12;
    head.userData = group.userData;

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.052, 0.066, 36),
      new THREE.MeshBasicMaterial({
        color: 0xf4c15d,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      })
    );
    halo.position.y = 0.104;
    halo.rotation.x = Math.PI / 2;

    group.add(stem, head, halo);
    globe.add(group);
    pinMeshes.push(head);
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let animationFrame = 0;

  function resize() {
    const rect = frame.getBoundingClientRect();
    const size = Math.max(280, Math.min(rect.width, rect.height || rect.width));
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pickPin(event) {
    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pinMeshes, false)[0];
    if (hit?.object?.userData?.slug) {
      navigate(`/wonder/${hit.object.userData.slug}`);
    }
  }

  function handleMove(event) {
    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pinMeshes, false)[0];
    canvas.style.cursor = hit ? "pointer" : "grab";
  }

  function animate() {
    animationFrame = requestAnimationFrame(animate);
    clouds.rotation.y += 0.0008;
    pinMeshes.forEach((pin, index) => {
      const scale = 1 + Math.sin(performance.now() * 0.003 + index) * 0.08;
      pin.scale.setScalar(scale);
    });
    controls.update();
    renderer.render(scene, camera);
  }

  resize();
  animate();
  window.addEventListener("resize", resize);
  canvas.addEventListener("click", pickPin);
  canvas.addEventListener("pointermove", handleMove);

  globeCleanup = () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("click", pickPin);
    canvas.removeEventListener("pointermove", handleMove);
    controls.dispose();
    renderer.dispose();
  };
}

async function boot() {
  app.innerHTML = `<div class="loading">Loading the atlas...</div>`;
  try {
    wonders = await loadWonders();
    renderRoute();
  } catch (error) {
    app.innerHTML = `<div class="error-state">${error.message}</div>`;
  }
}

boot();
