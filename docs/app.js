import prism from 'prismjs';
import 'prismjs/themes/prism.css';

import handleEvent from './handle-event';
import panjs from '../src/';

panjs('.example-one .img-wrapper', {
  offset: {x: 0, y: 0},
});

panjs('.example-two .img-wrapper', {
  offset: {x: 0, y: 0},
  xAxisLock: true,
});

const pan = panjs('.example-three .img-wrapper');
const resetOne = document.querySelector('.reset-button.base');
const resetTwo = document.querySelector('.reset-button.next');

resetOne.addEventListener('click', () => pan.reset({speed: 300}))
resetTwo.addEventListener('click', () => pan.reset({ offset: { x: 0.3, y: 0.3 }, speed: 300}))

const target = document.querySelector('.event-target');
const handleEventExample = handleEvent(target);
const panEvent = panjs('.example-four .img-wrapper');
panEvent.on('mouseenter', handleEventExample);
