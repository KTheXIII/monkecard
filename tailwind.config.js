module.exports = {
  mode: 'jit',
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Map to Tailwind's colors names
        'mblack' : 'var(--black)',
        'mgray' : 'var(--gray)',
        'mred' : 'var(--red)',
        'myellow' : 'var(--yellow)',
        'mgreen' : 'var(--green)',
        'mbluel' : 'var(--blue)',
        'mpurple' : 'var(--purple)',
        'morange' : 'var(--orange)',

        'mbg-base' : 'var(--bg-base)',
        'mbg-active' : 'var(--bg-active)',
        'mbg-hover' : 'var(--bg-hover)',
        'mbg-1' : 'var(--bg-1)',
        'mbg-2' : 'var(--bg-2)',
        'mbg-3' : 'var(--bg-3)',

        'mtext-base' : 'var(--text-base)',
        'mtext-active' : 'var(--text-active)',
        'mtext-hover' : 'var(--text-hover)',
        'mtext-dim-1' : 'var(--text-dim-1)',
        'mtext-dim-2' : 'var(--text-dim-2)',
        'mtext-dim-3' : 'var(--text-dim-3)',
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
        'memo': '0 0 15pt 2pt rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        'mono': ['"Roboto Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      fontSize: {
        'memo': '12pt'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
