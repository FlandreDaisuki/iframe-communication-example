import {
  isChildFrame,
  setupChildFrameMessageListener,
  setupParentFrameMessageListener,
  onParentQuestion, askToParentFrame,
  onChildQuestion, askToChildFrame,
} from './message.js';

export const TOPIC = Object.freeze({
  COUNTER_TIMES: 'COUNTER_TIMES',
  INPUT_VALUE: 'INPUT_VALUE',
});

const setupChildFrameDOM = () => {
  const inputEl = document.getElementById('input');
  const answerEl = document.getElementById('answer');

  document.getElementById('ask-btn').onclick = async() => {
    const answer = await askToParentFrame(TOPIC.COUNTER_TIMES);
    answerEl.textContent = answer;
  };

  onParentQuestion((msg) => {
    if (msg.topic === TOPIC.INPUT_VALUE) {
      return inputEl.value;
    }
  });
};

const setupParentFrameDOM = () => {
  const outputEl = document.getElementById('output');
  const answerEl = document.getElementById('answer');
  const childEl = document.getElementById('child');

  document.getElementById('inc-btn').onclick = () => {
    outputEl.textContent = parseInt(outputEl.textContent) + 1;
  };

  document.getElementById('ask-btn').onclick = async() => {
    const answer = await askToChildFrame(childEl, TOPIC.INPUT_VALUE);
    answerEl.textContent = answer;
  };

  onChildQuestion((msg) => {
    if (msg.topic === TOPIC.COUNTER_TIMES) {
      return parseInt(outputEl.textContent);
    }
  });
};

if (isChildFrame()) {
  setupChildFrameMessageListener();
  setupChildFrameDOM();
} else {
  setupParentFrameMessageListener();
  setupParentFrameDOM();
}
