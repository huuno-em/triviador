document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    let cubeCount = 0;     
    const cubeStates = []; 
    const cubeScores = [];
    let interval; 
    let currentQuestionIndex = 0;
    let gameStarted = false; 

    const questions = [
        {
            question: "ты гей?",
            answer: "да"
        },
        {
            question: "ты натурал?",
            answer: "нет"
        },
    ];

    const cubes = [];
    let leaderButton;

    function addCube(playerName) {     
        if (cubeCount < 3) {  
            const cubesContainer = document.getElementById('cubes'); 
            
            const cube = document.createElement('div'); 
            cube.className = 'cube'; 
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.style.backgroundImage = "url('user_avatar.png')";
            avatar.style.backgroundSize = 'cover';
        
            const playerNameContainer = document.createElement('div');
            playerNameContainer.className = 'player-name';
            playerNameContainer.textContent = playerName;
            
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
        
            if (cubeCount === 0) {
                indicator.style.backgroundColor = '#9af995';
            } else if (cubeCount === 1) {
                indicator.style.backgroundColor = '#76c7c0';
            } else if (cubeCount === 2) {
                indicator.style.backgroundColor = '#ff5a5a';
            }    
        
            cube.appendChild(avatar);
            cube.appendChild(playerNameContainer);
            cube.appendChild(indicator);
            
            const scoreContainer = document.createElement('div'); 
            scoreContainer.className = 'score-container'; 
            const scoreDisplay = document.createElement('div'); 
            scoreDisplay.className = 'score'; 
            scoreDisplay.textContent = '0'; 
            cubeScores[cubeCount] = 0;
            scoreContainer.appendChild(scoreDisplay); 
            cube.appendChild(scoreContainer); 
            cubes.push(cube);
            cubesContainer.appendChild(cube); 
    
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
    
            const readyButton = document.createElement('button'); 
            readyButton.className = 'ready-button'; 
            readyButton.onclick = function() { 
                if (!gameStarted) { 
                    cube.classList.toggle('ready'); 
                    cubeStates[cubeCount] = cube.classList.contains('ready');
                    indicator.style.backgroundColor = cubeStates[cubeCount] ? indicator.style.backgroundColor : '#CCCCCC';
                    checkCubesReady(); 
                } 
            }; 
    
            buttonContainer.appendChild(readyButton);
            cube.appendChild(buttonContainer);
    
            if (cubeCount !== 0) {
                buttonContainer.classList.add('center-button');
            }
    
            cubeStates.push(false); 
            cubeCount++; 
        } 
    }
    
    window.onload = function() { 
        const playerNames = ['Пукич', 'крутой пацан', 'PlayShark228'];
        playerNames.forEach(name => addCube(name));
        createLeaderButton();
    };

    function createLeaderButton() {
        const cubesContainer = document.getElementById('cubes');
        leaderButton = document.createElement('button');
        leaderButton.textContent = 'IGL';
        leaderButton.className = 'leader-button'; 
        leaderButton.style.marginLeft = '10px';
        
        leaderButton.classList.add('fade-in');
        leaderButton.disabled = true;
    
        leaderButton.onclick = function() {
            if (!leaderButton.disabled) { 
                startGame();
            }
        };
    
        cubesContainer.appendChild(leaderButton);
        checkCubesReady();
    }

    function startGame() {
        gameStarted = true;

        const infoContainer = document.getElementById('gameInfoContainer');
        infoContainer.classList.add('pointer-events-auto', 'opacity-one');

        const waitingPlayers = document.getElementById('waitingPlayers');
        waitingPlayers.classList.add('hidden');

        leaderButton.style.visibility = 'hidden'; 

        const readyButtons = document.querySelectorAll('.ready-button');
        readyButtons.forEach(button => {
            button.style.display = 'none';
        });

        changeQuestion();
    }

    function checkCubesReady() { 
        const cubes = document.querySelectorAll('.cube'); 
        const allReady = Array.from(cubes).every(cube => cube.classList.contains('ready'));

        const waitingPlayers = document.getElementById('waitingPlayers');

        if (allReady) {
            waitingPlayers.classList.add('hidden');
            leaderButton.disabled = false; 
        } else {
            waitingPlayers.classList.remove('hidden');
            leaderButton.disabled = true; 
        }
    }

    function startTimer() { 
        const timerBar = document.getElementById('timerBar'); 
        const timerDuration = 5; 
        let width = 100;
        timerBar.style.width = `${width}%`; 

        interval = setInterval(() => {
            width -= (100 / timerDuration);
            timerBar.style.width = `${width}%`;
            
            if (width <= 0) {
                clearInterval(interval);
                checkAnswer();
            }
        }, 1000);
    } 

    function changeQuestion() {
        const questionContainer = document.getElementById('questionContainer');
        const answerInput = document.getElementById('answerInput');
        const gameInfoContainer = document.getElementById('gameInfoContainer');

        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        questionContainer.textContent = questions[currentQuestionIndex].question;
        answerInput.value = "";

        gameInfoContainer.classList.remove('hidden');

        startTimer();
    }

    function checkAnswer() {
        const answerInput = document.getElementById('answerInput');
        const userAnswer = answerInput.value.trim();
        const questionContainer = document.getElementById('questionContainer'); 

        const isCorrect = userAnswer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase();
        questionContainer.textContent = `Правильный ответ: ${questions[currentQuestionIndex].answer}`; 
        
        updateScore(isCorrect); 

        setTimeout(nextQuestion, 5000);
    }

    function updateScore(isCorrect) {
        const cubes = document.querySelectorAll('.cube'); 
        cubes.forEach((cube, index) => {
            if (isCorrect) {
                cubeScores[index] += 10;
            }
            cube.querySelector('.score').textContent = `${cubeScores[index]}`; 
        });
    }

    function nextQuestion() {
        const gameInfoContainer = document.getElementById('gameInfoContainer');
        gameInfoContainer.classList.remove('pointer-events-auto', 'opacity-one');
        gameInfoContainer.classList.add('hidden');

        resetGame();
    }

    function resetGame() {
        clearInterval(interval);
        const cubes = document.querySelectorAll('.cube');
        cubes.forEach(cube => {
            cube.classList.remove('ready');
        });
        
        const timerBar = document.getElementById('timerBar');
        timerBar.style.width = `100%`;
        
        changeQuestion(); 
    }
}
