const headerElement = document.querySelector('header');
const startButton = document.querySelector('.start');
const fightButton = document.querySelector('.fight');
const characktersListElement = document.querySelector('.characters-list');
const battleFieldElement = document.querySelector('.battle-field');

const createElement = (
  tagName,
  className,
  text1 = '',
  text2 = '',
  text3 = '',
  text4 = ''
) => {
  const element = document.createElement(tagName);
  element.classList.add(className);
  element.innerHTML += text1;
  element.innerHTML += text2;
  element.innerHTML += text3;
  element.innerHTML += text4;
  return element;
};

const createNewCard = (hero) => {
  return createElement(
    'div',
    'card',
    `<p class="name"><span>${hero.name}</span></p>`,
    `<img src="${hero.image}" class="picture" alt="${hero.name}"></img>`,
    `<p class="attack">Attack: ${hero.attack}</p>`,
    `<p class="armour">Armour: ${hero.armour}</p>`
  );
};

const createUnitList = (heroArray) => {
  heroArray.map((hero) => {
    const newplayer = createNewCard(hero);
    const selectButton = createElement('button', 'select', 'Select');
    selectButton.addEventListener('click', () => {
      newplayer.removeChild(selectButton);
      const game = new Game(newplayer);
      game.startGame(hero);
      display.hideCharacktersList();
    });
    newplayer.appendChild(selectButton);

    characktersListElement.appendChild(newplayer);
  });
};

const playerArmour = 8;

// ========= CLASS - U N I T ============ //
class Unit {
  constructor(
    heroName,
    groundAttack,
    heroArmour,
    heroUpdateSec,
    heroImageUrl,
    HP
  ) {
    this.name = heroName;
    this.attack = groundAttack;
    this.armour = heroArmour;
    this.timeout = heroUpdateSec;
    this.image = heroImageUrl;
    this.HP = HP || 1000;
    this.EHP = Math.round(this.EHP());
  }

  armourPercent = (x = this.armour) => (x * 0.06) / (1 + x * 0.06);

  EHP = (x = this.armour) => this.HP / (1 - this.armourPercent(x));
}

const units = [
  new Unit(
    'Footman',
    12.5,
    8,
    1.35,
    'http://classic.battle.net/war3/images/human/units/animations/militia.gif'
  ),
  new Unit(
    'Rifleman',
    21,
    6,
    1.5,
    'http://classic.battle.net/war3/images/human/units/animations/rifleman.gif'
  ),
  new Unit(
    'Militia',
    12.5,
    10,
    1.2,
    'http://classic.battle.net/war3/images/human/units/animations/militia.gif'
  ),
  new Unit(
    'Peasant',
    5.5,
    0,
    2,
    'http://classic.battle.net/war3/images/human/units/animations/peasant.gif'
  ),
  new Unit(
    'Knight',
    34,
    11,
    1.4,
    'http://classic.battle.net/war3/images/human/units/animations/knight.gif'
  ),
  new Unit(
    'Priest',
    5.5,
    0,
    2,
    'http://classic.battle.net/war3/images/human/units/animations/priest.gif'
  ),
  new Unit(
    'Sorceress',
    11,
    0,
    1.75,
    'http://classic.battle.net/war3/images/human/units/animations/sorceress.gif'
  ),
  new Unit(
    'Spellbreaker',
    14,
    9,
    1.9,
    'http://classic.battle.net/war3/images/human/units/animations/spellbreaker.gif'
  ),
  new Unit(
    'Flyingmachine',
    7.5,
    8,
    2,
    'http://classic.battle.net/war3/images/human/units/animations/flyingmachine.gif'
  ),
  new Unit(
    'Dragonhawk',
    19,
    7,
    1.75,
    'http://classic.battle.net/war3/images/human/units/animations/dragonhawk.gif'
  )
];

// ========= CLASS - G A M E ============ //
class Game {
  constructor(playerCard) {
    this.isGameStarted = false;
    this.playerCard = playerCard;
    this.pcUnit = this.getRandomPC;
  }

  // health() {
  //   const health = document.createElement('div');
  //   health.classList.add('health');
  //   return health;
  // }

  startGame(hero) {
    this.isGameStarted = true;
    this.pcUnit(hero);
  }

  getRandomPC(propObjectHero) {
    console.log(units); // show all units in console.log

    const playerUnit = propObjectHero;
    const randomUnit = units[Math.floor(Math.random() * units.length)];
    playerUnit.totalHP = playerUnit.EHP;
    randomUnit.totalHP = randomUnit.EHP;
    // console.log(playerUnit);
    // console.log(randomUnit);

    fightButton.classList.remove('hidden');
    fightButton.addEventListener('click', () =>
      this.stargFighting(playerUnit, randomUnit)
    );

    display.render(playerUnit, randomUnit);
  }

  stargFighting(player, randomPC) {
    fightButton.style.visibility = 'hidden';
    console.log("Let's Get FIGHT");

    // Fighting code goes nexs here..
    let playerIntervFighting;
    let pcIntervFighting;

    function kickAssPC() {
      playerIntervFighting = setInterval(startDamagePC, player.timeout * 1000);
      pcIntervFighting = setInterval(startDamagePLAYA, randomPC.timeout * 1000);
    }
    function playerStopFighting() {
      clearInterval(playerIntervFighting);
      clearInterval(pcIntervFighting);
    }

    function startDamagePC() {
      const playaAttack = player.attack * 10;
      randomPC.totalHP -= playaAttack;
      console.log('------damage-----');
      console.log('pc.totalHP' + randomPC.totalHP);

      display.renderPlayersHealth(
        display.getHealth(player),
        display.getHealth(randomPC)
      );

      if (randomPC.totalHP <= 0) {
        playerStopFighting();
        return battleFieldElement.appendChild(
          createElement('H2', 'game-winner', 'You Win')
        );
      } else if (player.totalHP <= 0) {
        playerStopFighting();
        return battleFieldElement.appendChild(
          createElement('H2', 'game-winner', 'Computer Win')
        );
      }
    }

    function startDamagePLAYA() {
      const playaAttack = randomPC.attack * 10;
      player.totalHP -= playaAttack;
      console.log('------damage-----');
      console.log('pc.totalHP' + player.totalHP);

      display.renderPlayersHealth(
        display.getHealth(player),
        display.getHealth(randomPC)
      );

      if (randomPC.totalHP <= 0) {
        playerStopFighting();
        battleFieldElement.appendChild(
          createElement('H2', 'game-winner', 'You Win')
        );
      } else if (player.totalHP <= 0) {
        playerStopFighting();
        battleFieldElement.appendChild(
          createElement('H2', 'game-winner', 'Computer Win')
        );
      }
    }

    function verifyPlayers() {
      if (randomPC.totalHP <= 0) {
        playerStopFighting();
        battleFieldElement.appendChild(
          createElement('H2', 'game-winner', 'You Win')
        );
      } else if (player.totalHP <= 0) {
        playerStopFighting();
        battleFieldElement.appendChild(
          createElement('H2', 'game-winner', 'Computer Win')
        );
      }
      return false;
    }

    kickAssPC();
  }
}

// ========= CLASS - D I S P L A Y ============
class Display {
  constructor(listElement, button) {
    this.listElement = listElement;
    this.button = button;
    this.getHealth = this.health;
    this.render = this.displayGame;
    this.renderPlayersHealth = this.displayHP;
  }

  // toggleCharacktersList() {
  //   this.listElement.classList.remove('hidden');
  //   this.button.classList.add('hidden');
  // }

  hideCharacktersList() {
    this.listElement.classList.add('hidden');
  }

  init() {
    this.button.addEventListener('click', () => {
      createUnitList(units);
      alert('Choose your fighter');
      this.button.classList.add('hidden');
    });
  }

  initBattleField() {
    battleFieldElement.innerHTML = 'player1' + 'player2';
  }

  health(hero) {
    const playerStartingHP = hero.EHP;
    const valueHP = hero.totalHP;

    const healthBarWidth = valueHP > 0 ? (valueHP / playerStartingHP) * 100 : 1;
    const healthElementDiv = document.createElement('div');

    healthElementDiv.classList.add('health');

    if (healthBarWidth < 40) healthElementDiv.classList.add('red');
    else if (healthBarWidth < 65) healthElementDiv.classList.add('orange');

    healthElementDiv.style.width = healthBarWidth + '%'; // change width of HealthBar
    console.log(hero);
    console.log(hero.totalHP);

    return healthElementDiv;
  }

  displayGame(player_selectedUnit, pc_randomUnit) {
    const playerUnitElement = createNewCard(player_selectedUnit);
    battleFieldElement
      .appendChild(playerUnitElement)
      .appendChild(this.health(player_selectedUnit));

    const pcUnitElement = createNewCard(pc_randomUnit);
    battleFieldElement
      .appendChild(pcUnitElement)
      .appendChild(this.health(pc_randomUnit));
  }

  displayHP(a, b) {
    battleFieldElement.childNodes[0].lastChild.replaceWith(a);
    battleFieldElement.childNodes[1].lastChild.replaceWith(b);
  }
}

const display = new Display(characktersListElement, startButton, fightButton);

display.init();

// 0.	You'll need to implement 3 classes: a Game , a Unit and a Display classes.
// 1.	The first time You load the page you have to create a header with the name of the game and a start button that will start the game.
// 2.	When You press the start button, an alert should be displayed with the ‘Choose your fighter’ sentence. After the alert, a list of characters should be displayed as selectable buttons.
// 3.	The start button must be hidden.
// 4.	You need to choose a character.
// 5.	the second player will be a computer that will select a random character from the list after You have selected a character.
// 6.	Then the list of characters disappears and the ‘Fight’ button appears.
// ----------------------------------------------------------------------------------------
// 7.	Also there should be displayed two containers with the name and stats of the character. as well as his current health and what will be deducted.

// 8.	After You press the Fight button the characters will attack each other and take away health considering attack rate and armor.

// 9.	If one of the characters health falls below zero, he loses.

// 10.	After the match there should be displayed an alert with the victory of the player.

// 11.	After accepting the alert, the player must return to app to the initial state.
