import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/browser.ts',
  output: {
    sourcemap: true,
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [typescript({ tsconfig: 'tsconfig.rollup.json' })]
}