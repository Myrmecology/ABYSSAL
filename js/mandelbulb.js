/* ============================================
   ABYSSAL — mandelbulb.js
   WebGL Mandelbulb fractals in all 4 corners
   UPDATED: brighter, breathing, morphing
   ============================================ */

(function () {
  const CANVAS_SIZE = 260;

  const bulbIds = ['bulb-tl', 'bulb-tr', 'bulb-bl', 'bulb-br'];
  const renderers    = {};
  const scenes       = {};
  const cameras      = {};
  const meshes       = {};
  const wireMeshes   = {};
  const clocks       = {};
  const hovered      = {};
  const scales       = {};
  const targetScales = {};

  // --- Vertex Shader ---
  const vertexShader = `
    uniform float uTime;
    uniform float uMorph;
    varying vec3  vPosition;
    varying vec3  vNormal;
    varying float vDisplace;

    void main() {
      vPosition = position;
      vNormal   = normal;

      // Pulsing displacement over time
      float pulse   = sin(uTime * 1.1 + position.x * 3.0) * 0.06 * uMorph;
      float ripple  = cos(uTime * 0.9 + position.y * 4.0) * 0.04 * uMorph;
      float breathe = sin(uTime * 0.5) * 0.05;
      vec3 displaced = position + normal * (pulse + ripple + breathe);

      vDisplace  = pulse + ripple;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `;

  // --- Fragment Shader ---
  const fragmentShader = `
    uniform float uTime;
    varying vec3  vPosition;
    varying vec3  vNormal;
    varying float vDisplace;

    void main() {
      // Color cycle: silver -> ice blue -> blood red -> back
      float speed = uTime * 0.15;
      float t1 = abs(sin(speed));
      float t2 = abs(sin(speed + 2.094));
      float t3 = abs(sin(speed + 4.189));

      vec3 silver   = vec3(0.95, 0.95, 1.00);
      vec3 iceBlue  = vec3(0.30, 0.70, 1.00);
      vec3 bloodRed = vec3(1.00, 0.05, 0.05);

      vec3 baseColor = silver * t1 + iceBlue * t2 + bloodRed * t3;

      // Bright metallic lighting
      vec3 light1    = normalize(vec3(1.0, 1.5, 2.0));
      vec3 light2    = normalize(vec3(-1.0, -0.5, 1.0));
      float diff1    = max(dot(normalize(vNormal), light1), 0.0);
      float diff2    = max(dot(normalize(vNormal), light2), 0.0) * 0.4;
      float spec     = pow(diff1, 18.0) * 1.2;

      vec3 finalColor = baseColor * (0.4 + 0.8 * diff1 + 0.2 * diff2) + vec3(spec);

      // Displacement glow — edges light up on morph
      float edgeGlow  = abs(vDisplace) * 6.0;
      finalColor     += baseColor * edgeGlow;

      // Breathing brightness
      float breathe   = 0.85 + 0.25 * sin(uTime * 0.7);
      finalColor     *= breathe * 1.6;

      // Clamp so it stays vivid not blown out
      finalColor = clamp(finalColor, 0.0, 1.0);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // --- Wireframe fragment shader (dim overlay) ---
  const wireFragShader = `
    uniform float uTime;
    void main() {
      float alpha = 0.12 + 0.08 * sin(uTime * 1.5);
      gl_FragColor = vec4(0.8, 0.1, 0.1, alpha);
    }
  `;

  const wireVertShader = `
    uniform float uTime;
    void main() {
      float pulse = sin(uTime * 0.8 + position.x * 2.0) * 0.04;
      vec3 pos    = position + normal * pulse;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // --- Build Mandelbulb geometry ---
  function buildMandelbulbGeometry(power, iterations, radius, detail) {
    const geo = new THREE.SphereGeometry(radius, detail, detail);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      let zr = 0, zi = 0, zj = 0;
      let dr = 1.0;
      let r  = 0;

      for (let n = 0; n < iterations; n++) {
        r = Math.sqrt(zr * zr + zi * zi + zj * zj);
        if (r > 2.0) break;

        const theta = Math.atan2(Math.sqrt(zr * zr + zi * zi), zj);
        const phi   = Math.atan2(zi, zr);
        dr          = Math.pow(r, power - 1.0) * power * dr + 1.0;

        const rn = Math.pow(r, power);
        const tn = theta * power;
        const pn = phi   * power;

        zr = rn * Math.sin(tn) * Math.cos(pn) + x;
        zi = rn * Math.sin(tn) * Math.sin(pn) + y;
        zj = rn * Math.cos(tn)                + z;
      }

      const dist   = 0.5 * Math.log(Math.max(r, 0.0001)) * r / Math.max(dr, 0.0001);
      const factor = 1.0 + dist * 2.2;
      pos.setXYZ(i, x * factor, y * factor, z * factor);
    }

    geo.computeVertexNormals();
    return geo;
  }

  // --- Init one corner ---
  function initBulb(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    canvas.width  = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);
    renderers[id] = renderer;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.2;
    scenes[id]  = scene;
    cameras[id] = camera;

    // Main Mandelbulb mesh
    const geo = buildMandelbulbGeometry(8, 7, 0.88, 56);
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uMorph: { value: 1.0 }
      }
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    meshes[id] = mesh;

    // Wireframe overlay
    const wireGeo = buildMandelbulbGeometry(8, 7, 0.92, 24);
    const wireMat = new THREE.ShaderMaterial({
      vertexShader:   wireVertShader,
      fragmentShader: wireFragShader,
      uniforms: { uTime: { value: 0 } },
      wireframe:   true,
      transparent: true,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);
    wireMeshes[id] = wireMesh;

    // Point light for extra glow
    const pointLight = new THREE.PointLight(0xff1111, 2.5, 6);
    pointLight.position.set(1.5, 1.5, 2);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0x4488aa, 1.2, 8);
    fillLight.position.set(-2, -1, 1);
    scene.add(fillLight);

    clocks[id]       = new THREE.Clock();
    scales[id]       = 1.0;
    targetScales[id] = 1.0;
    hovered[id]      = false;

    // Hover events
    canvas.addEventListener('mouseenter', () => {
      hovered[id]      = true;
      targetScales[id] = 2.4;
    });
    canvas.addEventListener('mouseleave', () => {
      hovered[id]      = false;
      targetScales[id] = 1.0;
    });
  }

  // --- Animate all bulbs ---
  function animate() {
    requestAnimationFrame(animate);

    bulbIds.forEach(id => {
      if (!renderers[id]) return;

      const elapsed = clocks[id].getElapsedTime();
      const mesh    = meshes[id];
      const wire    = wireMeshes[id];
      const mat     = mesh.material;
      const wireMat = wire.material;

      // Update uniforms
      mat.uniforms.uTime.value  = elapsed;
      mat.uniforms.uMorph.value = 1.0 + Math.sin(elapsed * 0.4) * 0.5;
      wireMat.uniforms.uTime.value = elapsed;

      // Smooth scale lerp
      scales[id] += (targetScales[id] - scales[id]) * 0.028;
      mesh.scale.setScalar(scales[id]);
      wire.scale.setScalar(scales[id] * 1.04);

      // Breathing + rotation — more dynamic
      const breathScale = 1.0 + Math.sin(elapsed * 0.9) * 0.06;
      mesh.scale.multiplyScalar(breathScale);
      wire.scale.multiplyScalar(breathScale);

      mesh.rotation.x = elapsed * 0.22 + Math.sin(elapsed * 0.35) * 0.25;
      mesh.rotation.y = elapsed * 0.28 + Math.cos(elapsed * 0.25) * 0.20;
      mesh.rotation.z = Math.sin(elapsed * 0.18) * 0.15;

      wire.rotation.x = mesh.rotation.x - 0.05;
      wire.rotation.y = mesh.rotation.y + 0.05;
      wire.rotation.z = mesh.rotation.z;

      renderers[id].render(scenes[id], cameras[id]);
    });
  }

  // --- Boot ---
  function init() {
    if (typeof THREE === 'undefined') {
      console.warn('ABYSSAL: Three.js not loaded');
      return;
    }
    bulbIds.forEach(id => initBulb(id));
    animate();
  }

  window.addEventListener('DOMContentLoaded', init);
})();