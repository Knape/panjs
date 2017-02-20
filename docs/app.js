import prism from 'prismjs';
import 'prismjs/themes/prism.css';

import handleEvent from './handle-event';
import panjs from '../src/';

panjs('.example-one');

const target = document.querySelector('.event-target');
const handleEventExample = handleEvent(target);
const panEvent = panjs('.example-two');

panEvent.on('mouseenter', handleEventExample);
