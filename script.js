// Get the elements
let introContainer = document.getElementById('video-container');
let gameContainer = document.querySelector('.game-container');


let isDisplayingCosmicRadiation = false;
let move_speed = 5;
let telescope = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// getting telescope element properties
let telescope_props = telescope.getBoundingClientRect();
 
let score_val = document.querySelector('.score_val');
score_val.innerHTML = '0';
let message = document.querySelector('.message');
let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');
startGame();
function startGame(){
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        document.querySelectorAll('.asteroid').forEach((asteroid) => {
            asteroid.remove();
        });
        img.style.display = 'block';
        telescope.style.top = '50vh';
        telescope.style.left = '10vw';
        game_state = 'Play';
        message.innerHTML = '';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
    if (game_state === 'Play') {
        if (e.key === 'ArrowLeft') {
            move_telescope(-move_speed); // Move left
        } else if (e.key === 'ArrowRight') {
            move_telescope(move_speed); // Move right
        }else if (e.key === 'ArrowUp') {
            move_telescope(0, -move_speed); // Move up
        } else if (e.key === 'ArrowDown') {
            move_telescope(0, move_speed); // Move down
        }
    }
});
function move_telescope(dx, dy) {
    const newLeft = telescope_props.left + dx;
    const newTop = telescope_props.top + dy;

    // Limit telescope movement within the window boundaries
    const maxX = window.innerWidth - telescope_props.width;
    const maxY = window.innerHeight - telescope_props.height;
    if (newLeft > maxX) {
      
        telescope.style.left = '0px';
        showCosmicRadiation(); // Reset to the beginning if reaching right edge
    }   
    else if (newLeft < 0) {
        telescope.style.left = maxX + 'px'; 
    } else if (newTop < 0) {
        telescope.style.top = '0px'; // Limit top movement to the top edge
    } else if (newTop > maxY) {
        telescope.style.top = maxY + 'px'; // Limit bottom movement to the bottom edge
    } else {
        telescope.style.left = newLeft + 'px';
        telescope.style.top = newTop + 'px';
    }

    telescope_props = telescope.getBoundingClientRect();
    if (dx > 0) {
        increase_score(); // Increment the score when moving right
    }
}


function play() {
    function move() {

        if (game_state !== 'Play') return;

        let asteroids = document.querySelectorAll('.asteroid');
        asteroids.forEach((asteroid) => {
            let asteroid_props = asteroid.getBoundingClientRect();
            telescope_props = telescope.getBoundingClientRect();

            if (asteroid_props.right <= 0) {
                asteroid.remove();
            } else {
                if (
                    telescope_props.left < asteroid_props.left + asteroid_props.width &&
                    telescope_props.left + telescope_props.width > asteroid_props.left &&
                    telescope_props.top < asteroid_props.top + asteroid_props.height &&
                    telescope_props.top + telescope_props.height > asteroid_props.top
                ) 
                {
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    asteroid_hit();
                    sound_die.play();
                    play();
                    return;
                } 
                else {
                    asteroid.style.left = asteroid_props.left - move_speed + 'px';
                }
            }
           
        });
        if (game_state !== 'Play') return;

        let debrisElements = document.querySelectorAll('.debris');
        debrisElements.forEach((debris) => {
            let debrisProps = debris.getBoundingClientRect();
            telescope_props = telescope.getBoundingClientRect();

            if (debrisProps.right <= 0) {
                debris.remove();
            } else {
                if (
                    telescope_props.left < debrisProps.left + debrisProps.width &&
                    telescope_props.left + telescope_props.width > debrisProps.left &&
                    telescope_props.top < debrisProps.top + debrisProps.height &&
                    telescope_props.top + telescope_props.height > debrisProps.top
                ) {
                    game_state = 'End';
                    asteroid_hit();
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    startGame();
                    return;
                } else {
                    debris.style.left = debrisProps.left - move_speed + 'px';
                }
            }
        });

            requestAnimationFrame(move);
        }
        requestAnimationFrame(move);

    let telescope_dy = 0;
    function apply_gravity() {
        if (game_state !== 'Play' || isDisplayingCosmicRadiation) return;

        if (telescope_props.top <= 0 || telescope_props.bottom >= window.innerHeight) {
            game_state = 'End';
            message.style.left = '28vw';
            message.classList.remove('messageStyle');
            return;
        }
        telescope.style.top = telescope_props.top + telescope_dy + 'px';
        telescope_props = telescope.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);
    //scheduleNextOutgassing();

    let asteroid_separation = 0;

    function create_asteroid() {
        if (game_state !== 'Play' || isDisplayingCosmicRadiation) return;

        if (asteroid_separation > 100) {
            asteroid_separation = 0;

            let asteroid_pos_x = Math.floor(Math.random() * window.innerWidth);
            let asteroid_pos_y = Math.floor(Math.random() * window.innerHeight);
        if (Math.abs(asteroid_pos_x - telescope_props.left) > 300) {
            let asteroid = document.createElement('div');
            asteroid.className = 'asteroid';

            const randomAsteroidNumber = Math.floor(Math.random() * 4) + 1;
            asteroid.style.backgroundImage = `url('images/asteroid${randomAsteroidNumber}.png')`;

            asteroid.style.left = asteroid_pos_x + 'px';
            asteroid.style.top = asteroid_pos_y + 'px';

            document.body.appendChild(asteroid);
        }
    }

        asteroid_separation++;
        requestAnimationFrame(create_asteroid);
    }
    requestAnimationFrame(create_asteroid);


    let isDisplayingCosmicRadiation = false;
    let cosmicRadiationTimeout;
    function showRandomEvent() {

        showHeavyTemp();
        if (isDisplayingCosmicRadiation || isDisplayingOutgassing || isDisplayingHeavyTemp || isDisplayingSolar) return;

        const randomEvent = Math.floor(Math.random() * 12) + 1;
        if (randomEvent <= 3) {
            showOutgassing();
           
        } else if(randomEvent>4 && randomEvent<7) {
            showCosmicRadiation();
        }
        else if(randomEvent>7 && randomEvent<10) {
            showSolar();
        }
        else{
            showHeavyTemp();
        }
    }

    function showCosmicRadiation() {
        if (isDisplayingCosmicRadiation || isDisplayingOutgassing || isDisplayingHeavyTemp || isDisplayingSolar) return;
        isDisplayingCosmicRadiation = true; 

        cosmicRadiationTimeout = setTimeout(() => {
            document.getElementById('cosmic-radiation').style.display = 'block';
            playRadiationAudio(); 
            setTimeout(() => {
                document.getElementById('cosmic-radiation').style.display = 'none';
                showUserText();
                isDisplayingCosmicRadiation = false; // Reset the flag
                scheduleNextCosmicRadiation(); // Schedule the next random cosmic radiation
            }, 14000); // Adjust the delay as needed
        }, Math.random() * 30000); // Adjust the interval for random appearance
    }

    function playRadiationAudio() {
        let radiationAudio = new Audio('sounds effect/radiation.mp3');
        radiationAudio.play();
    }

    function showUserText() {
        document.getElementById('user-text').style.display = 'block';
    }

    function scheduleNextCosmicRadiation() {
        setTimeout(() => {
            showCosmicRadiation();
        }, Math.random() * 300); // Adjust the interval for next cosmic radiation
    }
    scheduleNextCosmicRadiation(); // Start the cycle of random cosmic radiations

    
    let isDisplayingOutgassing = false;
    let outgassingTimeout;

    function showOutgassing() {
        if (isDisplayingOutgassing || isDisplayingCosmicRadiation || isDisplayingHeavyTemp || isDisplayingSolar) return;
        isDisplayingOutgassing = true;

        outgassingTimeout = setTimeout(() => {
            document.getElementById('outgassing').style.display = 'block';
            playOutgassingAudio();
            setTimeout(() => {
                document.getElementById('outgassing').style.display = 'none';
                showUserText();
                isDisplayingOutgassing = false; // Reset the flag
                scheduleNextOutgassing(); // Schedule the next random outgassing
            }, 14000); // Adjust the delay as needed
        }, Math.random() * 30000); // Adjust the interval for random appearance
    }
    function playOutgassingAudio() {
        let outgassingAudio = new Audio('sounds effect/outgassing.mp3');
        outgassingAudio.play();
    }
    function scheduleNextOutgassing() {
        setTimeout(() => {
            showOutgassing();
        }, Math.random() * 400); // Adjust the interval for next outgassing
    }
    scheduleNextOutgassing(); 


        let isDisplayingHeavyTemp = false;
        let heavyTempTimeout;

        function showHeavyTemp() {
            if (isDisplayingHeavyTemp || isDisplayingCosmicRadiation || isDisplayingOutgassing || isDisplayingSolar) return;
            isDisplayingHeavyTemp = true;

            heavyTempTimeout = setTimeout(() => {
                document.getElementById('heavytemp').style.display = 'block';
                playHeavyTempAudio();
                setTimeout(() => {
                    document.getElementById('heavytemp').style.display = 'none';
                    showUserText();
                    isDisplayingHeavyTemp = false; // Reset the flag
                    scheduleNextHeavyTemp(); // Schedule the next random heavytemp
                }, 14000); // Adjust the delay as needed
            }, Math.random() * 30000); // Adjust the interval for random appearance
        }

        function playHeavyTempAudio() {
            let heavyTempAudio = new Audio('sounds effect/heavytemp.mp3');
            heavyTempAudio.play();
        }

        function scheduleNextHeavyTemp() {
            setTimeout(() => {
                showHeavyTemp();
            }, Math.random() * 500); // Adjust the interval for next heavytemp
        }

        scheduleNextHeavyTemp();


        let isDisplayingSolar = false;
        let solarTimeout;
        
        function showSolar() {
            if (isDisplayingSolar || isDisplayingCosmicRadiation || isDisplayingHeavyTemp || isDisplayingOutgassing) return;
            isDisplayingSolar = true;
        
            solarTimeout = setTimeout(() => {
                document.getElementById('solar').style.display = 'block';
                playSolarAudio();
                setTimeout(() => {
                    document.getElementById('solar').style.display = 'none';
                    showUserText();
                    isDisplayingSolar = false; // Reset the flag
                    scheduleNextSolar(); // Schedule the next random solar event
                }, 14000); // Adjust the delay as needed
            }, Math.random() * 30000); // Adjust the interval for random appearance
        }
        
        function playSolarAudio() {
            let solarAudio = new Audio('sounds effect/solar.mp3');
            solarAudio.play();
        }
        
        function scheduleNextSolar() {
            setTimeout(() => {
                showSolar();
            }, Math.random() * 500); // Adjust the interval for next solar event
        }
        
        scheduleNextSolar();
        

    
     

        

    let debris_separation = 0;
    function create_debris() {
        if (game_state !== 'Play') return;
    
        if (debris_separation > 250) {
            debris_separation = 0;
    
            let debris_pos_x = Math.floor(Math.random() * window.innerWidth);
            let debris_pos_y = Math.floor(Math.random() * window.innerHeight);
        if (Math.abs(debris_pos_x - telescope_props.left) > 300) { 
            let debris = document.createElement('div');
            debris.className = 'debris';
    
            const randomDebrisNumber = Math.floor(Math.random() * 2) + 1;
            debris.style.backgroundImage = `url('images/debris${randomDebrisNumber}.png')`;
    
            debris.style.left = debris_pos_x + 'px';
            debris.style.top = debris_pos_y + 'px';
    
            document.body.appendChild(debris);
        }
    }
        debris_separation++;
        requestAnimationFrame(create_debris);
    }
   
    requestAnimationFrame(create_debris);

     
}
function asteroid_hit() {
    sound_die.play();
}  

/*function increase_score() {
    setTimeout(() => {
        score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
        sound_point.play();
    }, 500); // Adjust the delay (in milliseconds) as needed
}*/
function increase_score() {
    const newScore = parseInt(score_val.innerHTML) + 1;
    score_val.innerHTML = newScore;
    sound_point.play();

    /*if (parseInt(score_val.innerHTML)>=100) {
        isCosmicRadiationShown = true;
        showCosmicRadiation();
    }*/
}
 
}
