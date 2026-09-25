export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function getLocalStorage(key: string) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

export function updateLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function deleteLocalStorage(key: string) {
  localStorage.removeItem(key);
}

export function addToLocalStorageLimited(key: string, value: string) {
  const existing = getLocalStorage(key);
  if (existing) {
    const array = JSON.parse(existing);

    array.unshift(value);

    if (array.length > 20) {
      array.pop();
    }

    setLocalStorage(key, JSON.stringify(array));
  } else {
    setLocalStorage(key, JSON.stringify([value]));
  }
}

export function getLocalStorageArray(key: string) {
  const existing = getLocalStorage(key);
  if (existing) {
    return JSON.parse(existing);
  } else {
    return [];
  }
}

export function setLocalStorageArray(key: string, value: unknown[]) {
  setLocalStorage(key, JSON.stringify(value));
}
