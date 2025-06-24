// script.js
document.addEventListener('DOMContentLoaded', function() {
    // 画面要素の取得
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');
    const settings = document.getElementById('settings');
    const scoreScreen = document.getElementById('scoreScreen');
    const startButton = document.getElementById('startButton');
    const settingsButton = document.getElementById('settingsButton');
    const scoreButton = document.getElementById('scoreButton');
    const settingsBack = document.getElementById('settingsBack');
    const scoreBack = document.getElementById('scoreBack');
    const endGameButton = document.getElementById('endGameButton');

    const timeSpan = document.getElementById('time');
    const scoreSpan = document.getElementById('score');
    const wordDisplay = document.getElementById('wordDisplay');
    const passcodeInput = document.getElementById('passcodeInput');
    const passcodeButton = document.getElementById('passcodeButton');
    const minLenInput = document.getElementById('minLenInput');
    const maxLenInput = document.getElementById('maxLenInput');
    const saveSettings = document.getElementById('saveSettings');

    const bestScoreSpan = document.getElementById('bestScore');
    const worstScoreSpan = document.getElementById('worstScore');
    const averageScoreSpan = document.getElementById('averageScore');

    // ゲーム用変数
    let timeLeft = 60;
    let score = 0;
    let timerInterval;
    let currentWord = '';
    let currentIndex = 0;
    let gameActive = false;

    // 設定用
    const correctPasscode = '1234';  // パスコード（適宜変更可能）
    let minLen = 3;
    let maxLen = 7;

    // 単語リスト（例）
    const words = [
        "apple","banana","orange","grape","lemon","mango","peach","cherry","melon","kiwi",
        "strawberry","blueberry","watermelon","pineapple","apricot","coconut","avocado","pear",
        "plum","papaya","grapefruit","peanut","almond","hazelnut","cashew","melon","juice",
        "keyboard","computer","document","javascript","developer","function","variable","internet",
        "browser","object","python","java","course","education","knowledge","typing","speed","practice",
        "program","random","challenge","solution","memory","mouse","screen","monitor","website","code"
    ];

    // 画面の切り替え
    function showScreen(screen) {
        menu.style.display = 'none';
        game.style.display = 'none';
        settings.style.display = 'none';
        scoreScreen.style.display = 'none';
        if (screen === 'menu') {
            menu.style.display = 'block';
        } else if (screen === 'game') {
            game.style.display = 'block';
        } else if (screen === 'settings') {
            settings.style.display = 'block';
        } else if (screen === 'score') {
            scoreScreen.style.display = 'block';
        }
    }

    // メニューに戻るボタン
    settingsBack.addEventListener('click', function() {
        showScreen('menu');
    });
    scoreBack.addEventListener('click', function() {
        showScreen('menu');
    });

    // ボタンイベント
    startButton.addEventListener('click', function() {
        startGame();
    });
    settingsButton.addEventListener('click', function() {
        showScreen('settings');
    });
    scoreButton.addEventListener('click', function() {
        updateScoreBoard();
        showScreen('score');
    });
    endGameButton.addEventListener('click', function() {
        endGame();
    });

    // パスコード確認
    passcodeButton.addEventListener('click', function() {
        const code = passcodeInput.value;
        if (code === correctPasscode) {
            alert('パスコード認証成功');
            minLenInput.disabled = false;
            maxLenInput.disabled = false;
            saveSettings.disabled = false;
            minLenInput.value = minLen;
            maxLenInput.value = maxLen;
        } else {
            alert('パスコードが違います');
        }
    });

    // 設定保存
    saveSettings.addEventListener('click', function() {
        const minVal = parseInt(minLenInput.value);
        const maxVal = parseInt(maxLenInput.value);
        if (minVal > 0 && maxVal >= minVal) {
            minLen = minVal;
            maxLen = maxVal;
            alert('設定が保存されました');
        } else {
            alert('最小/最大文字数を正しく入力してください');
        }
    });

    // キー入力処理
    function handleKey(event) {
        if (!gameActive) return;
        const key = event.key;
        if (key.length === 1) {
            const targetChar = currentWord[currentIndex];
            if (key.toLowerCase() === targetChar) {
                // 正解
                const spanList = wordDisplay.querySelectorAll('span');
                spanList[currentIndex].classList.add('correct');
                currentIndex++;
                if (currentIndex === currentWord.length) {
                    // 単語終了
                    score++;
                    scoreSpan.textContent = score;
                    newWord();
                }
            } else {
                // ミス
                score = Math.max(0, score - 1);
                scoreSpan.textContent = score;
                timeLeft = Math.max(0, timeLeft - 1);
                timeSpan.textContent = timeLeft;
                // エフェクト: 赤く点滅
                wordDisplay.classList.add('error');
                setTimeout(() => {
                    wordDisplay.classList.remove('error');
                }, 300);
            }
        }
    }

    // 新しい単語を表示
    function newWord() {
        // 指定の文字数範囲内でランダムに単語を取得
        const filtered = words.filter(w => w.length >= minLen && w.length <= maxLen);
        let list = filtered.length > 0 ? filtered : words;
        currentWord = list[Math.floor(Math.random() * list.length)];
        currentIndex = 0;
        // 画面に単語を表示（文字ごとに span 要素を作成）
        wordDisplay.innerHTML = '';
        for (let i = 0; i < currentWord.length; i++) {
            const span = document.createElement('span');
            span.textContent = currentWord[i];
            span.classList.add('letter');
            wordDisplay.appendChild(span);
        }
    }

    // ゲーム開始
    function startGame() {
        showScreen('game');
        // 初期化
        timeLeft = 60;
        score = 0;
        scoreSpan.textContent = score;
        timeSpan.textContent = timeLeft;
        gameActive = true;
        newWord();
        // タイマー開始
        timerInterval = setInterval(function() {
            timeLeft--;
            timeSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        document.addEventListener('keydown', handleKey);
    }

    // ゲーム終了
    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        document.removeEventListener('keydown', handleKey);
        // スコア保存
        let scores = JSON.parse(localStorage.getItem('typingGameScores') || '[]');
        scores.push(score);
        localStorage.setItem('typingGameScores', JSON.stringify(scores));
        alert('ゲーム終了! スコア: ' + score);
        // スコア画面へ遷移
        updateScoreBoard();
        showScreen('score');
    }

    // スコアボード更新
    function updateScoreBoard() {
        const scores = JSON.parse(localStorage.getItem('typingGameScores') || '[]');
        if (scores.length > 0) {
            const best = Math.max(...scores);
            const worst = Math.min(...scores);
            const sum = scores.reduce((a, b) => a + b, 0);
            const avg = (sum / scores.length).toFixed(2);
            bestScoreSpan.textContent = best;
            worstScoreSpan.textContent = worst;
            averageScoreSpan.textContent = avg;
        } else {
            bestScoreSpan.textContent = 0;
            worstScoreSpan.textContent = 0;
            averageScoreSpan.textContent = 0;
        }
    }
});
