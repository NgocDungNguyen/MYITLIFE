
    function playSoundWithFallback(sound) {
        if (sound.readyState === 4) { // HAVE_ENOUGH_DATA
            sound.play().catch(e => console.error("Error playing sound:", e));
        }
    }
  
    const switch1 = document.getElementById('switch1');
    const switch2 = document.getElementById('switch2');
    const switch3 = document.getElementById('switch3');
    const message = document.getElementById('message');
    const gameContainer = document.querySelector('.game-container');
    const gameOver = document.getElementById('gameOver');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const scoreValue = document.getElementById('scoreValue');
    const switchSound = document.getElementById('switchSound');
    const achievementSound = document.getElementById('achievementSound');
    const dayNightCycle = document.querySelector('.day-night-cycle');

    let switchCount = 0;
    let messageIndex = 0;
    let score = 0;
    let isDay = true;
    let mood = 50; // 0-100 scale
    let gameInterval;
    let activeIcon;

    function updateSwitches(changedSwitch) {
        if (switch2.checked && switch3.checked && changedSwitch === switch1 && switch1.checked) {
            switch1.checked = false;
            switch2.checked = false;
            switch3.checked = false;
            showWakeUpMessage();
        } else if (switch1.checked) {
            if (switch2.checked && switch3.checked) {
                if (changedSwitch === switch2) {
                    switch3.checked = false;
                } else if (changedSwitch === switch3) {
                    switch2.checked = false;
                }
            }
            updateMessage();
        } else {
            updateMessage();
        }

        gameContainer.classList.add('pulse');
        setTimeout(() => gameContainer.classList.remove('pulse'), 500);

        setTimeout(() => playSoundWithFallback(switchSound), 50);
        updateScore();
        checkAchievements();
        updateMood(5); // Mood slightly improves with each interaction
        startIconGame(); // Start a new icon game round

        switchCount++;
        if (switchCount >= 10) {
            endGame();
        }
    }

    function updateMessage() {
        const messages = {
            "100": [
                "Just you and your computer. Classic IT romance!",
                "Ah, the sweet sound of keyboard clacking... and loneliness.",
                "Living the dream? More like living in a screen!",
                "No money, no honey, but hey, you've got Python!"
            ],
            "110": [
                "Wow, a nerd with money! But can you code a girlfriend?",
                "Scholarship? Check. Love life? 404 Not Found.",
                "Smart move! But remember, money can't buy love... or social skills.",
                "You're investing in your brain, but what about your heart?"
            ],
            "101": [
                "Love and code, huh? Hope your laptop doesn't get jealous!",
                "Relationship status: Committed... to debugging.",
                "Who needs money when you have love and Stack Overflow?",
                "Love is in the air... and so is the smell of burnt circuits."
            ],
            "010": [
                "Smart cookie! But what's your major? Procrastination?",
                "All that knowledge and no IT skills? Interesting choice...",
                "You're on a full ride, but to where exactly?",
                "Congrats on the scholarship! Now, about that career plan..."
            ],
            "001": [
                "All love, no brain? Hope your partner likes fast food jobs!",
                "Cupid's arrow hit you, but missed your career aspirations.",
                "Love is blind, but maybe not this blind?",
                "Relationship goals: Achieved. Career goals: Loading..."
            ],
            "011": [
                "Smart and loved, but not geeky? What a waste of potential!",
                "Living the dream! But have you considered adding some IT to spice things up?",
                "You've got brains and beauty, but can you turn on a computer?",
                "Scholarship and love? Save some luck for the rest of us!"
            ],
            "000": [
                "Indecisive much? Life's not a multiple-choice question!",
                "Blank slate, huh? Time to start painting your future!",
                "You're like a computer without OS. Boot up your life!",
                "Hello World! Now, let's add some content to your life."
            ]
        };

        const key = `${switch1.checked ? 1 : 0}${switch2.checked ? 1 : 0}${switch3.checked ? 1 : 0}`;
        const options = messages[key];
        messageIndex = (messageIndex + 1) % options.length;
        const text = options[messageIndex];
        const icon = getIconForKey(key);
        
        message.innerHTML = `${icon}${text}`;
    }

    function showWakeUpMessage() {
        const wakeUpMessages = [
            "Wake up, bro! It's not real!",
            "Nice dream, but time to face reality!",
            "Sorry, you can't have it all. Welcome back to the real world!",
            "Oops! Your perfect life just crashed. Reboot to reality!",
            "Error 404: Perfect life not found. Time to wake up!"
        ];
        message.innerHTML = `<i class="fas fa-exclamation-triangle icon"></i>${wakeUpMessages[Math.floor(Math.random() * wakeUpMessages.length)]}`;
    }

    function getIconForKey(key) {
        const icons = {
            "100": '<i class="fas fa-laptop icon"></i>',
            "110": '<i class="fas fa-book-reader icon"></i>',
            "101": '<i class="fas fa-code icon"></i>',
            "010": '<i class="fas fa-university icon"></i>',
            "001": '<i class="fas fa-heartbeat icon"></i>',
            "011": '<i class="fas fa-user-graduate icon"></i>',
            "000": '<i class="fas fa-question icon"></i>'
        };
        return icons[key];
    }

    function updateScore() {
        score += 10;
        scoreValue.textContent = score;
    }

    function checkAchievements() {
        if (switch1.checked && !document.getElementById('ach1').classList.contains('unlocked')) {
            unlockAchievement('ach1');
        }
        if (switch2.checked && !document.getElementById('ach2').classList.contains('unlocked')) {
            unlockAchievement('ach2');
        }
        if (switch3.checked && !document.getElementById('ach3').classList.contains('unlocked')) {
            unlockAchievement('ach3');
        }
    }

    function unlockAchievement(achId) {
        document.getElementById(achId).classList.add('unlocked');
        playSoundWithFallback(achievementSound);
    }

    function updateMood(change) {
        mood = Math.max(0, Math.min(100, mood + change));
        document.getElementById('moodMeter').style.width = `${mood}%`;
        document.getElementById('moodEmoji').textContent = getMoodEmoji();
    }

    function getMoodEmoji() {
        if (mood < 20) return '😭';
        if (mood < 40) return '😢';
        if (mood < 60) return '😐';
        if (mood < 80) return '😊';
        return '😄';
    }

    function startIconGame() {
        if (gameInterval) clearInterval(gameInterval);
        let iconCount = 0;
        gameInterval = setInterval(() => {
            if (iconCount >= 5) {
                clearInterval(gameInterval);
                return;
            }
            const icons = document.querySelectorAll('.floating-icon');
            activeIcon = icons[Math.floor(Math.random() * icons.length)];
            activeIcon.classList.add('active');
            setTimeout(() => {
                if (activeIcon.classList.contains('active')) {
                    activeIcon.classList.remove('active');
                    updateMood(-5);
                }
            }, 2000);
            iconCount++;
        }, 3000);
    }

    function triggerRandomEvent() {
        const events = [
            { text: "Your code unexpectedly works on the first try!", mood: 15 },
            { text: "You spilled coffee on your keyboard!", mood: -10 },
            { text: "You found a $20 bill in your old jeans!", mood: 5 },
            { text: "Your favorite game is on sale!", mood: 8 },
            { text: "You missed an important deadline!", mood: -20 }
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        showNotification(event.text);
        updateMood(event.mood);
    }

    function showNotification(text) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = text;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function endGame() {
        gameOverMessage.textContent = "You've flipped too many switches! Time to face real life!";
        gameOver.classList.add('show');
    }

    function restartGame() {
        switchCount = 0;
        messageIndex = 0;
        score = 0;
        mood = 50;
        scoreValue.textContent = score;
        switch1.checked = false;
        switch2.checked = false;
        switch3.checked = false;
        updateMessage();
        updateMood(0);
        gameOver.classList.remove('show');
        document.querySelectorAll('.achievement').forEach(ach => ach.classList.remove('unlocked'));
        startIconGame();
    }

    // Day/Night Cycle
    setInterval(() => {
        isDay = !isDay;
        dayNightCycle.style.backgroundColor = isDay ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0.5)';
    }, 30000);

    // Cheat Code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                alert('Cheat activated: Unlimited switches!');
                switchCount = -Infinity;
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Event Listeners
    switch1.addEventListener('change', () => updateSwitches(switch1));
    switch2.addEventListener('change', () => updateSwitches(switch2));
    switch3.addEventListener('change', () => updateSwitches(switch3));

    // Easter egg: Click on floating icons
    document.querySelectorAll('.floating-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            if (icon.classList.contains('active')) {
                icon.classList.remove('active');
                updateMood(10);
                updateScore();
                playSoundWithFallback(achievementSound);
            }
            icon.style.transform = 'scale(1.5) rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 1000);
        });
    });

    // Random events
    setInterval(triggerRandomEvent, 15000); // Random event every 15 seconds

    // Initial setup
    updateMessage();
    updateMood(0);
    startIconGame();
