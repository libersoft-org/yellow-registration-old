export function storeOptIdInURL(optId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('optid', optId);
  history.pushState({}, "", url);
}

export function removeOptIdFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('optid');
  history.pushState({}, "", url);
}

export function loadOptIdFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('optid');
}

