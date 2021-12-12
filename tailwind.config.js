module.exports = {
  mode: 'jit',
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Map to Tailwind's colors names
        'mgray': 'var(--gray)',
        'mred': 'var(--red)',
        'myellow': 'var(--yellow)',
        'mgreen': 'var(--green)',
        'mblue': 'var(--blue)',
        'mpurple': 'var(--purple)',
        'mbg-0': 'var(--bg-0)',
        'mbg-1': 'var(--bg-1)',
        'mbg-2': 'var(--bg-2)',
        'mbg-3': 'var(--bg-3)',
        'mt-0': 'var(--text-0)',
        'mt-1': 'var(--text-1)',
        'mt-2': 'var(--text-2)',
      },
      borderRadius: {
        'memo': '5pt',
        'mfull': '50%',
      },
      minHeight: {
        'mcard': '20em'
      },
      minWidth: {
        'mcard': '14em'
      },
      boxShadow: {
        'memo': '0 0 15pt 2pt rgba(0, 0, 0, 0.25)'
      },
      fontFamily: {
        'mono': ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      fontSize: {
        'mbase': '12pt'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
