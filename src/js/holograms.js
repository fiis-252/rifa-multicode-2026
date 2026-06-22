

export function initHolograms() {
	const container = document.getElementById('three-canvas-container');
	if (!container || typeof THREE === 'undefined') return;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		45,
		container.clientWidth / container.clientHeight,
		0.1,
		1000,
	);

	const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);

	const group = new THREE.Group();
	scene.add(group);

	
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
	scene.add(ambientLight);
	const pointLight = new THREE.PointLight(0xffffff, 1.2, 50);
	pointLight.position.set(5, 10, 5);
	scene.add(pointLight);

	
	const rootStyle = getComputedStyle(document.body);
	const themePrimary =
		rootStyle.getPropertyValue('--theme-primary').trim() || '#7FC9F7';

	

	
	const silverMaterial = new THREE.MeshStandardMaterial({
		color: 0xdcdcdc,
		roughness: 0.3,
		metalness: 0.8,
	});

	
	const blackPlasticMaterial = new THREE.MeshPhysicalMaterial({
		color: 0x111111,
		roughness: 0.1,
		metalness: 0.0,
		clearcoat: 1.0,
		clearcoatRoughness: 0.1,
	});

	
	const blackFabricMaterial = new THREE.MeshStandardMaterial({
		color: 0x222222,
		roughness: 0.9,
		metalness: 0.0,
	});

	
	const grayFabricMaterial = new THREE.MeshStandardMaterial({
		color: 0x313131,
		roughness: 0.9,
		metalness: 0.0,
	});

	
	const cyanFabricMaterial = new THREE.MeshStandardMaterial({
		color: 0x6ebfb5, 
		roughness: 0.8,
		metalness: 0.0,
	});

	
	const dynamicPlasticMaterial = new THREE.MeshPhysicalMaterial({
		color: themePrimary,
		roughness: 0.3,
		metalness: 0.1,
		clearcoat: 0.6,
		clearcoatRoughness: 0.2,
	});

	
	const screenMaterial = new THREE.MeshPhysicalMaterial({
		color: 0x050505,
		roughness: 0.1,
		metalness: 0.6,
		clearcoat: 1.0,
	});

	
	function createTextBadge(text) {
		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 128;
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = 'rgba(13, 17, 23, 0.8)';
		ctx.beginPath();
		ctx.roundRect(0, 0, 512, 128, 64);
		ctx.fill();
		ctx.strokeStyle = themePrimary;
		ctx.lineWidth = 6;
		ctx.stroke();

		ctx.font = 'bold 48px Fredoka, sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, 256, 64);

		const texture = new THREE.CanvasTexture(canvas);
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

		const badgeMaterial = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
		});
		return new THREE.Mesh(new THREE.PlaneGeometry(3, 0.75), badgeMaterial);
	}

	
	const buildPrize = (meshes, labelText, tiltZ = 0) => {
		const obj = new THREE.Group();
		const modelGroup = new THREE.Group();

		meshes.forEach((mesh) => modelGroup.add(mesh));
		modelGroup.rotation.z = tiltZ;
		obj.add(modelGroup);

		const badge = createTextBadge(labelText);
		badge.position.set(0, 1.8, 0);
		obj.add(badge);

		return obj;
	};

	const buildTablet = () => {
		const body = new THREE.Mesh(
			new THREE.BoxGeometry(2, 2.8, 0.12),
			silverMaterial,
		);
		const screen = new THREE.Mesh(
			new THREE.BoxGeometry(1.9, 2.7, 0.02),
			screenMaterial,
		);
		screen.position.z = 0.065;
		const lens = new THREE.Mesh(
			new THREE.CylinderGeometry(0.15, 0.15, 0.04, 16),
			blackPlasticMaterial,
		);
		lens.rotation.x = Math.PI / 2;
		lens.position.set(-0.75, 1.15, -0.065);
		return buildPrize([body, screen, lens], 'Tablet Samsung');
	};

	const buildHeadphones = () => {
		const band = new THREE.Mesh(
			new THREE.TorusGeometry(1.1, 0.12, 8, 24, Math.PI),
			blackPlasticMaterial,
		);
		const leftCup = new THREE.Mesh(
			new THREE.CylinderGeometry(0.6, 0.6, 0.3, 24),
			blackPlasticMaterial,
		);
		const rightCup = new THREE.Mesh(
			new THREE.CylinderGeometry(0.6, 0.6, 0.3, 24),
			blackPlasticMaterial,
		);
		const leftPad = new THREE.Mesh(
			new THREE.TorusGeometry(0.45, 0.15, 8, 24),
			blackFabricMaterial,
		);
		const rightPad = new THREE.Mesh(
			new THREE.TorusGeometry(0.45, 0.15, 8, 24),
			blackFabricMaterial,
		);

		leftCup.rotation.z = Math.PI / 2;
		rightCup.rotation.z = Math.PI / 2;
		leftPad.rotation.y = Math.PI / 2;
		rightPad.rotation.y = Math.PI / 2;

		leftCup.position.set(-1.1, -0.5, 0);
		rightCup.position.set(1.1, -0.5, 0);
		leftPad.position.set(-0.95, -0.5, 0);
		rightPad.position.set(0.95, -0.5, 0);

		return buildPrize(
			[band, leftCup, rightCup, leftPad, rightPad],
			'Audífonos Hoco',
		);
	};

	const buildSpeaker = () => {
		const body = new THREE.Mesh(
			new THREE.CylinderGeometry(1.0, 1.4, 1.6, 32),
			silverMaterial,
		);
		const topButton = new THREE.Mesh(
			new THREE.CylinderGeometry(0.8, 0.4, 0.05, 16),
			blackPlasticMaterial,
		);
		topButton.position.set(0, 0.825, 0);
		return buildPrize([body, topButton], 'Parlante Lenovo');
	};

	const buildBackpack = () => {
		const main = new THREE.Mesh(
			new THREE.BoxGeometry(1.8, 2.6, 0.8),
			grayFabricMaterial,
		);
		const pocket = new THREE.Mesh(
			new THREE.BoxGeometry(1.5, 1.5, 0.3),
			blackFabricMaterial,
		);
		pocket.position.set(0, -0.3, 0.55);
		const handle = new THREE.Mesh(
			new THREE.TorusGeometry(0.3, 0.06, 8, 16, Math.PI),
			blackFabricMaterial,
		);
		handle.position.set(0, 1.3, 0);
		const strap1 = new THREE.Mesh(
			new THREE.BoxGeometry(0.25, 2.0, 0.1),
			blackFabricMaterial,
		);
		strap1.position.set(-0.5, -0.1, -0.45);
		const strap2 = new THREE.Mesh(
			new THREE.BoxGeometry(0.25, 2.0, 0.1),
			blackFabricMaterial,
		);
		strap2.position.set(0.5, -0.1, -0.45);
		return buildPrize(
			[main, pocket, handle, strap1, strap2],
			'Mochila Laptop',
		);
	};

	const buildLunchbox = () => {
		
		const base = new THREE.Mesh(
			new THREE.BoxGeometry(2.4, 1.0, 1.4),
			dynamicPlasticMaterial,
		);
		const lid = new THREE.Mesh(
			new THREE.BoxGeometry(2.4, 0.3, 1.4),
			dynamicPlasticMaterial,
		);
		lid.position.set(0, 0.65, 0);
		const handle = new THREE.Mesh(
			new THREE.BoxGeometry(1.2, 0.1, 0.4),
			blackPlasticMaterial,
		);
		handle.position.set(0, 0.85, 0);
		const latch1 = new THREE.Mesh(
			new THREE.BoxGeometry(0.2, 0.6, 0.8),
			blackPlasticMaterial,
		);
		latch1.position.set(-1.25, 0.3, 0);
		const latch2 = new THREE.Mesh(
			new THREE.BoxGeometry(0.2, 0.6, 0.8),
			blackPlasticMaterial,
		);
		latch2.position.set(1.25, 0.3, 0);
		return buildPrize(
			[base, lid, handle, latch1, latch2],
			'Lonchera Eléctrica',
		);
	};

	const buildUmbrella = () => {
		const canopy = new THREE.Mesh(
			new THREE.ConeGeometry(2, 1, 12),
			cyanFabricMaterial,
		);
		const shaft = new THREE.Mesh(
			new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8),
			silverMaterial,
		);
		shaft.position.set(0, -1.25, 0);
		const handle = new THREE.Mesh(
			new THREE.CylinderGeometry(0.12, 0.12, 0.4, 12),
			blackPlasticMaterial,
		);
		handle.position.set(0, -2.5, 0);
		return buildPrize([canopy, shaft, handle], 'Sombrilla', Math.PI / 8);
	};

	const generators = [
		buildTablet,
		buildHeadphones,
		buildSpeaker,
		buildBackpack,
		buildLunchbox,
		buildUmbrella,
	];
	generators.forEach((generate) => group.add(generate()));

	const updateCamera = () => {
		const aspect = container.clientWidth / container.clientHeight;
		const invAspect = container.clientHeight / container.clientWidth;

		camera.aspect = aspect;

		camera.position.z = Math.min(
			24,
			Math.max(12, 12 * Math.pow(invAspect, 0.8)),
		);
		camera.position.y = Math.min(3, Math.min(1, 2 * invAspect));
		camera.lookAt(0, 0, 0);
		camera.updateProjectionMatrix();
	};
	updateCamera();

	window.addEventListener('resize', () => {
		updateCamera();
		renderer.setSize(container.clientWidth, container.clientHeight);
	});

	let isDragging = false;
	let previousMousePosition = { x: 0, y: 0 };
	let targetRotation = 0;
	let currentRotation = 0;

	const handlePointerDown = (x, y) => {
		isDragging = true;
		previousMousePosition = { x, y };
	};
	const handlePointerUp = () => (isDragging = false);
	const handlePointerMove = (x, y) => {
		if (isDragging) {
			const isPortrait = container.clientHeight > container.clientWidth;
			const deltaX = x - previousMousePosition.x;
			const deltaY = y - previousMousePosition.y;

			if (isPortrait) targetRotation -= deltaY * 0.01;
			else targetRotation += deltaX * 0.01;
		}
		previousMousePosition = { x, y };
	};

	container.addEventListener('mousedown', (e) =>
		handlePointerDown(e.offsetX, e.offsetY),
	);
	window.addEventListener('mouseup', handlePointerUp);
	container.addEventListener('mousemove', (e) =>
		handlePointerMove(e.offsetX, e.offsetY),
	);

	container.addEventListener(
		'touchstart',
		(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY),
		{ passive: true },
	);
	window.addEventListener('touchend', handlePointerUp);
	container.addEventListener(
		'touchmove',
		(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY),
		{ passive: true },
	);

	function animate() {
		requestAnimationFrame(animate);
		targetRotation += 0.002; 
		currentRotation += (targetRotation - currentRotation) * 0.1; 

		const width = container.clientWidth;
		const height = container.clientHeight;
		const aspect = width / height;
		const invAspect = height / width;
		const isPortrait = invAspect > 1;

		const time = Date.now() * 0.001;

		group.children.forEach((prizeObj, index) => {
			const baseAngle = (index / 6) * Math.PI * 2;
			const angle = baseAngle + currentRotation;
			const floatY = Math.sin(time * 2 + index) * 0.6;

			if (isPortrait) {
				
				
				const radiusX = Math.max(2.0, 3.0 * aspect);
				const radiusY = Math.min(8.0, 3 * invAspect);

				prizeObj.position.x = Math.cos(angle) * radiusX;
				prizeObj.position.y = Math.sin(angle) * radiusY + floatY;
				prizeObj.position.z = Math.sin(angle) * 2; 

				
				prizeObj.rotation.set(Math.sin(angle) * 0.2, Math.cos(angle) * 0.2, 0);

				
				const textBadge = prizeObj.children[prizeObj.children.length - 1];
				textBadge.rotation.set(-prizeObj.rotation.x, -prizeObj.rotation.y, 0);
				camera.position.y = 2.5;
			} else {
				
				
				const radiusX = Math.max(4.0, 3.5 * aspect);
				const radiusZ = Math.max(4.0, 3.5 * invAspect);

				prizeObj.position.x = Math.cos(angle) * radiusX;
				prizeObj.position.y = floatY;
				prizeObj.position.z = Math.sin(angle) * radiusZ;

				
				prizeObj.rotation.set(0, -angle, 0);

				
				const textBadge = prizeObj.children[prizeObj.children.length - 1];
				textBadge.rotation.set(0, angle, 0);
			}
		});

		renderer.render(scene, camera);
	}
	animate();
}
