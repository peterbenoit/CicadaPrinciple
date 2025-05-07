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

	// Store initial position to use with reset
	const initialPosition = {
		x: 0,
		y: 0,
		rotation: 0
	};

	const speed = 10; // pixels per keypress
	const rotationSpeed = 10; // degrees per rotation adjustment
	let targetRotation = 0; // The rotation we want the cicada to have

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

	// Reset function - returns cicada to initial position
	function resetCicada() {
		position.x = initialPosition.x;
		position.y = initialPosition.y;
		position.rotation = initialPosition.rotation;
		targetRotation = initialPosition.rotation;
		updateCicadaPosition();
		updateFlightAnimation(false);
	}

	// Apply cicada position and transforms
	function updateCicadaPosition() {
		// Smoothly rotate towards target rotation
		if (position.rotation !== targetRotation) {
			// Find shortest path to rotation (clockwise or counterclockwise)
			let diff = targetRotation - position.rotation;
			// Normalize to -180 to 180
			diff = ((diff + 180) % 360) - 180;

			if (Math.abs(diff) < rotationSpeed) {
				position.rotation = targetRotation;
			} else if (diff > 0) {
				position.rotation += rotationSpeed;
			} else {
				position.rotation -= rotationSpeed;
			}

			// Keep rotation in 0-360 range
			position.rotation = (position.rotation + 360) % 360;
		}

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

	// Determine rotation based on movement direction
	function updateTargetRotation() {
		// Get movement vector
		let dx = 0, dy = 0;

		if (keys.ArrowLeft || keys.a) dx -= 1;
		if (keys.ArrowRight || keys.d) dx += 1;
		if (keys.ArrowUp || keys.w) dy -= 1;
		if (keys.ArrowDown || keys.s) dy += 1;

		// Only update rotation if moving
		if (dx !== 0 || dy !== 0) {
			// Calculate angle in degrees
			// 0 = right, 90 = down, 180 = left, 270 = up (in CSS rotation)
			targetRotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
		}
	}

	// Key down event handler
	window.addEventListener('keydown', (e) => {
		if (keys.hasOwnProperty(e.key)) {
			keys[e.key] = true;

			// Update rotation based on movement direction
			updateTargetRotation();

			// Start flying animation when any movement key is pressed
			updateFlightAnimation(true);

			// Prevent default behavior for arrow keys (page scrolling)
			if (e.key.startsWith('Arrow')) {
				e.preventDefault();
			}
		}

		// Reset when spacebar is pressed
		if (e.key === ' ') {
			e.preventDefault(); // Prevent page scrolling with spacebar
			resetCicada();
		}
	});

	// Key up event handler
	window.addEventListener('keyup', (e) => {
		if (keys.hasOwnProperty(e.key)) {
			keys[e.key] = false;

			// Update rotation based on remaining movement keys
			updateTargetRotation();

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
        <p>↑ or W: Move up</p>
        <p>↓ or S: Move down</p>
        <p>← or A: Move left</p>
        <p>→ or D: Move right</p>
        <p><strong>Spacebar: Reset cicada position</strong></p>
    `;
	document.body.appendChild(instructions);
});
