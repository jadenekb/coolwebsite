// Sound effects using Web Audio API to avoid external assets and CORS issues
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playTone(freq, type, duration, vol=0.1) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playPopSound() {
    playTone(800, 'sine', 0.1, 0.15);
}

function playSparkleSound() {
    const notes = [600, 800, 1000, 1200];
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'triangle', 0.2, 0.1), i * 100);
    });
}

function playCrackSound() {
    playTone(150, 'square', 0.15, 0.2);
}

function playFanfare() {
    const notes = [
        {f: 440, d: 0.15}, {f: 440, d: 0.15}, {f: 440, d: 0.15}, 
        {f: 554, d: 0.4}, {f: 440, d: 0.15}, {f: 659, d: 0.6}
    ];
    let time = 0;
    notes.forEach((note) => {
        setTimeout(() => playTone(note.f, 'square', note.d, 0.15), time * 1000);
        time += note.d + 0.05;
    });
}

function playNotification() {
    playTone(987.77, 'sine', 0.1, 0.15);
    setTimeout(() => playTone(1318.51, 'sine', 0.3, 0.15), 100);
}

function playHoverSound() {
    playTone(600, 'sine', 0.05, 0.05);
}

function playSqueak() {
    playTone(1200, 'sine', 0.1, 0.1);
}

function playWomp() {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

// SVG Templates for Duck States
const duckSideSVG = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet">
    <rect class="duck-body" x="4" y="2" width="8" height="6" />
    <rect class="duck-body" x="2" y="8" width="12" height="5" />
    <rect class="duck-wing" x="4" y="9" width="4" height="3" />
    <rect class="duck-eye" x="9" y="4" width="1" height="1" />
    <rect class="duck-beak" x="12" y="5" width="4" height="2" />
    <rect class="duck-foot" x="5" y="13" width="2" height="2" />
    <rect class="duck-foot" x="9" y="13" width="2" height="2" />
</svg>`;

const duckFrontSVG = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet">
    <rect class="duck-body" x="2" y="2" width="12" height="11" />
    <rect class="duck-wing" x="1" y="6" width="1" height="5" />
    <rect class="duck-wing" x="14" y="6" width="1" height="5" />
    <rect class="duck-eye" x="4" y="5" width="2" height="2" />
    <rect class="duck-eye" x="10" y="5" width="2" height="2" />
    <rect class="angry-brow" x="3" y="4" width="2" height="1" />
    <rect class="angry-brow" x="5" y="5" width="1" height="1" />
    <rect class="angry-brow" x="11" y="4" width="2" height="1" />
    <rect class="angry-brow" x="10" y="5" width="1" height="1" />
    <rect class="duck-beak" x="6" y="8" width="4" height="2" />
    <rect class="duck-beak" x="5" y="9" width="6" height="1" />
    <rect class="duck-foot" x="3" y="13" width="3" height="2" />
    <rect class="duck-foot" x="10" y="13" width="3" height="2" />
</svg>`;

const duckHappySVG = `<svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet">
    <rect class="duck-body" x="4" y="2" width="8" height="6" />
    <rect class="duck-body" x="2" y="8" width="12" height="5" />
    <rect class="duck-wing" x="3" y="6" width="4" height="4" /> 
    <rect class="duck-eye" x="8" y="4" width="1" height="1" />
    <rect class="duck-eye" x="9" y="3" width="2" height="1" />
    <rect class="duck-eye" x="11" y="4" width="1" height="1" />
    <rect class="duck-beak" x="12" y="5" width="4" height="2" />
    <rect class="duck-foot" x="5" y="13" width="2" height="2" />
    <rect class="duck-foot" x="9" y="13" width="2" height="2" />
</svg>`;

// Dom Elements
const slider = document.getElementById('cool-slider');
const sliderValueLabel = document.getElementById('slider-value');
const duckMain = document.getElementById('duck-main');

// Build Environment
const envContainer = document.createElement('div');
envContainer.id = 'environment-container';
document.body.insertBefore(envContainer, document.body.firstChild);

for(let i=0; i<4; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.top = (Math.random() * 20) + 'vh';
    cloud.style.transform = `scale(${0.5 + Math.random()*0.8})`;
    cloud.style.animationDelay = `-${Math.random()*20}s`;
    cloud.style.animationDuration = `${30 + Math.random()*30}s`;
    envContainer.appendChild(cloud);
}

for(let i=0; i<6; i++) {
    const tree = document.createElement('div');
    tree.className = 'tree';
    tree.style.left = (Math.random() * 95) + 'vw';
    tree.style.top = (5 + Math.random() * 35) + 'vh'; 
    tree.style.transform = `scale(${0.6 + Math.random()*0.6})`;
    envContainer.appendChild(tree);
}

const topRiverWrapper = document.createElement('div');
topRiverWrapper.className = 'river-wrapper';
topRiverWrapper.style.top = '10vh';
topRiverWrapper.style.height = '20vh';
envContainer.appendChild(topRiverWrapper);

const topRiverPond = document.createElement('div');
topRiverPond.className = 'pond';
topRiverWrapper.appendChild(topRiverPond);

const botRiverWrapper = document.createElement('div');
botRiverWrapper.className = 'river-wrapper';
botRiverWrapper.style.top = '75vh';
botRiverWrapper.style.height = '25vh';
envContainer.appendChild(botRiverWrapper);

const botRiverPond = document.createElement('div');
botRiverPond.className = 'pond';
botRiverWrapper.appendChild(botRiverPond);

const frogBody = document.createElement('div');
frogBody.className = 'frog';
frogBody.innerHTML = `
<svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%;">
    <rect class="frog-body" x="4" y="8" width="8" height="6" />
    <rect class="frog-eye" x="4" y="6" width="3" height="3" />
    <rect class="frog-eye" x="9" y="6" width="3" height="3" />
    <rect class="duck-eye" x="5" y="7" width="1" height="1" />
    <rect class="duck-eye" x="10" y="7" width="1" height="1" />
    <rect class="frog-leg" x="2" y="11" width="3" height="3" />
    <rect class="frog-leg" x="11" y="11" width="3" height="3" />
</svg>
`;
envContainer.appendChild(frogBody);

let frogIsHopping = false;
function hopFrogRandomly() {
    if (frogIsHopping) return;
    frogIsHopping = true;
    
    const newX = window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.8;
    const newY = window.innerHeight * 0.6 + Math.random() * window.innerHeight * 0.3; // near bottom river
    
    const currentX = parseFloat(frogBody.dataset.x || window.innerWidth/2);
    const scaleX = newX > currentX ? 1 : -1;
    
    frogBody.classList.add('frog-hopping');
    frogBody.style.transform = `translate(${newX}px, ${newY}px) scaleX(${scaleX})`;
    frogBody.dataset.x = newX;
    
    setTimeout(() => {
        frogBody.classList.remove('frog-hopping');
        frogIsHopping = false;
        setTimeout(hopFrogRandomly, 2000 + Math.random() * 4000);
    }, 500);
}
setTimeout(hopFrogRandomly, 1000);

// ====================================================
// PIXEL DOG ANIMALS INITIALIZATION & WANDERING
// ====================================================
const dogBody = document.createElement('div');
dogBody.className = 'dog dog-wagging';
dogBody.dataset.x = window.innerWidth / 3;
dogBody.style.transform = `translate(${window.innerWidth / 3}px, ${window.innerHeight * 0.7}px) scaleX(1)`;
dogBody.innerHTML = `
<svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%;">
    <rect class="dog-body" x="4" y="6" width="8" height="5" />
    <rect class="dog-neck-head" x="9" y="3" width="4" height="4" />
    <rect class="dog-snout" x="12" y="5" width="2" height="2" />
    <rect class="dog-nose" x="13" y="5" width="1" height="1" fill="#000" />
    <rect class="dog-ear" x="8" y="2" width="2" height="3" />
    <rect class="dog-eye" x="10" y="4" width="1" height="1" fill="#000" />
    <rect class="dog-leg" x="5" y="11" width="2" height="3" />
    <rect class="dog-leg" x="9" y="11" width="2" height="3" />
    <rect class="dog-tail" x="2" y="5" width="2" height="2" />
</svg>
`;
envContainer.appendChild(dogBody);

let dogIsWalking = false;
function walkDogRandomly() {
    if (dogIsWalking) return;
    dogIsWalking = true;
    
    const newX = window.innerWidth * 0.05 + Math.random() * window.innerWidth * 0.9;
    const newY = window.innerHeight * 0.65 + Math.random() * window.innerHeight * 0.25;
    
    const currentX = parseFloat(dogBody.dataset.x || window.innerWidth/3);
    const scaleX = newX > currentX ? 1 : -1;
    
    dogBody.classList.add('dog-walking-anim');
    
    const dist = Math.abs(newX - currentX);
    const duration = Math.max(500, dist * 3.5); // time based on distance
    
    dogBody.style.transition = `transform ${duration}ms linear`;
    dogBody.style.transform = `translate(${newX}px, ${newY}px) scaleX(${scaleX})`;
    dogBody.dataset.x = newX;
    
    setTimeout(() => {
        dogBody.classList.remove('dog-walking-anim');
        dogIsWalking = false;
        
        // Occasionally bark with woodblock sound synthesis and visual speech bubble!
        if (Math.random() > 0.5) {
            triggerDogBark(newX, newY);
        }
        
        setTimeout(walkDogRandomly, 2500 + Math.random() * 4000);
    }, duration);
}

function triggerDogBark(x, y) {
    // bark tone synthetics
    playTone(320, 'triangle', 0.12, 0.08); 
    setTimeout(() => playTone(270, 'triangle', 0.1, 0.06), 40);
    
    const bubble = document.createElement('div');
    bubble.className = 'bark-bubble';
    bubble.innerText = 'Woof! 🐾';
    bubble.style.left = (x + 20) + 'px';
    bubble.style.top = (y - 20) + 'px';
    
    // Append to document body to avoid z-index layout clipping
    document.body.appendChild(bubble);
    
    setTimeout(() => {
        bubble.remove();
    }, 1200);
}

setTimeout(walkDogRandomly, 2000);

let duckVisual = document.getElementById('duck-visual');
if (!duckVisual && duckMain) {
    duckVisual = document.createElement('div');
    duckVisual.id = 'duck-visual';
    duckVisual.className = 'duck-visual';
    while(duckMain.firstChild) {
        duckVisual.appendChild(duckMain.firstChild);
    }
    duckMain.appendChild(duckVisual);
}

const particleContainer = document.getElementById('particle-container');
const nextBtn = document.getElementById('next-btn');

let blockThrowInterval;
let duckState = '';
let lastSliderVal = 5;

// Wandering Logic
let isWandering = false;
let wanderTimeout;

function startWandering() {
    // Only dispatch if coming from a non-wandering state
    if (!isWandering) {
        isWandering = true;
        wanderRandomly();
    }
}

function stopWandering(faceForward = false, returnToCenter = false) {
    isWandering = false;
    clearTimeout(wanderTimeout);
    
    duckVisual.classList.remove('duck-walking');
    duckMain.style.transition = 'transform 0.3s ease';
    
    let currentX = parseFloat(duckMain.dataset.x || 0);
    let currentY = parseFloat(duckMain.dataset.y || 0);
    
    if (returnToCenter) {
        currentX = 0;
        currentY = 0;
        duckMain.dataset.x = 0;
        duckMain.dataset.y = 0;
    }
    
    if (faceForward) {
        duckMain.style.transform = `translate(${currentX}px, ${currentY}px) scaleX(1)`;
    } else {
        duckMain.style.transform = `translate(${currentX}px, ${currentY}px) scaleX(1)`;
    }
}

function wanderRandomly() {
    if (!isWandering) return;
    
    duckVisual.classList.add('duck-walking');
    
    const maxX = window.innerWidth / 2 - 80;
    const maxY = window.innerHeight / 2 - 80;
    
    const newX = (Math.random() - 0.5) * 2 * maxX;
    const newY = (Math.random() - 0.5) * 2 * maxY - 60; 

    const currentX = parseFloat(duckMain.dataset.x || 0);
    const currentY = parseFloat(duckMain.dataset.y || 0);

    const facingRight = newX > currentX;
    const scaleX = facingRight ? 1 : -1;

    const dist = Math.hypot(newX - currentX, newY - currentY);
    const duration = dist * 20; 
    
    duckMain.style.transition = `transform ${duration}ms linear`;
    duckMain.style.transform = `translate(${newX}px, ${newY}px) scaleX(${scaleX})`;
    duckMain.dataset.x = newX;
    duckMain.dataset.y = newY;

    wanderTimeout = setTimeout(() => {
        if (!isWandering) return;
        
        duckVisual.classList.remove('duck-walking');
        duckMain.style.transform = `translate(${newX}px, ${newY}px) scaleX(${scaleX})`;
        
        const pauseTime = 800 + Math.random() * 2000;
        
        if(Math.random() > 0.5) {
            setTimeout(() => {
                if(!isWandering) return;
                duckMain.style.transform = `translate(${newX}px, ${newY}px) scaleX(${-scaleX})`;
            }, pauseTime / 2);
        }
        
        wanderTimeout = setTimeout(wanderRandomly, pauseTime);
    }, duration);
}

// Check Interactions Continuously
let lastSplashTime = 0;
function checkInteractionsLoop() {
    if (duckState === 'neutral' && isWandering) {
        const duckRect = duckMain.getBoundingClientRect();
        const duckCX = duckRect.left + duckRect.width / 2;
        // Use the lower part of the duck for collision logic, to represent feet/body
        const duckFloorY = duckRect.top + duckRect.height * 0.75;
        
        const cardRect = document.querySelector('.card').getBoundingClientRect();
        let onCard = (duckCX > cardRect.left && duckCX < cardRect.right && duckFloorY > cardRect.top && duckFloorY < cardRect.bottom);
        
        let inWater = false;
        if (!onCard) {
            document.querySelectorAll('.river-wrapper').forEach(river => {
                const pRect = river.getBoundingClientRect();
                if (duckCX > pRect.left && duckCX < pRect.right && duckFloorY > pRect.top && duckFloorY < pRect.bottom) {
                    inWater = true;
                }
            });
        }

        if (inWater) {
            duckVisual.classList.add('duck-swimming');
            duckVisual.classList.remove('duck-walking');
            
            const now = Date.now();
            if (now - lastSplashTime > 300) {
                createSplash(duckCX, duckRect.bottom - 10);
                lastSplashTime = now;
            }
        } else {
            duckVisual.classList.remove('duck-swimming');
            // Retain walking if it is wandering
            duckVisual.classList.add('duck-walking');
        }
    }
    requestAnimationFrame(checkInteractionsLoop);
}
requestAnimationFrame(checkInteractionsLoop);

function createSplash(x, y) {
    const splash = document.createElement('div');
    splash.className = 'splash';
    splash.style.left = (x + (Math.random()-0.5)*20) + 'px';
    splash.style.top = y + 'px';
    particleContainer.appendChild(splash);
    setTimeout(() => splash.remove(), 400);
}



slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    sliderValueLabel.innerText = val;
    
    if (val !== lastSliderVal) {
        playPopSound();
        lastSliderVal = val;
    }
    
    if (val >= 1 && val <= 4) {
        setDuckState('angry');
        nextBtn.classList.add('hidden');
    } else if (val >= 5 && val <= 9) {
        setDuckState('neutral');
        nextBtn.classList.add('hidden');
    } else if (val === 10) {
        if(duckState !== 'happy') playSparkleSound();
        setDuckState('happy');
        nextBtn.classList.remove('hidden');
    }
});

function setDuckState(state) {
    if (duckState === state) return;
    clearInterval(blockThrowInterval);
    duckState = state;
    
    const keepLocked = document.body.classList.contains('locked');
    const keepUnlocked = document.body.classList.contains('unlocked');
    const keepBash = document.body.classList.contains('bash-open');
    document.body.className = '';
    if (keepLocked) document.body.classList.add('locked');
    if (keepUnlocked) document.body.classList.add('unlocked');
    if (keepBash) document.body.classList.add('bash-open');
    
    if (state === 'angry') {
        stopWandering(true, false);
        document.body.classList.add('angry-bg');
        
        duckVisual.innerHTML = duckFrontSVG;
        duckVisual.className = 'duck-staring';
        startThrowingBlocks();
        
    } else if (state === 'neutral') {
        document.body.classList.remove('angry-bg', 'happy-bg');
        
        duckVisual.innerHTML = duckSideSVG;
        duckVisual.className = ''; 
        startWandering();
        particleContainer.innerHTML = '';
        
    } else if (state === 'happy') {
        // Return to center immediately
        stopWandering(true, true);
        document.body.classList.add('happy-bg');
        
        duckVisual.innerHTML = duckHappySVG;
        duckVisual.className = 'duck-super-happy';
        startFallingPetals();
        particleContainer.innerHTML = ''; 
    }
}

function startThrowingBlocks() {
    blockThrowInterval = setInterval(() => {
        const block = document.createElement('div');
        block.className = 'block-thrown';
        
        const duckRect = duckMain.getBoundingClientRect();
        
        const startX = duckRect.left + duckRect.width / 2;
        const startY = duckRect.top + duckRect.height / 2;
        
        // Aim at the user (center of the screen) with some spread
        const endX = window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.4;
        const endY = window.innerHeight / 2 + (Math.random() - 0.5) * window.innerHeight * 0.4;
        
        block.style.left = startX + 'px';
        block.style.top = startY + 'px';
        
        particleContainer.appendChild(block);
        
        block.animate([
            { transform: `translate(0, 0) scale(1) rotate(0deg)` },
            { transform: `translate(${(endX - startX)*0.5}px, ${(endY - startY)*0.5 - 50}px) scale(4) rotate(180deg)` },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(10) rotate(360deg)` }
        ], {
            duration: 800,
            easing: 'ease-in'
        }).onfinish = () => {
            block.remove();
            createBigCrack(endX, endY);
            playCrackSound();
        };
        
    }, 700);
}

function createCrack(x, y) {
    // Normal crack, just for fallback
    const crack = document.createElement('div');
    crack.className = 'crack';
    crack.style.left = (x - 15) + 'px'; 
    crack.style.top = (y - 15) + 'px';
    particleContainer.appendChild(crack);
    
    setTimeout(() => {
        crack.style.transition = 'opacity 0.5s';
        crack.style.opacity = '0';
        setTimeout(() => crack.remove(), 500);
    }, 1500);
}

const shatterTemplates = [
    `<path d="M50 50 L20 10 M50 50 L10 40 M50 50 L30 80 M50 50 L80 90 M50 50 L90 30 M20 10 L40 0 M30 80 L10 100 M80 90 L100 70 M90 30 L100 10" stroke="white" stroke-width="1.5" fill="none" opacity="0.9" />
     <path d="M50 50 L25 15 M50 50 L15 45 M50 50 L35 75 M50 50 L75 85 M50 50 L85 35" stroke="rgba(0,0,0,0.5)" stroke-width="2" fill="none" opacity="0.6" />
     <circle cx="50" cy="50" r="4" fill="white" opacity="0.8" />
     <circle cx="50" cy="50" r="6" fill="rgba(0,0,0,0.5)" opacity="0.5" />`,
     
    `<path d="M50 50 L10 20 L0 10 M50 50 L20 90 L10 100 M50 50 L80 100 L90 90 M50 50 L90 10 L100 0 L40 30 L20 10" stroke="white" stroke-width="1" fill="none" opacity="0.9" />
     <path d="M50 50 L12 22 M50 50 L22 92 M50 50 L82 102 M50 50 L92 12" stroke="rgba(0,0,0,0.5)" stroke-width="3" fill="none" opacity="0.4" />`
];

function createBigCrack(x, y) {
    const size = 150 + Math.random() * 250; 
    const crack = document.createElement('div');
    crack.className = 'glass-shatter';
    crack.style.left = (x - size/2) + 'px';
    crack.style.top = (y - size/2) + 'px';
    crack.style.width = size + 'px';
    crack.style.height = size + 'px';
    
    const rot = Math.random() * 360;
    
    crack.innerHTML = `
        <svg viewBox="0 0 100 100" style="width:100%; height:100%; overflow:visible;">
            ${shatterTemplates[Math.floor(Math.random() * shatterTemplates.length)]}
        </svg>
    `;
    
    particleContainer.appendChild(crack);
    
    crack.animate([
        { transform: `rotate(${rot}deg) scale(0.1)`, opacity: 0 },
        { transform: `rotate(${rot}deg) scale(1.1)`, opacity: 1 },
        { transform: `rotate(${rot}deg) scale(1)`, opacity: 1 }
    ], {
        duration: 150,
        easing: 'ease-out'
    }).onfinish = () => {
        crack.style.transform = `rotate(${rot}deg) scale(1)`; 
    };
}

function startFallingPetals() {
    for(let i=0; i<40; i++) {
        setTimeout(createPetal, i * 150);
    }
}

function createPetal() {
    if (duckState !== 'happy') return;
    
    const petal = document.createElement('div');
    petal.className = 'falling-petal';
    
    const size = 10 + Math.random() * 10;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = Math.random() * 100 + 'vw';
    
    const duration = 2 + Math.random() * 4;
    petal.style.animationDuration = duration + 's';
    
    particleContainer.appendChild(petal);
    
    setTimeout(() => {
        petal.remove();
        if (duckState === 'happy') createPetal(); 
    }, duration * 1000);
}

// ----------------------------------------------------
// PAGE 2 LOGIC
// ----------------------------------------------------

nextBtn.addEventListener('click', () => {
    playSparkleSound();
    document.getElementById('screen-1').classList.remove('show');
    document.getElementById('screen-1').classList.add('hide');
    
    document.body.classList.remove('angry-bg', 'starry-bg');
    document.body.classList.add('happy-bg');
    
    setTimeout(() => {
        document.getElementById('screen-2').classList.remove('hide');
        document.getElementById('screen-2').classList.add('show');
        
        const s2Duck = document.querySelector('#screen-2 .duck-container');
        if (s2Duck) {
            s2Duck.innerHTML = `<div class="duck-super-happy" style="width: 100%; height: 100%;">${duckHappySVG}</div>`;
        }
        
        particleContainer.innerHTML = ''; 
    }, 800);
});

const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const finalMessage = document.getElementById('final-message');

noBtn.addEventListener('mouseover', function() {
    if (!this.classList.contains('running-btn')) {
        this.classList.add('running-btn');
        const rect = this.getBoundingClientRect();
        this.style.left = rect.left + 'px';
        this.style.top = rect.top + 'px';
    }
    
    const maxX = window.innerWidth - this.offsetWidth - 20;
    const maxY = window.innerHeight - this.offsetHeight - 20;
    
    const randomX = Math.max(20, Math.floor(Math.random() * maxX));
    const randomY = Math.max(20, Math.floor(Math.random() * maxY));
    
    this.style.left = randomX + 'px';
    this.style.top = randomY + 'px';
    
    const randomRotation = (Math.random() - 0.5) * 60; 
    this.style.transform = `rotate(${randomRotation}deg)`;
    
    playSqueak(); 
});

yesBtn.addEventListener('click', () => {
    noBtn.style.display = 'none';
    finalMessage.classList.remove('hidden');
    playSparkleSound();
    
    for (let i = 0; i < 60; i++) {
        setTimeout(createFloatingHeart, i * 60);
    }
});

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = '💖';
    
    const startX = window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.8;
    const startY = window.innerHeight + 50;
    
    heart.style.left = startX + 'px';
    heart.style.top = startY + 'px';
    
    const size = 15 + Math.random() * 30;
    heart.style.fontSize = size + 'px';
    
    const duration = 1.5 + Math.random() * 2;
    heart.style.animation = `floatUp ${duration}s ease-out forwards`;
    
    particleContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Init Duck State
setDuckState('neutral');

// PAGE 2 MENU LOGIC
const menuBtn = document.getElementById('menu-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const journeyOption = document.getElementById('journey-option');
const journeyModal = document.getElementById('journey-modal');
const closeModal = document.getElementById('close-modal');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
        playPopSound();
    });

    journeyOption.addEventListener('click', () => {
        dropdownMenu.classList.add('hidden');
        calculateJourney();
        journeyModal.classList.remove('hidden');
        playSparkleSound();
    });

    closeModal.addEventListener('click', () => {
        journeyModal.classList.add('hidden');
        playPopSound();
    });
}

function calculateJourney() {
    const start = new Date('2023-12-16T00:00:00');
    const now = new Date();
    
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    
    if (days < 0) {
        months--;
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const tYears = document.getElementById('t-years');
    const tMonths = document.getElementById('t-months');
    const tDays = document.getElementById('t-days');
    if (tYears) tYears.innerText = years;
    if (tMonths) tMonths.innerText = months;
    if (tDays) tDays.innerText = days;
}

// Hover sounds for buttons and menu items
document.querySelectorAll('.pixel-btn, .dropdown-menu li').forEach(el => {
    el.addEventListener('mouseenter', playHoverSound);
});

// DATE MODAL LOGIC
const dateOption = document.getElementById('date-invite-option');
const dateModal = document.getElementById('date-modal');
const closeDateModal = document.getElementById('close-date-modal');
const acceptDateBtn = document.getElementById('accept-date-btn');
const declineDateBtn = document.getElementById('decline-date-btn');
const dateSuccessMessage = document.getElementById('date-success-message');

if (dateOption) {
    dateOption.addEventListener('click', () => {
        dropdownMenu.classList.add('hidden');
        dateModal.classList.remove('hidden');
        playNotification();
        
        // Reset scroll and button states for fresh reading!
        const inviteScroll = document.getElementById('invite-scroll-container');
        const dButtons = document.getElementById('date-buttons');
        if (inviteScroll) {
            inviteScroll.scrollTop = 0;
            inviteScroll.classList.remove('hidden');
        }
        if (dButtons) {
            dButtons.classList.add('hidden');
            dButtons.classList.remove('show-buttons');
        }
        if (dateSuccessMessage) {
            dateSuccessMessage.classList.add('hidden');
        }
        if (acceptDateBtn) acceptDateBtn.style.display = 'inline-block';
        if (declineDateBtn) {
            declineDateBtn.style.display = 'inline-block';
            declineDateBtn.style.position = 'static'; // reset position
            declineDateBtn.classList.remove('running-btn');
            declineDateBtn.style.transform = 'none';
        }
    });
}

if (closeDateModal) {
    closeDateModal.addEventListener('click', () => {
        dateModal.classList.add('hidden');
        playPopSound();
    });
}

// Scroll bottom detection logic to reveal option buttons
const inviteScrollContainer = document.getElementById('invite-scroll-container');
const dateButtons = document.getElementById('date-buttons');

if (inviteScrollContainer && dateButtons) {
    inviteScrollContainer.addEventListener('scroll', () => {
        const threshold = 10; // px near bottom
        const isAtBottom = inviteScrollContainer.scrollHeight - inviteScrollContainer.scrollTop - inviteScrollContainer.clientHeight <= threshold;
        
        if (isAtBottom && dateButtons.classList.contains('hidden')) {
            dateButtons.classList.remove('hidden');
            setTimeout(() => {
                dateButtons.classList.add('show-buttons');
                playSparkleSound(); // Play nice retro tone on unlock
            }, 50);
        }
    });
}

if (declineDateBtn) {
    declineDateBtn.addEventListener('mouseover', function() {
        if (!this.classList.contains('running-btn')) {
            this.classList.add('running-btn');
            const rect = this.getBoundingClientRect();
            this.style.left = rect.left + 'px';
            this.style.top = rect.top + 'px';
        }
        
        const maxX = window.innerWidth - this.offsetWidth - 20;
        const maxY = window.innerHeight - this.offsetHeight - 20;
        
        const randomX = Math.max(20, Math.floor(Math.random() * maxX));
        const randomY = Math.max(20, Math.floor(Math.random() * maxY));
        
        this.style.left = randomX + 'px';
        this.style.top = randomY + 'px';
        
        const randomRotation = (Math.random() - 0.5) * 60; 
        this.style.transform = `rotate(${randomRotation}deg)`;
        
        playWomp(); 
    });
}

if (acceptDateBtn) {
    acceptDateBtn.addEventListener('click', () => {
        declineDateBtn.style.display = 'none';
        acceptDateBtn.style.display = 'none';
        
        // Hide invitation scroll container to cleanly present the witty success letter
        const inviteScroll = document.getElementById('invite-scroll-container');
        if (inviteScroll) inviteScroll.classList.add('hidden');
        
        dateSuccessMessage.classList.remove('hidden');
        
        playFanfare();
        
        document.body.classList.add('starry-bg');
        document.body.classList.remove('happy-bg', 'angry-bg');
        
        // Launch fireworks
        let fwInterval = setInterval(() => {
            createFirework();
        }, 150);
        setTimeout(() => clearInterval(fwInterval), 3000); // 3 seconds of fireworks
        
        // Add stars to environment
        for (let i = 0; i < 50; i++) {
            createStar();
        }
    });
}

// ----------------------------------------------------
// PASSWORD LOGIN SCREEN OVERLAY LOGIC
// ----------------------------------------------------
const welcomeOverlay = document.getElementById('welcome-overlay');
const welcomeEnter = document.getElementById('welcome-enter');
const welcomeBash = document.getElementById('welcome-bash');
const gatePanel = document.getElementById('gate-panel');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

function revealSite(openBash) {
    document.body.classList.remove('locked');
    document.body.classList.add('unlocked');
    if (welcomeOverlay) welcomeOverlay.classList.add('hidden');
    playNotification();
    if (openBash) openBirthdayBash();
}

function attemptLogin() {
    const enteredPassword = passwordInput.value.trim();
    if (enteredPassword === 'december162023') {
        playSparkleSound();
        if (gatePanel) gatePanel.classList.add('hidden');
        if (welcomeOverlay) welcomeOverlay.classList.remove('hidden');
    } else {
        playWomp();
        loginError.classList.remove('hidden');
        if (gatePanel) {
            gatePanel.classList.add('card-shake');
            passwordInput.select();
            setTimeout(() => {
                gatePanel.classList.remove('card-shake');
            }, 450);
        }
    }
}

if (loginBtn && passwordInput) {
    loginBtn.addEventListener('click', attemptLogin);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });
    
    // Add hover sounds for login button
    loginBtn.addEventListener('mouseenter', playHoverSound);
}

if (welcomeEnter) {
    welcomeEnter.addEventListener('click', () => revealSite(false));
    welcomeEnter.addEventListener('mouseenter', playHoverSound);
}
if (welcomeBash) {
    welcomeBash.addEventListener('click', () => revealSite(true));
    welcomeBash.addEventListener('mouseenter', playHoverSound);
}

// ----------------------------------------------------
// BIRTHDAY BASH — countdown to 26 November 2026
// ----------------------------------------------------
const BIRTHDAY = new Date(2026, 10, 26, 0, 0, 0, 0);
const bashScreen = document.getElementById('screen-bash');
const bashLauncher = document.getElementById('bash-launcher');
const bashBack = document.getElementById('bash-back');
const bashOption = document.getElementById('bash-option');
const bashConfetti = document.getElementById('bash-confetti');
const bashStatus = document.getElementById('bash-status');
const bashCountdown = document.getElementById('bash-countdown');
const bashArrived = document.getElementById('bash-arrived');

let confettiTimer = null;
let birthdayCelebrated = false;

function padTime(n) {
    return String(n).padStart(2, '0');
}

function updateBirthdayCountdown() {
    const diff = BIRTHDAY.getTime() - Date.now();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    if (!daysEl) return;

    if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        if (bashStatus) bashStatus.textContent = 'The day is here';
        if (bashCountdown) bashCountdown.classList.add('hidden');
        if (bashArrived) bashArrived.classList.remove('hidden');
        if (!birthdayCelebrated) {
            birthdayCelebrated = true;
            playFanfare();
            let fwInterval = setInterval(createFirework, 180);
            setTimeout(() => clearInterval(fwInterval), 4000);
        }
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = padTime(days);
    hoursEl.textContent = padTime(hours);
    minsEl.textContent = padTime(mins);
    secsEl.textContent = padTime(secs);
}

function spawnConfettiPiece() {
    if (!bashConfetti || !document.body.classList.contains('bash-open')) return;
    const piece = document.createElement('span');
    const colors = ['#e84393', '#f6c945', '#ffffff', '#ff8fab', '#c77dff', '#ff6b6b'];
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (3 + Math.random() * 3) + 's';
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    bashConfetti.appendChild(piece);
    setTimeout(() => piece.remove(), 6500);
}

function openBirthdayBash() {
    if (!bashScreen || !document.body.classList.contains('unlocked')) return;
    bashScreen.classList.remove('hide');
    bashScreen.classList.add('show');
    document.body.classList.add('bash-open');
    if (dropdownMenu) dropdownMenu.classList.add('hidden');
    if (window.location.hash !== '#bash') {
        history.pushState({ bash: true }, '', '#bash');
    }
    updateBirthdayCountdown();
    if (!confettiTimer) {
        confettiTimer = setInterval(spawnConfettiPiece, 180);
    }
    playSparkleSound();
}

const DECREES = {
    memories: {
        kicker: 'For the twenty-sixth of November',
        title: 'Six-and-Twenty Remembrances',
        html: `
            <p class="paragraph">Here be six-and-twenty small rites, one for every year of thee, to make thy natal day a kingdom and not a mere date upon a calendar.</p>
            ${[
                'Ere thou wakest, a letter shall wait, written by hand as in the elder days.',
                'Thy favoured sweet shall be set forth, as tribute before a queen.',
                'I shall sing to thee, though the tune wander, for love need not be clever.',
                'We shall walk with no errand, and speak of nothing and of everything.',
                'I shall tell again the eve of December the sixteenth, when our tale began.',
                'Flowers, not a great heap, but chosen as if each petal knew thy name.',
                'A feast of whatsoever thou lovest best, though the board be a small one.',
                'FaceTime shall be charged to the brim, that distance may not dim thy face.',
                'We shall dance in the kitchen, clumsy and glad, with no audience but the spoons.',
                'I shall say thy name slowly, Sharon, as one might speak a charm.',
                'I shall give thee back the sound of thy laugh, and tell thee why I keep it.',
                'Candles, six-and-twenty, if the cake will bear so bright a crown.',
                'A promise I once made in passing shall be kept before the sun goeth down.',
                'I shall ask what thou wouldst have of this new year of thy life, and listen.',
                'Old pictures of us shall be brought out and looked upon together.',
                'A foolish gift, worth little coin and much intention.',
                'Thou shalt be suffered to sleep late, and the morning shall be guarded for thee.',
                'A toast, in whatever cup we have, lifted to the day thou camest into the world.',
                'One thing I have never said aloud shall be said, and not taken back.',
                'We shall find a star, or the nearest window that keepeth them.',
                'Thy favourite tale shall be told again, even if thou knowest every word.',
                'I shall hold thy hand and be quiet, which is a rarer gift than speeches.',
                'A paper crown, for on this day thou art sovereign of the house.',
                'Thanks shall be given for the year that carried thee to six-and-twenty.',
                'A wish shall be spoken over the candle before the flame is put out.',
                'The night shall be left wholly thine, with no hurry hiding in it.'
            ].map((line, i) => `
                <div class="memory-item">
                    <span class="memory-num">${String(i + 1).padStart(2, '0')}</span>
                    <p>${line}</p>
                </div>
            `).join('')}
        `
    },
    epistle: {
        kicker: 'Written for Lady Sharon',
        title: 'A Natal Epistle',
        html: `
            <p class="paragraph">Unto the fair and well-beloved Sharon, on the eve of her six-and-twentieth year, greeting.</p>
            <p class="paragraph">Know, sweet lady, that since the sixteenth of December in the year two thousand and twenty-three, my days have kept a secret calendar whose only feast is thee. Other folk count years by winters. I count them by the times thou hast laughed, and by the times the world grew kinder because thou wert in it.</p>
            <p class="paragraph">On the twenty-sixth of November the sun, if it hath any courtesy, ought to rise a little later, that thou mayest meet it crowned and unhurried. I have no realm to lay at thy feet save this small glowing kingdom of pixels and promises, yet it is thine as wholly as my better hours are thine.</p>
            <p class="paragraph">If I could command the clock, I should bid it pause upon thy birthday and refuse every lesser appointment. Since I cannot, I shall do the next best thing: I shall be present, foolish, faithful, and glad.</p>
            <p class="paragraph">So take this day, Sharon. Wear it. Spill cake upon it. Let it be easy. And when the candles fail, know the wish was already granted on the day I first knew thy name.</p>
            <p class="paragraph" style="text-align:right">Thine, in old fashion and present tense,<br>thy loving fool</p>
        `
    },
    revels: {
        kicker: 'The programme of the day',
        title: 'The Order of Revels',
        html: `
            <p class="paragraph">Let the twenty-sixth of November proceed in this gentle order, unless the lady commandeth otherwise, for her word outranketh the schedule.</p>
            <div class="revel-row"><strong>Dawn</strong><p>A letter, a slow waking, and no task that dare knock before thou art ready.</p></div>
            <div class="revel-row"><strong>Morning</strong><p>Sweet things, a paper crown, and the retelling of December the sixteenth.</p></div>
            <div class="revel-row"><strong>Midday</strong><p>A walk or a feast, chosen by thee, with the hours left loose on purpose.</p></div>
            <div class="revel-row"><strong>Afternoon</strong><p>Pictures, a foolish gift, and one true thing spoken that was kept too long.</p></div>
            <div class="revel-row"><strong>Evening</strong><p>FaceTime lit and charged, music, a kitchen dance, and six-and-twenty candles if the cake consenteth.</p></div>
            <div class="revel-row"><strong>Night</strong><p>A toast, a star, a wish, and the rest of the dark left quiet for thee.</p></div>
        `
    },
    vows: {
        kicker: 'Sworn without a notary',
        title: 'Vows Unto Thee',
        html: `
            <p class="paragraph">These I promise thee, not for a single birthday only, but beginning there.</p>
            <p class="vow-item">I. I shall remember the small things thou sayest, and not only the grand ones.</p>
            <p class="vow-item">II. I shall keep our beginning, the sixteenth of December, as a holy ordinary day.</p>
            <p class="vow-item">III. I shall make thee room to be soft, silly, tired, or splendid, as the hour requireth.</p>
            <p class="vow-item">IV. I shall choose thee again on ordinary Tuesdays, when no candle is lit.</p>
            <p class="vow-item">V. I shall bring thee six-and-twenty kindnesses, and then begin the count anew.</p>
            <p class="vow-item">VI. I shall not let the miles, nor a dim screen, nor a busy week, speak louder than thy name.</p>
        `
    },
    blessing: {
        kicker: 'To be sealed with a kiss of the button',
        title: 'A Blessing',
        html: `
            <p class="paragraph">May the twenty-sixth of November find thee warm, unhurried, and a little spoiled.</p>
            <p class="paragraph">May thy cake rise, thy laughter arrive early, and every good wish thou art too modest to make come true behind thy back.</p>
            <p class="paragraph">May the year that maketh thee six-and-twenty be gentler than the last, and braver where thou needest courage, and full of ordinary afternoons that turn out to have been the best part.</p>
            <p class="paragraph">And mayest thou, Sharon, know thyself loved without having to earn the hour.</p>
            <button id="seal-blessing" class="pixel-btn pink-btn seal-btn" type="button">Seal this blessing</button>
        `
    }
};

function closeDecrees() {
    const menu = document.getElementById('bash-dropdown');
    const modal = document.getElementById('decree-modal');
    if (menu) menu.classList.add('hidden');
    if (modal) modal.classList.add('hidden');
}

function openDecree(name) {
    const decree = DECREES[name];
    const modal = document.getElementById('decree-modal');
    if (!decree || !modal) return;
    document.getElementById('decree-kicker').textContent = decree.kicker;
    document.getElementById('decree-title').textContent = decree.title;
    document.getElementById('decree-body').innerHTML = decree.html;
    document.getElementById('bash-dropdown').classList.add('hidden');
    modal.classList.remove('hidden');
    const scroll = document.getElementById('decree-body');
    if (scroll) scroll.scrollTop = 0;
    playNotification();
}

function closeBirthdayBash() {
    if (!bashScreen) return;
    closeDecrees();
    bashScreen.classList.add('hide');
    bashScreen.classList.remove('show');
    document.body.classList.remove('bash-open');
    if (confettiTimer) {
        clearInterval(confettiTimer);
        confettiTimer = null;
    }
    if (bashConfetti) bashConfetti.innerHTML = '';
    if (window.location.hash === '#bash') {
        history.pushState({ bash: false }, '', window.location.pathname + window.location.search);
    }
    playPopSound();
}

if (bashLauncher) {
    bashLauncher.addEventListener('click', openBirthdayBash);
    bashLauncher.addEventListener('mouseenter', playHoverSound);
}
if (bashBack) {
    bashBack.addEventListener('click', closeBirthdayBash);
    bashBack.addEventListener('mouseenter', playHoverSound);
}
if (bashOption) {
    bashOption.addEventListener('click', openBirthdayBash);
}

const bashMenuBtn = document.getElementById('bash-menu-btn');
const bashDropdown = document.getElementById('bash-dropdown');
const decreeModal = document.getElementById('decree-modal');
const decreeClose = document.getElementById('decree-close');
const decreeBody = document.getElementById('decree-body');

if (bashMenuBtn && bashDropdown) {
    bashMenuBtn.addEventListener('click', () => {
        bashDropdown.classList.toggle('hidden');
        playPopSound();
    });
    bashMenuBtn.addEventListener('mouseenter', playHoverSound);
    bashDropdown.querySelectorAll('li').forEach((item) => {
        item.addEventListener('click', () => openDecree(item.dataset.decree));
        item.addEventListener('mouseenter', playHoverSound);
    });
}

if (decreeClose) {
    decreeClose.addEventListener('click', () => {
        decreeModal.classList.add('hidden');
        playPopSound();
    });
}

if (decreeBody) {
    decreeBody.addEventListener('click', (event) => {
        const seal = event.target.closest('#seal-blessing');
        if (!seal || seal.disabled) return;
        seal.disabled = true;
        seal.textContent = 'Sealed';
        const done = document.createElement('p');
        done.className = 'seal-done';
        done.textContent = 'So may it be, Sharon.';
        seal.insertAdjacentElement('afterend', done);
        playFanfare();
        for (let i = 0; i < 24; i++) setTimeout(createFloatingHeart, i * 70);
    });
}

window.addEventListener('hashchange', () => {
    if (window.location.hash === '#bash') openBirthdayBash();
    else if (document.body.classList.contains('bash-open')) closeBirthdayBash();
});

updateBirthdayCountdown();
setInterval(updateBirthdayCountdown, 1000);

function createFirework() {
    const fw = document.createElement('div');
    fw.className = 'firework';
    fw.style.left = (Math.random() * 80 + 10) + 'vw';
    fw.style.top = (Math.random() * 80 + 10) + 'vh';
    
    const colors = ['#ff6699', '#fcd34d', '#4ade80', '#60a5fa', '#c084fc', '#ffffff'];
    fw.style.color = colors[Math.floor(Math.random() * colors.length)];
    fw.style.backgroundColor = 'currentColor';
    
    particleContainer.appendChild(fw);
    
    setTimeout(() => {
        fw.remove();
    }, 1000);
}

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    
    const size = Math.random() * 4 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    star.style.animationDelay = (Math.random() * 2) + 's';
    
    envContainer.appendChild(star);
}
