import prism from 'prismjs';
import 'prismjs/themes/prism.css';

import handleEvent from './handle-event';
import panjs from '../src/';

panjs('.example-one .img-wrapper', {
  offset: {x: 10, y: 150},
});

const pan = panjs('.example-two .img-wrapper');
const resetOne = document.querySelector('.reset-button.base');
const resetTwo = document.querySelector('.reset-button.next');

resetOne.addEventListener('click', () => pan.reset())
resetTwo.addEventListener('click', () => pan.reset({ offset: { x: 10, y: 10 }}))

const target = document.querySelector('.event-target');
const handleEventExample = handleEvent(target);
const panEvent = panjs('.example-two .img-wrapper');

panEvent.on('mouseenter', handleEventExample);
