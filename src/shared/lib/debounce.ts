type Timer = ReturnType<typeof setTimeout> | null;

const debounce = <T extends (...args: Parameters<T>) => void>(
  fn: T,
  timeout = 300
) => {
  let timer: Timer = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
};

export default debounce;
