// Cicada control script

document.addEventListener('DOMContentLoaded', () => {
	const cicada = document.getElementById('cicada');
	const container = document.getElementById('container');

	// Initial position and movement settings
	let position = {
		x: 0,
		y: 0,
		rotation: 0
	};

	const speed = 10; // pixels per keypress
	const rotationSpeed = 15; // degrees per keypress

	// Track pressed keys
	const keys = {
		ArrowUp: false,
		ArrowDown: false,
		ArrowLeft: false,
		ArrowRight: false,
		w: false,
		a: false,
		s: false,
		d: false
	};

	// Apply cicada position and transforms
	function updateCicadaPosition() {
		cicada.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${position.rotation}deg)`;
	}

	// Handle flight animation state
	function updateFlightAnimation(isFlying) {
		if (isFlying) {
			cicada.classList.add('flying');
		} else {
			cicada.classList.remove('flying');
		}
	}

	// Key down event handler
	window.addEventListener('keydown', (e) => {
		if (keys.hasOwnProperty(e.key)) {
			keys[e.key] = true;

			// Start flying animation when any movement key is pressed
			updateFlightAnimation(true);

			// Prevent default behavior for arrow keys (page scrolling)
			if (e.key.startsWith('Arrow')) {
				e.preventDefault();
			}
		}
	});

	// Key up event handler
	window.addEventListener('keyup', (e) => {
		if (keys.hasOwnProperty(e.key)) {
			keys[e.key] = false;

			// Stop flying animation if no movement keys are pressed
			const isAnyMovementKeyPressed = Object.values(keys).some(value => value);
			if (!isAnyMovementKeyPressed) {
				updateFlightAnimation(false);
			}
		}
	});

	// Game loop to continuously update position based on pressed keys
	function gameLoop() {
		// Vertical movement (up/down)
		if (keys.ArrowUp || keys.w) {
			position.y -= speed;
		}
		if (keys.ArrowDown || keys.s) {
			position.y += speed;
		}

		// Horizontal movement (left/right)
		if (keys.ArrowLeft || keys.a) {
			position.x -= speed;
		}
		if (keys.ArrowRight || keys.d) {
			position.x += speed;
		}

		// Apply position changes
		updateCicadaPosition();

		// Continue the game loop
		requestAnimationFrame(gameLoop);
	}

	// Start the game loop
	gameLoop();

	// Add instructions to the page
	const instructions = document.createElement('div');
	instructions.id = 'instructions';
	instructions.innerHTML = `
        <h2>Cicada Controls</h2>
        <p>Use arrow keys or WASD to move the cicada</p>
        <p>↑ or W: Move up</p>
        <p>↓ or S: Move down</p>
        <p>← or A: Move left</p>
        <p>→ or D: Move right</p>
    `;
	document.body.appendChild(instructions);
});
