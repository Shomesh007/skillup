module.exports = {
  content: ['./index.html', './App.tsx', './index.tsx', './components/**/*.{ts,tsx}', './context/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: {
      ink: '#182342', primary: '#2549eb', paper: '#f7f9fc', muted: '#64708a', line: '#e2e7f0',
      'background-dark': '#f7f9fc', 'card-bg': '#ffffff',
      'neon-cyan': '#2549eb', 'neon-violet': '#7354bf', 'neon-amber': '#a95b26', 'neon-green': '#26775e', 'neon-red': '#b23b47', 'glass-border': '#e2e7f0'
    },
    fontFamily: { display: ['Plus Jakarta Sans', 'Arial', 'sans-serif'], mono: ['Plus Jakarta Sans', 'Arial', 'sans-serif'] }
  } }, plugins: []
};
