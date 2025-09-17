javascript:(function(){
  // Pi² 20 TPS Ultimate Auto-Clicker - Full Game Flow Automation with Realism
  console.log('🚀 Pi² 20 TPS Ultimate Auto-Clicker Starting...');
  
  let isActive = false;
  let clickCount = 0;
  let startTime = 0;
  let lastClickTime = 0;
  let sessionClicks = 0;
  let currentTPS = 0;
  let gameStarted = false;
  let clicksSinceIdle = 0;
  let nextIdleThreshold = 0;
  
  // Realism & Performance Configuration
  const config = {
    maxClicks: Math.floor(Math.random() * (250 - 210 + 1)) + 210,  // random between 210–250
    minTPS: 10,               // Target minimum TPS (at maxClicks)
    peakTPS: 20,              // Target peak TPS (at start)
    warningClicks: 200,       // Warning at 200 clicks
    pauseAfterLimit: (Math.floor(Math.random() * (15 - 10 + 1)) + 10) * 1000, // random 10–15 sec
    gameStartDelay: 2000,     // 2 second delay after starting game
    restartDelay: 3000,       // 3 second delay after game over
    idleClickMin: Math.floor(Math.random() * (50 - 35 + 1)) + 35,  // random 35–50
    idleClickMax: Math.floor(Math.random() * (70 - 55 + 1)) + 55,  // random 55–70
    idleDelayMin: 100,        // Min duration of idle pause (ms)
    idleDelayMax: 400         // Max duration of idle pause (ms)
  };
  
  // Function to add micro-jitter (±5ms randomization)
  function getJitter() {
    return Math.random() * 10 - 5; // ±5ms
  }

  // Function to calculate optimal delay with dynamic TPS curve
  function calculateDelay() {
    const minDelay = 1000 / config.peakTPS;
    const maxDelay = 1000 / config.minTPS;
    
    // Calculate the target delay using a linear decrease
    const progress = Math.min(sessionClicks / config.maxClicks, 1);
    let delay = minDelay + (maxDelay - minDelay) * progress;
    
    // Apply micro-jitter
    delay += getJitter();
    
    return delay;
  }
  
  // Function to get target color from the image alt text
  function getTargetColor() {
    const targetImg = document.querySelector('img[alt*="Target Color"]');
    if (targetImg) {
      const altText = targetImg.getAttribute('alt');
      const match = altText.match(/Target Color:\s*(\w+)/i);
      if (match) {
        return match[1].toUpperCase();
      }
    }
    return null;
  }
  
  // Function to find and click the correct orb
  function clickCorrectOrb() {
    const targetColor = getTargetColor();
    if (!targetColor) {
      console.log('❌ Could not find target color');
      return false;
    }
    
    // Find all orb buttons
    const orbButtons = document.querySelectorAll('button');
    let targetOrb = null;
    
    for (let button of orbButtons) {
      const img = button.querySelector('img');
      if (img && img.alt) {
        const altText = img.alt.toUpperCase();
        if (altText.includes(targetColor) && altText.includes('ORB')) {
          targetOrb = button;
          break;
        }
      }
    }
    
    if (targetOrb && !targetOrb.disabled) {
      // Click the orb
      targetOrb.click();
      clickCount++;
      sessionClicks++;
      clicksSinceIdle++;
      lastClickTime = Date.now();
      
      // Log progress with TPS info
      if (sessionClicks % 25 === 0) {
        console.log(`📊 ${sessionClicks}/${config.maxClicks} clicks (${currentTPS.toFixed(1)} TPS)`);
      }
      
      return true;
    } else {
      console.log(`❌ ${targetColor} orb not found or disabled`);
      return false;
    }
  }
  
  // Function to check if game is over
  function isGameOver() {
    const gameOverElements = document.querySelectorAll('h2, h3, div');
    for (let element of gameOverElements) {
      if (element.textContent && element.textContent.includes('Game Over')) {
        return true;
      }
    }
    
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.textContent && button.textContent.includes('Play Again')) {
        return true;
      }
    }
    
    return false;
  }
  
  // Function to start the game
  function startGame() {
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.textContent && button.textContent.includes('Play Reactor Mini-Game')) {
        button.click();
        console.log('🎮 Game started! Waiting for game to load...');
        gameStarted = true;
        return true;
      }
    }
    return false;
  }
  
  // Function to restart game
  function restartGame() {
    const buttons = document.querySelectorAll('button');
    for (let button of buttons) {
      if (button.textContent && button.textContent.includes('Play Again')) {
        button.click();
        console.log('🔄 Game restarted!');
        clickCount = 0;
        startTime = Date.now();
        sessionClicks = 0;
        clicksSinceIdle = 0;
        nextIdleThreshold = 0;
        gameStarted = true;
        return true;
      }
    }
    return false;
  }
  
  // Main clicking loop
  function clickLoop() {
    if (!isActive) return;
    
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    if (timeSinceLastClick > 0) {
      currentTPS = 1000 / timeSinceLastClick;
    }
    
    // Check if we've hit the click limit
    if (sessionClicks >= config.maxClicks) {
      console.log(`🛑 Click limit reached (${config.maxClicks}), pausing for ${config.pauseAfterLimit/1000}s...`);
      setTimeout(() => {
        if (isGameOver()) {
          restartGame();
        }
        setTimeout(clickLoop, config.restartDelay);
      }, config.pauseAfterLimit);
      return;
    }
    
    // Check if game is over
    if (isGameOver()) {
      console.log('🏁 Game over detected, attempting restart...');
      if (restartGame()) {
        setTimeout(clickLoop, config.restartDelay);
        return;
      } else {
        console.log('❌ Could not restart game');
        setTimeout(clickLoop, config.restartDelay);
        return;
      }
    }
    
    // Idle simulation: check if it's time for a random pause
    if (nextIdleThreshold === 0) {
      // Set the next random threshold if not already set
      nextIdleThreshold = Math.floor(Math.random() * (config.idleClickMax - config.idleClickMin + 1)) + config.idleClickMin;
    }
    
    if (clicksSinceIdle >= nextIdleThreshold) {
      const idleDelay = Math.floor(Math.random() * (config.idleDelayMax - config.idleDelayMin + 1)) + config.idleDelayMin;
      console.log(`⏳ Idle simulation: pausing for ${idleDelay}ms after ${clicksSinceIdle} clicks...`);
      clicksSinceIdle = 0;
      nextIdleThreshold = 0; // Reset for next cycle
      setTimeout(() => {
        clickCorrectOrb();
        setTimeout(clickLoop, calculateDelay());
      }, idleDelay);
      return;
    }
    
    // Try to click the correct orb
    clickCorrectOrb();
    
    // Calculate optimal delay for next click
    const delay = calculateDelay();
    setTimeout(clickLoop, delay);
  }
  
  // Toggle function
  function toggle() {
    if (isActive) {
      isActive = false;
      const duration = (Date.now() - startTime) / 1000;
      const avgTPS = clickCount / duration;
      
      alert(`🚀 Pi² 20 TPS Ultimate Auto-Clicker Stopped!
      
📊 Performance Stats:
• Total Clicks: ${clickCount}
• Session Clicks: ${sessionClicks}
• Duration: ${duration.toFixed(1)} seconds
• Average TPS: ${avgTPS.toFixed(1)}

🎯 Realism Features:
• Dynamic TPS curve: Starts at ${config.peakTPS} TPS, gradually decreases to ${config.minTPS} TPS.
• Micro-jitter: Delays vary by ±5ms.
• Idle simulation: Random pauses every ${config.idleClickMin}-${config.idleClickMax} clicks.
• Max Clicks: ${config.maxClicks} (${sessionClicks >= config.maxClicks ? 'REACHED' : 'OK'})`);
      
      console.log('⏹️ 20 TPS Ultimate auto-clicker stopped');
    } else {
      isActive = true;
      clickCount = 0;
      startTime = Date.now();
      lastClickTime = 0;
      sessionClicks = 0;
      clicksSinceIdle = 0;
      nextIdleThreshold = 0;
      gameStarted = false;
      
      console.log('▶️ 20 TPS Ultimate auto-clicker started');
      console.log('🎯 Strategy: Dynamic TPS curve (20 → 10 TPS) with realism features');
      
      // Start the game first
      if (startGame()) {
        setTimeout(clickLoop, config.gameStartDelay);
      } else {
        console.log('❌ Could not start game, trying to click anyway...');
        setTimeout(clickLoop, 1000);
      }
    }
  }
  
  // Check if we're on the right page
  const hasGameElements = document.querySelector('img[alt*="orb"]') || 
                         document.querySelector('img[alt*="Target"]') ||
                         document.querySelector('button')?.textContent?.includes('Play Reactor Mini-Game');
  
  if (hasGameElements) {
    console.log('✅ Pi² game detected, starting 20 TPS Ultimate auto-clicker...');
    console.log('🚀 Target: Realistic human-like performance');
    console.log('🎮 Auto-starting game and handling full flow');
    toggle(); // Auto-start
  } else {
    console.log('❌ Pi² game not detected');
    alert('🚀 Pi² 20 TPS Ultimate Auto-Clicker\n\n❌ Pi² game not detected on this page.\n\nPlease make sure you are on the Pi² reactor game page.');
  }
})();
