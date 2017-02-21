import prism from 'prismjs';
import 'prismjs/themes/prism.css';

import handleEvent from './handle-event';
import panjs from '../src/';

panjs('.example-one .img-wrapper', {
  offset: {x: 10, y: 150},
});

const target = document.querySelector('.event-target');
const handleEventExample = handleEvent(target);
const panEvent = panjs('.example-two .img-wrapper');

panEvent.on('mouseenter', handleEventExample);
