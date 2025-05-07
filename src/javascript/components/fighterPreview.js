import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (!fighter) return fighterElement;
    const fighterImg = createFighterImage(fighter);
    const infoContainer = createElement({
        tagName: 'ul',
        className: `fighter-preview___infoContainer`
    });
    const fighterName = createElement({
        tagName: 'li',
        className: `fighter-preview___infoItem`
    });
    fighterName.innerText = `Name: ${fighter.name}`;

    const fighterHealth = createElement({
        tagName: 'li',
        className: `fighter-preview___infoItem`
    });
    fighterHealth.innerText = `Health: ${fighter.health}`;

    const fighterAttack = createElement({
        tagName: 'li',
        className: `fighter-preview___infoItem`
    });
    fighterAttack.innerText = `Attack: ${fighter.attack}`;

    const fighterDefense = createElement({
        tagName: 'li',
        className: `fighter-preview___infoItem`
    });
    fighterDefense.innerText = `Defense: ${fighter.defense}`;

    infoContainer.append(fighterName, fighterHealth, fighterAttack, fighterDefense);
    fighterElement.append(fighterImg, infoContainer);
    return fighterElement;
}
