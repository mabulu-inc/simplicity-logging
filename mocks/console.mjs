global.called = {};

console.debug = () => (global.called.debug = true);
console.info = () => (global.called.info = true);
console.warn = () => (global.called.warn = true);
console.error = () => (global.called.error = true);
