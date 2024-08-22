export function jsonFetcher(url: string) {
  return fetch(url).then((r) => r.json());
}
