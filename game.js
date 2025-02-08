// State Data
const states = {
    "Alabama": { capital: "Montgomery", region: "Southeast" },
    "Alaska": { capital: "Juneau", region: "West" },
    "Arizona": { capital: "Phoenix", region: "Southwest" },
    "Arkansas": { capital: "Little Rock", region: "Southeast" },
    "California": { capital: "Sacramento", region: "West" },
    "Colorado": { capital: "Denver", region: "West" },
    "Connecticut": { capital: "Hartford", region: "Northeast" },
    "Delaware": { capital: "Dover", region: "Northeast" },
    "Florida": { capital: "Tallahassee", region: "Southeast" },
    "Georgia": { capital: "Atlanta", region: "Southeast" },
    "Hawaii": { capital: "Honolulu", region: "West" },
    "Idaho": { capital: "Boise", region: "West" },
    "Illinois": { capital: "Springfield", region: "Midwest" },
    "Indiana": { capital: "Indianapolis", region: "Midwest" },
    "Iowa": { capital: "Des Moines", region: "Midwest" },
    "Kansas": { capital: "Topeka", region: "Midwest" },
    "Kentucky": { capital: "Frankfort", region: "Southeast" },
    "Louisiana": { capital: "Baton Rouge", region: "Southeast" },
    "Maine": { capital: "Augusta", region: "Northeast" },
    "Maryland": { capital: "Annapolis", region: "Northeast" },
    "Massachusetts": { capital: "Boston", region: "Northeast" },
    "Michigan": { capital: "Lansing", region: "Midwest" },
    "Minnesota": { capital: "Saint Paul", region: "Midwest" },
    "Mississippi": { capital: "Jackson", region: "Southeast" },
    "Missouri": { capital: "Jefferson City", region: "Midwest" },
    "Montana": { capital: "Helena", region: "West" },
    "Nebraska": { capital: "Lincoln", region: "Midwest" },
    "Nevada": { capital: "Carson City", region: "West" },
    "New Hampshire": { capital: "Concord", region: "Northeast" },
    "New Jersey": { capital: "Trenton", region: "Northeast" },
    "New Mexico": { capital: "Santa Fe", region: "Southwest" },
    "New York": { capital: "Albany", region: "Northeast" },
    "North Carolina": { capital: "Raleigh", region: "Southeast" },
    "North Dakota": { capital: "Bismarck", region: "Midwest" },
    "Ohio": { capital: "Columbus", region: "Midwest" },
    "Oklahoma": { capital: "Oklahoma City", region: "Southwest" },
    "Oregon": { capital: "Salem", region: "West" },
    "Pennsylvania": { capital: "Harrisburg", region: "Northeast" },
    "Rhode Island": { capital: "Providence", region: "Northeast" },
    "South Carolina": { capital: "Columbia", region: "Southeast" },
    "South Dakota": { capital: "Pierre", region: "Midwest" },
    "Tennessee": { capital: "Nashville", region: "Southeast" },
    "Texas": { capital: "Austin", region: "Southwest" },
    "Utah": { capital: "Salt Lake City", region: "West" },
    "Vermont": { capital: "Montpelier", region: "Northeast" },
    "Virginia": { capital: "Richmond", region: "Northeast" },
    "Washington": { capital: "Olympia", region: "West" },
    "West Virginia": { capital: "Charleston", region: "Northeast" },
    "Wisconsin": { capital: "Madison", region: "Midwest" },
    "Wyoming": { capital: "Cheyenne", region: "West" }
};

// Game State Variables
let score = 0;
let questionCount = 0;
let correctAnswers = {};
let incorrectStates = [];
let gameCount = localStorage.getItem('gameCount') || 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Initialize Game
InitializeGame();

// Initialize Game Data
function InitializeGame() {
    document.getElementById('count').textContent = gameCount;
    ShowWelcomeScreen();
    UpdateLeaderboard();
}

// Display Welcome Screen
function ShowWelcomeScreen() {
    HideAllContainers();
    document.getElementById('welcome').classList.remove('hide');
}

// Hide All Containers
function HideAllContainers() {
    document.getElementById('welcome').classList.add('hide');
    document.getElementById('game').classList.add('hide');
    document.getElementById('end').classList.add('hide');
}

// Start Game
document.getElementById('startButton').addEventListener('click', StartGame);

function StartGame() {
    gameCount = (parseInt(gameCount) || 0) + 1;
    localStorage.setItem('gameCount', gameCount);
    UpdateGameCountDisplay();

    score = 0;
    questionCount = 0;
    correctAnswers = {};
    incorrectStates = [];
    
    HideAllContainers();
    document.getElementById('game').classList.remove('hide');
    AskQuestion();
}

// Update Game Count Display
function UpdateGameCountDisplay() {
    document.getElementById('count').textContent = gameCount;
}

// Ask Question
function AskQuestion() {
    const state = SelectAdaptiveState();
    document.getElementById('flashcard').textContent = `State: ${state}`;
    document.getElementById('feedback').className = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('capitalInput').value = '';
    HighlightStateOnMap(state);
}

// Select Adaptive State
function SelectAdaptiveState() {
    let candidates = [];
    const learnedStates = Object.keys(correctAnswers).filter(state => correctAnswers[state] > 2);
    
    // Increase frequency for harder states
    for (const state in states) {
        if (incorrectStates.includes(state)) {
            candidates.push(state);
        } else if (!learnedStates.includes(state)) {
            candidates.push(state);
        } else {
            // Slightly increase frequency for learned states for occasional repetition
            if (Math.random() < 0.2) candidates.push(state);
        }
    }

    // Ensure variety across regions
    const regions = ['Northeast', 'Midwest', 'Southeast', 'Southwest', 'West'];
    for (const region of regions) {
        const regionalStates = Object.entries(states)
            .filter(([state, data]) => data.region === region && !learnedStates.includes(state))
            .map(([state]) => state);
        if (regionalStates.length > 0) {
            candidates.push(regionalStates[Math.floor(Math.random() * regionalStates.length)]);
        }
    }

    // Return a random state from candidates
    return candidates[Math.floor(Math.random() * candidates.length)];
}

// Highlight State on Map
function HighlightStateOnMap(state) {
    // This is a placeholder function; implement actual map highlighting in a real deployment
}

// Check Answer
document.getElementById('capitalInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') CheckAnswer();
});

function CheckAnswer() {
    const input = document.getElementById('capitalInput').value.toLowerCase();
    const currentQuestion = Object.keys(states).find(state => document.getElementById('flashcard').textContent.includes(state));
    const correctCapital = states[currentQuestion].capital.toLowerCase();
    
    if (input === correctCapital) {
        score += 10;
        correctAnswers[currentQuestion] = (correctAnswers[currentQuestion] || 0) + 1;
        ShowFeedback("correct", "🎉 Correct!");
        UpdateScoreDisplay();
    } else {
        ShowFeedback("incorrect", "❌ Incorrect. Try again!");
        incorrectStates.push(currentQuestion);
    }
}

function ShowFeedback(type, message) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.className = `feedback ${type}`;
    feedbackElement.textContent = message;
    feedbackElement.classList.add('fade-in');

    setTimeout(() => {
        feedbackElement.classList.remove('fade-in');
    }, 1000);
}

// Update Score Display
function UpdateScoreDisplay() {
    document.getElementById('grade').textContent = `Score: ${score} points`;
}

// Next Question
document.getElementById('nextButton').addEventListener('click', function() {
    questionCount++;
    if (questionCount >= 10) EndGame();
    else AskQuestion();
});

// End Game
function EndGame() {
    HideAllContainers();
    document.getElementById('end').classList.remove('hide');
    document.getElementById('finalScore').textContent = score;
    const grade = CalculateGrade(score);
    document.getElementById('finalGrade').textContent = `Grade: ${grade}`;

    // Add to leaderboard
    leaderboard.push({ score, grade, date: new Date().toLocaleDateString() });
    // Sort leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);
    // Keep only top 10 scores
    if (leaderboard.length > 10) leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    UpdateLeaderboard();
}

// Calculate Grade
function CalculateGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}

// Play Again
document.getElementById('playAgain').addEventListener('click', StartGame);

// Update Leaderboard
function UpdateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.date} - Score: ${entry.score}, Grade: ${entry.grade}`;
        leaderboardList.appendChild(listItem);
    });
}

// Initial Score Meter Setup (requires additional implementation)
function InitializeScoreMeter(elementId) {
    // Implement drawing logic for the score meter
}
