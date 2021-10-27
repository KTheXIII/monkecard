module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false, // or 'media' or 'class'
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
        'me': '5pt'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
