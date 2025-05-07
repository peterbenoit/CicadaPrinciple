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
	const rotationSpeed = 8; // slower rotation for more stability
	let targetRotation = 0; // The rotation we want the cicada to have
	let lastValidDirection = { dx: 0, dy: -1 }; // Default pointing up

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
		lastValidDirection = { dx: 0, dy: -1 }; // Reset direction vector too
		updateCicadaPosition();
		updateFlightAnimation(false);
	}

	// Apply cicada position and transforms
	function updateCicadaPosition() {
		// Smoothly rotate towards target rotation with damping
		if (position.rotation !== targetRotation) {
			// Find shortest path to rotation (clockwise or counterclockwise)
			let diff = targetRotation - position.rotation;
			// Normalize to -180 to 180
			diff = ((diff + 180) % 360) - 180;

			// Apply rotation with damping for smoother transitions
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

	// Determine rotation based on movement direction with improved stability
	function updateTargetRotation() {
		// Get movement vector
		let dx = 0, dy = 0;

		if (keys.ArrowLeft || keys.a) dx -= 1;
		if (keys.ArrowRight || keys.d) dx += 1;
		if (keys.ArrowUp || keys.w) dy -= 1;
		if (keys.ArrowDown || keys.s) dy += 1;

		// Only update rotation if moving and direction has changed
		if (dx !== 0 || dy !== 0) {
			// Store the last valid direction vector
			lastValidDirection.dx = dx;
			lastValidDirection.dy = dy;

			// Calculate angle in degrees - 0 right, 90 down, 180 left, 270 up
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

	// Key up event handler with stability improvements
	window.addEventListener('keyup', (e) => {
		if (keys.hasOwnProperty(e.key)) {
			keys[e.key] = false;

			// Update rotation based on remaining pressed keys
			updateTargetRotation();

			// Get new movement vector after key release
			let dx = 0, dy = 0;
			if (keys.ArrowLeft || keys.a) dx -= 1;
			if (keys.ArrowRight || keys.d) dx += 1;
			if (keys.ArrowUp || keys.w) dy -= 1;
			if (keys.ArrowDown || keys.s) dy += 1;

			// If no direction keys are pressed, maintain last known direction
			if (dx === 0 && dy === 0) {
				// Stop flying animation
				updateFlightAnimation(false);
			}
		}
	});

	// Game loop to continuously update position based on pressed keys
	function gameLoop() {
		// Movement vector
		let dx = 0, dy = 0;

		// Calculate movement vector
		if (keys.ArrowLeft || keys.a) dx -= 1;
		if (keys.ArrowRight || keys.d) dx += 1;
		if (keys.ArrowUp || keys.w) dy -= 1;
		if (keys.ArrowDown || keys.s) dy += 1;

		// Normalize diagonal movement to prevent faster diagonal speed
		if (dx !== 0 && dy !== 0) {
			const magnitude = Math.sqrt(dx * dx + dy * dy);
			dx = dx / magnitude;
			dy = dy / magnitude;
		}

		// Apply movement
		position.x += dx * speed;
		position.y += dy * speed;

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
