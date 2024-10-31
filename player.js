document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    let cubeCount = 0;     
    const cubeStates = []; 
    const cubeScores = [];
    let interval; 
    let currentQuestionIndex = 0;

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

            cube.appendChild(avatar)
            cube.appendChild(playerNameContainer);
            cube.appendChild(indicator);
            
            const readyButton = document.createElement('button'); 
            readyButton.className = 'ready-button'; 
            readyButton.onclick = function() { 
                cube.classList.toggle('ready'); 
                cubeStates[cubeCount] = cube.classList.contains('ready'); 
                checkCubesReady(); 
            }; 

        const scoreContainer = document.createElement('div'); 
        scoreContainer.className = 'score-container'; 

        const scoreDisplay = document.createElement('div'); 
        scoreDisplay.className = 'score'; 
        scoreDisplay.textContent = '0'; 
        cubeScores[cubeCount] = 0;

        scoreContainer.appendChild(scoreDisplay); 
        cube.appendChild(readyButton); 
        cube.appendChild(scoreContainer); 
        cubesContainer.appendChild(cube); 

        cubeStates.push(false); 
        cubeCount++; 
    } 
} 

    function checkCubesReady() { 
        
        const cubes = document.querySelectorAll('.cube'); 
        const allReady = Array.from(cubes).every(cube => cube.classList.contains('ready'));

        const infoContainer = document.getElementById('gameInfoContainer');

        if (allReady) {

            const gameInfoContainer = document.getElementById('gameInfoContainer');
            gameInfoContainer.classList.add('pointer-events-auto', 'opacity-one');

            infoContainer.className = 'info-container'

            const waitingPlayers = document.getElementById('waitingPlayers')
            waitingPlayers.classList.add('hidden')

            startTimer();
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
        
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        questionContainer.textContent = questions[currentQuestionIndex].question;
        answerInput.value = "";
    }

    function checkAnswer() {
        const answerInput = document.getElementById('answerInput');
        const userAnswer = answerInput.value.trim();

        if (userAnswer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
            document.getElementById("toggleText").innerHTML = "Вы ответили правильно";
            updateScore(true);
        } else {
            document.getElementById("toggleText").innerHTML = `Вы ответили неправильно! Правильный ответ: ${questions[currentQuestionIndex].answer}`;
        }

        nextQuestion();
    }

    function updateScore(isCorrect) {
        const cubes = document.querySelectorAll('.cube'); 
        cubes.forEach((cube, index) => {
            if (cube.classList.contains('ready')) {
                if (isCorrect) {
                    cubeScores[index] += 10;
                }
                cube.querySelector('.score').textContent = `${cubeScores[index]}`;
            }
        });
    }

    function nextQuestion() {
        gameInfoContainer.classList.remove('pointer-events-auto', 'opacity-one');
        gameInfoContainer.classList.add('hidden');

        waitingPlayers.classList.remove('hidden')

        function beforeAnswer() {
            setTimeout(() => {
                document.getElementById("toggleText").innerHTML = "Ожидание игроков...";
            }, 5000);
        }
        
        beforeAnswer();

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
        
        gameInfoContainer.classList.add('hidden');

        changeQuestion();
    }

    window.onload = function() { 
        const playerNames = ['Пукич', 'крутой пацан', 'PlayShark228'];
        playerNames.forEach(name => addCube(name));
        changeQuestion();
    }; 
}