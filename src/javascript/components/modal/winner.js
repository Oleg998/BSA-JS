import showModal from './modal';
import { createFighterImage } from '../fighterPreview';
import createElement from '../../helpers/domHelper';

export default function showWinnerModal(fighter) {
    const title = `Winner: ${fighter.name}`;

    function createFighter() {
        const imgElement = createFighterImage(fighter);
        const fighterElement = createElement({
            tagName: 'div',
            className: `winner___fighter`
        });

        fighterElement.append(imgElement);
        return fighterElement;
    }

    const bodyElement = createFighter(fighter);
    showModal({ title, bodyElement });
}
