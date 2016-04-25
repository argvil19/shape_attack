/* Shape Attack

	Made by Argenis Villasmil
	Github profile: https://github.com/argvil19

*/

window.onload = function() {

	/*----------------- CLASSES -----------------------------------------------------------------------*/

	function Player(area, color) {
		
		this.playerElement = document.getElementById('player');
		this.playerShapeArea = area;
		this.playerColor = color;
		this.playerPos = 10;
		

		// Setting div properties for player instance
		this.playerElement.style.width = this.playerShapeArea + 'px';
		this.playerElement.style.height = this.playerShapeArea + 'px';
		this.playerElement.style.backgroundColor = this.playerColor;
		this.playerElement.style.position = 'absolute';
		this.playerElement.style.bottom = '10px';
		this.playerElement.style.left = '10px';

		this.move = function(e) {
			if (e.key === "ArrowRight" && this.playerPos < (window.innerWidth - 50)) {
				this.playerPos += 18; // Here, 18 is the movement speed to the right
				this.playerElement.style.left = this.playerPos + 'px';
			} else if (e.key === "ArrowLeft" && this.playerPos > 0) {
				this.playerPos -= 18; // movement speed to the left
				this.playerElement.style.left = this.playerPos + 'px';
			}
		}

	}

	function Enemy() {
		
		this.enemyShapeArea = Math.floor(Math.random() * 250) + 100;
		this.enemyColor = '#f00';
		this.speed = Math.floor(Math.random() * 10) + 10;
		

		// Setting div properties for enemy instance
		var enemyEl = document.createElement('div');
		enemyEl.setAttribute('data-speed', this.speed);
		enemyEl.className = 'enemy';
		enemyEl.style.width = this.enemyShapeArea + 'px';
		enemyEl.style.height = this.enemyShapeArea + 'px';
		enemyEl.style.position = 'absolute';
		enemyEl.style.top = '-300px';
		enemyEl.style.left = Math.floor(Math.random() * (window.innerWidth - 250)) + 'px';
		enemyEl.style.backgroundColor = this.enemyColor;
		enemyEl.style.border = '2px solid black';

		// Inserting in the DOM
		document.getElementById('gamediv').appendChild(enemyEl);
		
	}

	/*----------------- FUNCTIONS -----------------------------------------------------------------------*/

		function gameLoop() {

			/* MAIN LOOP */

			if (!gameover) {
				var enemies = document.getElementsByClassName('enemy');
				score += 1;  // Raise score
				document.getElementById('displayScore').innerHTML = 'score<br/>' + score; // Update score
				for (var i=0;i<enemies.length;i++) {
					if (isOverlap(document.getElementById('player'), enemies[i])) {
						// Check for collisions. If true, end the game and fires endGame().
						gameover = true;
						endGame();
						return;
					}
					enemies[i].style.top = parseInt(enemies[i].style.top) + parseInt(enemies[i].getAttribute('data-speed')) + 'px'; // Makes the enemies fall
					parseInt(enemies[i].style.top) > window.innerHeight? document.getElementById('gamediv').removeChild(enemies[i]) : false; // Remove enemies that aren't in the screen anymore
				}
			}
		}

		function enemySpawn() {
			// Spawn a new Enemy and set the next spawn. Decreases spawn time by score
			var newEnemy = new Enemy();
			score>500? spawnInterval = 900 : false;
			score>1000? spawnInterval = 800 : false;
			score>1500? spawnInterval = 700 : false;
			score>2000? spawnInterval = 600 : false;
			score>3000? spawnInterval = 500 : false;

			spawnTimeout = setTimeout(enemySpawn, spawnInterval); // Set next spawn
		}

		function isOverlap(el1, el2) {
			// Checks if "el1" (player) is overlaped with el2 (any enemy).
			var e1DistancefromLeft = parseInt(el1.style.left);
			var e2DistancefromLeft = parseInt(el2.style.left);
			var e2DistancefromTop = parseInt(el2.style.top);
			var e2Height = parseInt(el2.style.height);
			var e2Width = parseInt(el2.style.width);	

			if ((e2DistancefromLeft - 50) <= (e1DistancefromLeft) && e1DistancefromLeft < (e2DistancefromLeft + e2Width) && (e2Height + e2DistancefromTop + 60) >= window.innerHeight) {
				// Fires if the enemy is over the player.
				clearTimeout(spawnTimeout);			
				return true;
			}

			return false;

		}

		function endGame() {
			// Shows the GAME OVER window
			document.getElementById('gameover').style.display = 'block';
		}

		function reset() {
			// Reset game variables and clear the window of enemies. Starts a new game.
			var enemies = document.getElementsByClassName('enemy');
			score = 0;
			gameover = false;
			spawnInterval = 1000;
			spawnTimeout = setTimeout(enemySpawn, spawnInterval);
			document.getElementById('gameover').style.display = 'none';
		
			while(enemies.length) {
				enemies[0].remove();
			}

		}

	// ---------------------------------------------------------------------------------------------------------


	// Game variables	
	var score = 0;
	var gameover = false;
	var player = new Player(50, 'yellow');
	var spawnInterval = 1000;
	var spawnTimeout;

	// Event listeners
	document.addEventListener('keydown', player.move.bind(player));
	document.getElementById('reset').addEventListener('click', reset);

	// Start main loop
	setInterval(gameLoop, 33);
	spawnTimeout = setTimeout(enemySpawn, spawnInterval); // Using setTimeout() instead of setInterval() so enemySpawn() can modify the spawnInterval.

}
