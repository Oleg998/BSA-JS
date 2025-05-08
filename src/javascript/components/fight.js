import controls from '../../constants/controls';
import showWinnerModal from './modal/winner';

const maxChance = 2;
const minChance = 1;

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() * (maxChance - minChance) + minChance;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() * (maxChance - minChance) + minChance;
    return fighter.defense * dodgeChance;
}
export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = hitPower - blockPower;
    return damage > 0 ? damage : 0;
}

function triggerHitEffect(position, hit) {
    const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
    const fighterElement = document.querySelector(`.${positionClassName}`);
    if (fighterElement) {
        const efect = hit === 'hit' ? 'hit-effect' : 'critical-effect';
        fighterElement.classList.add(efect);
        setTimeout(() => {
            fighterElement.classList.remove(efect);
        }, 300);
    }
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const firstBar = document.getElementById('left-fighter-indicator');
        const secondBar = document.getElementById('right-fighter-indicator');

        let firstHealth = firstFighter.health;
        let secondHealth = secondFighter.health;

        const totalFirstHealth = firstFighter.health;
        const totalSecondHealth = secondFighter.health;

        const pressedKeys = new Set();
        let firstCanHit = true;
        let secondCanHit = true;

        let firstCriticalReady = true;
        let secondCriticalReady = true;

        function updateHealthBar(bar, currentHealth, totalHealth) {
            const percentage = Math.max((currentHealth / totalHealth) * 100, 0);
            const healthBar = bar;
            healthBar.style.width = `${percentage}%`;
        }

        function checkEndFight() {
            if (firstHealth <= 0 || secondHealth <= 0) {
                document.removeEventListener('keydown', keyDownHandler);
                document.removeEventListener('keyup', keyUpHandler);
                const winner = firstHealth > 0 ? firstFighter : secondFighter;
                resolve(showWinnerModal(winner));
            }
        }

        function keyDownHandler(event) {
            pressedKeys.add(event.code);
            if (event.code === controls.PlayerOneAttack && !pressedKeys.has(controls.PlayerOneBlock) && firstCanHit) {
                firstCanHit = false;
                const damage = getDamage(firstFighter, secondFighter);
                secondHealth -= damage;
                updateHealthBar(secondBar, secondHealth, totalSecondHealth);
                triggerHitEffect('right', 'hit');
                checkEndFight();
                setTimeout(() => (firstCanHit = true), 500);
            }

            if (event.code === controls.PlayerTwoAttack && !pressedKeys.has(controls.PlayerTwoBlock) && secondCanHit) {
                secondCanHit = false;
                const damage = getDamage(secondFighter, firstFighter);
                firstHealth -= damage;
                updateHealthBar(firstBar, firstHealth, totalFirstHealth);
                triggerHitEffect('left', 'hit');
                checkEndFight();
                setTimeout(() => (secondCanHit = true), 500);
            }

            if (firstCriticalReady && controls.PlayerOneCriticalHitCombination.every(key => pressedKeys.has(key))) {
                const damage = firstFighter.attack * 2;
                secondHealth -= damage;
                updateHealthBar(secondBar, secondHealth, totalSecondHealth);
                triggerHitEffect('right', 'сritical');
                checkEndFight();
                firstCriticalReady = false;
                setTimeout(() => {
                    firstCriticalReady = true;
                }, 10000);
            }

            if (secondCriticalReady && controls.PlayerTwoCriticalHitCombination.every(key => pressedKeys.has(key))) {
                const damage = secondFighter.attack * 2;
                firstHealth -= damage;
                updateHealthBar(firstBar, firstHealth, totalFirstHealth);
                triggerHitEffect('left', 'сritical');
                checkEndFight();
                secondCriticalReady = false;
                setTimeout(() => {
                    secondCriticalReady = true;
                }, 10000);
            }
        }

        function keyUpHandler(event) {
            pressedKeys.delete(event.code);
        }

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
    });
}
