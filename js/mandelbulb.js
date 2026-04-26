/* ============================================
   ABYSSAL — mandelbulb.js
   WebGL Mandelbulb fractals in all 4 corners
   ============================================ */

(function () {
  const CANVAS_SIZE = 260;

  const bulbIds = ['bulb-tl', 'bulb-tr', 'bulb-bl', 'bulb-br'];
  const renderers = {};
  const scenes = {};
  const cameras = {};
  const meshes = {};
  const clocks = {};
  const hovered = {};
  const scales = {};
  const targetScales = {};

  // --- Vertex Shader ---
  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // --- Fragment Shader (metallic color shift) ---
  const fragmentShader = `
    uniform float uTime;
    uniform vec3  uColor;
    varying vec3  vPosition;
    varying vec3  vNormal;

    void main() {
      // Color cycle: silver -> ice blue -> blood red
      float t1 = abs(sin(uTime * 0.12));
      float t2 = abs(sin(uTime * 0.12 + 2.094));
      float t3 = abs(sin(uTime * 0.12 + 4.189));

      vec3 silver    = vec3(0.75, 0.75, 0.75);
      vec3 iceBlue   = vec3(0.27, 0.53, 0.67);
      vec3 bloodRed  = vec3(0.55, 0.0,  0.0);

      vec3 baseColor = silver * t1 + iceBlue * t2 + bloodRed * t3;

      // Metallic lighting
      vec3 light     = normalize(vec3(1.0, 1.0, 1.5));
      float diff     = max(dot(normalize(vNormal), light), 0.0);
      float spec     = pow(diff, 14.0);
      vec3 finalColor = baseColor * (0.3 + 0.7 * diff) + vec3(spec * 0.6);

      // Breathing luminance
      float breathe  = 0.85 + 0.15 * sin(uTime * 0.8);
      finalColor    *= breathe;

      gl_FragColor   = vec4(finalColor, 1.0);
    }
  `;

  // --- Build a Mandelbulb-like geometry via sphere displacement ---
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

        const rn    = Math.pow(r, power);
        const tn    = theta * power;
        const pn    = phi   * power;

        zr = rn * Math.sin(tn) * Math.cos(pn) + x;
        zi = rn * Math.sin(tn) * Math.sin(pn) + y;
        zj = rn * Math.cos(tn)                + z;
      }

      const dist    = 0.5 * Math.log(r) * r / dr;
      const factor  = 1.0 + dist * 1.8;
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

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
    renderer.setClearColor(0x000000, 0);
    renderers[id] = renderer;

    // Scene + Camera
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.5;
    scenes[id]  = scene;
    cameras[id] = camera;

    // Geometry + Material
    const geo = buildMandelbulbGeometry(8, 6, 0.9, 48);
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color(0.75, 0.75, 0.75) }
      }
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    meshes[id] = mesh;

    clocks[id]      = new THREE.Clock();
    scales[id]      = 1.0;
    targetScales[id] = 1.0;
    hovered[id]     = false;

    // Hover events
    canvas.addEventListener('mouseenter', () => {
      hovered[id]      = true;
      targetScales[id] = 2.2;
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
      const mat     = mesh.material;

      // Update time uniform
      mat.uniforms.uTime.value = elapsed;

      // Smooth scale lerp
      scales[id] += (targetScales[id] - scales[id]) * 0.025;
      mesh.scale.setScalar(scales[id]);

      // Breathing rotation
      mesh.rotation.x = elapsed * 0.18 + Math.sin(elapsed * 0.3) * 0.15;
      mesh.rotation.y = elapsed * 0.22 + Math.cos(elapsed * 0.2) * 0.12;
      mesh.rotation.z = Math.sin(elapsed * 0.15) * 0.08;

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