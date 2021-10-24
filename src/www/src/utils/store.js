function byteCount(s) {
  return unescape(encodeURIComponent(s)).length
}

export function setItem(key, value, exp) {
  const remaining = 1024 * 1024 * 5 - byteCount(JSON.stringify(localStorage));
  if (remaining - byteCount(value)) {
    localStorage.setItem(key, value);
    if (exp) {
      localStorage.setItem(`${key}__expires__`, Date.now() + exp * 1000);
    }
  }

}
export function removeItem(key) {
  localStorage.removeItem(key);
  localStorage.removeItem(`${key}__expires__`);
}



export function getItem(key) {
  const expValue = parseInt(localStorage.getItem(`${key}__expires__`));
  if (expValue !== NaN) {
    if (Date.now() / 1000 > expValue) {
      removeItem(key);
    }
  }
  return localStorage.getItem(key);

}