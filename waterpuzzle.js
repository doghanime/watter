document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById('game-container');
    const playButton = document.getElementById('play-button');
    const levelSelect = document.getElementById('level-select');
    const completeCountText = document.getElementById('complete-count');
    const maxLevel = 10;

    const tubes = [];
    let levelCount = 2; // 一開始設2個顏色
    let selectedTube = null;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'brown', 'lime'];

    function chooseLevel(level) {
        levelCount = level + 1; // 這裡加1，讓第一關就有2種顏色
        document.getElementById('level-count').textContent = level;
    }

    levelSelect.addEventListener('change', (event) => {
        const selectedLevel = parseInt(event.target.value, 10);
        chooseLevel(selectedLevel);
    });

    function createTubes() {
        gameContainer.innerHTML = "";
        tubes.length = 0;
        completeCountText.textContent = "0";

        for (let i = 0; i < levelCount; i++) {
            const tube = document.createElement('div');
            tube.classList.add('tube');
            tube.addEventListener('click', () => selectTube(tube));
            gameContainer.appendChild(tube);
            tubes.push(tube);
        }

        for (let i = 0; i < 2; i++) {
            const emptyTube = document.createElement('div');
            emptyTube.classList.add('tube');
            emptyTube.addEventListener('click', () => selectTube(emptyTube));
            gameContainer.appendChild(emptyTube);
            tubes.push(emptyTube);
        }
    }

    function fillTubes() {
        const colorPool = [];

        for (let i = 0; i < levelCount; i++) {
            for (let j = 0; j < 4; j++) {
                colorPool.push(colors[i]);
            }
        }

        colorPool.sort(() => Math.random() - 0.5);

        let colorIndex = 0;
        for (let i = 0; i < levelCount; i++) {
            const tube = tubes[i];
            for (let j = 0; j < 4; j++) {
                const water = document.createElement('div');
                water.classList.add('water');
                water.style.backgroundColor = colorPool[colorIndex++];
                tube.appendChild(water);
            }
        }
    }

    function selectTube(tube) {
        if (!selectedTube) {
            selectedTube = tube;
            tube.classList.add('selected');
        } else {
            if (tube !== selectedTube) {
                pourWater(selectedTube, tube);
            }
            selectedTube.classList.remove('selected');
            selectedTube = null;
        }
    }

    function pourWater(fromTube, toTube) {
        const fromWaters = Array.from(fromTube.children);
        const toWaters = Array.from(toTube.children);

        if (fromWaters.length === 0) return;

        const topWater = fromWaters[fromWaters.length - 1];
        const topColor = topWater.style.backgroundColor;

        if (toWaters.length >= 4) return;

        if (toWaters.length === 0 || toWaters[toWaters.length - 1].style.backgroundColor === topColor) {
            let moveCount = 0;

            for (let i = fromWaters.length - 1; i >= 0; i--) {
                const water = fromWaters[i];
                if (water.style.backgroundColor === topColor && toWaters.length + moveCount < 4) {
                    moveCount++;
                } else {
                    break;
                }
            }

            for (let j = 0; j < moveCount; j++) {
                const water = fromTube.lastElementChild;
                fromTube.removeChild(water);
                toTube.appendChild(water);
            }

            checkComplete(fromTube);
            checkComplete(toTube);
        }
    }

    function checkComplete(tube) {
        const waters = Array.from(tube.children);
        if (waters.length !== 4) return false;
        const color = waters[0].style.backgroundColor;
        const allSame = waters.every(w => w.style.backgroundColor === color);

        if (allSame) {
            tube.style.border = '3px solid green';
            updateCompleteCount();
            return true;
        }
        return false;
    }

    function updateCompleteCount() {
        const completed = tubes.filter(tube => {
            const waters = Array.from(tube.children);
            if (waters.length !== 4) return false;
            const color = waters[0].style.backgroundColor;
            return waters.every(w => w.style.backgroundColor === color);
        }).length;

        completeCountText.textContent = completed;

        if (completed === levelCount) {
            setTimeout(() => {
                alert('你已完成本關卡！');
                nextLevel();
            }, 200);
        }
    }

    function nextLevel() {
        let next = parseInt(levelSelect.value) + 1;
        if (next > maxLevel) next = 1; // 超過10回到第1關
        levelSelect.value = next;
        chooseLevel(next);
        createTubes();
        fillTubes();
    }

    playButton.addEventListener('click', () => {
        const selectedLevel = parseInt(levelSelect.value, 10);
        chooseLevel(selectedLevel);
        createTubes();
        fillTubes();
    });

    // 預設一開始就載入第一關
    chooseLevel(1);
    createTubes();
    fillTubes();
});
