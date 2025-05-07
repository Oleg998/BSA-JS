import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    const title = `Winner: ${fighter.name}`;
    const bodyElement = createFighterImage(fighter);
    showModal({ title, bodyElement });
}
