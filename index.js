import {
  isChildFrame,
  setupInnerFrameMessageListener,
  setupOuterFrameMessageListener,
} from './message.js';

if (isChildFrame()) {
  setupInnerFrameMessageListener();
} else {
  setupOuterFrameMessageListener();
}

export const TOPIC = Object.freeze({
  COUNTER_TIMES: 'COUNTER_TIMES',
  INPUT_VALUE: 'INPUT_VALUE',
});
