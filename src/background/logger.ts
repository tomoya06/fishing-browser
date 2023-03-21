import { getSettings } from '../types/settings';

// FIXME: 晚点再搞这个
function injectLogger() {
  const { log } = console;
  console.log = async (...data: any[]) => {
    const isdebug = await getSettings('debug');
    if (isdebug) {
      return;
    }
    log(...data);
  };
}

// injectLogger();
