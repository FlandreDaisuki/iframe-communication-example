import {
  isChildFrame,
  setupChildFrameMessageListener,
  setupParentFrameMessageListener,
} from './message.js';

if (isChildFrame()) {
  setupChildFrameMessageListener();
} else {
  setupParentFrameMessageListener();
}

export const TOPIC = Object.freeze({
  COUNTER_TIMES: 'COUNTER_TIMES',
  INPUT_VALUE: 'INPUT_VALUE',
});
