import { writable } from 'svelte/store';

let initialTheme = window.sessionStorage.getItem('theme');
export const theme = writable(initialTheme);

const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');
const setColorScheme = (e: Event) => {
  if (e.matches) {
    // Dark
    theme.set('dark');
  } else {
    // Light
    theme.set('light');
  }
};

if (!initialTheme) {
  setColorScheme(colorSchemeQueryList);
}
colorSchemeQueryList.addEventListener('change', setColorScheme);

theme.subscribe(value => {
  window.sessionStorage.setItem('theme', value)
  const el = document.getElementById('html-root');
  if (el) el.dataset.theme = value;
});
