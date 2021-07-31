const config = {
  typeName: 'IFRAME_COMMUNICATION_EXAMPLE',
  answerTimeoutInMilliseconds: 10000,
};

/** @type {(name: string) => boolean} */
export const setTypeName = (name) => {
  const typeName = String(name);
  if (typeName) {
    config.typeName = typeName;
    return true;
  }
  return false;
};

/** @type {(milliseconds: number) => boolean} */
export const setAnswerTimeout = (milliseconds) => {
  const number = Number(milliseconds);
  const integer = Number.isInteger(number) ? number : Math.floor(number);
  if (Number.isFinite(integer)) {
    config.answerTimeoutInMilliseconds = integer;
    return true;
  }
  return false;
};

export const isNil = (v) => v === null || v === undefined;

export const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const isChildFrame = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

/** @type {(iframeEl: HTMLIFrameElement, topic: string) => Promise<any>} */
export const askToChildFrame = async(iframeEl, topic) => {
  const { origin } = new URL(iframeEl.src);
  iframeEl.contentWindow.postMessage({
    type: config.typeName,
    topic,
  }, origin);
  return answerOf(topic);
};

/** @type {(topic: string) => Promise<any>} */
export const askToParentFrame = async(topic) => {
  window.parent.postMessage({
    type: config.typeName,
    topic,
  }, '*');
  return answerOf(topic);
};

/** @type {(topic: string) => Promise<any>} */
export const answerOf = async(topic) => {
  let fn;

  const answer = await Promise.race([
    sleep(config.answerTimeoutInMilliseconds),
    new Promise((resolve) => {
      fn = (event) => {
        const msg = event.data;
        if (msg?.type === config.typeName && msg?.topic === topic && !isNil(msg?.answer)) {
          return resolve(msg.answer);
        }
      };
      window.addEventListener('message', fn);
    }),
  ]);

  window.removeEventListener('message', fn);
  return answer;
};

const childQuestions = [];

export const onChildQuestion = (fn) => childQuestions.push(fn);

export const setupParentFrameMessageListener = () => {
  // Handles request from child frame
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg?.type !== config.typeName) { return; }

    // response answer to child
    if (!msg.answer) {
      childQuestions.forEach(async(fn) => {
        const answer = await fn?.(msg);
        if (!isNil(answer)) {
          event.source.postMessage({ ...msg, answer }, event.origin);
        }
      });
    }
  });
};

const parentQuestions = [];

export const onParentQuestion = (fn) => parentQuestions.push(fn);

export const setupChildFrameMessageListener = () => {
// Handles request from parent frame
  window.addEventListener('message', (event) => {

    const msg = event.data;
    if (msg?.type !== config.typeName) { return; }

    // response answer to parents
    if (!msg.answer) {
      parentQuestions.forEach(async(fn) => {
        const answer = await fn?.(msg);
        if (!isNil(answer)) {
          event.source.postMessage({ ...msg, answer }, event.origin);
        }
      });
    }
  });
};
