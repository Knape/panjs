import prism from 'prismjs';
import 'prismjs/themes/prism.css';

import handleEvent from './handle-event';
import panjs from '../src/';

panjs('.example-one .img-wrapper', {
  offset: {x: 0, y: 0},
});

const pan = panjs('.example-two .img-wrapper');
const resetOne = document.querySelector('.reset-button.base');
const resetTwo = document.querySelector('.reset-button.next');

resetOne.addEventListener('click', () => pan.reset())
resetTwo.addEventListener('click', () => pan.reset({ offset: { x: 0.1, y: 0.1 }}))

const target = document.querySelector('.event-target');
const handleEventExample = handleEvent(target);
const panEvent = panjs('.example-three .img-wrapper');
console.log(panEvent);
panEvent.on('mouseenter', handleEventExample);
