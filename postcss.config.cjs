module.exports = {
  plugins: [
    require('postcss-purgecss')({
      content: [
        `./src/**/*.svelte`,
        `./node_modules/@smui/**/bare.css`,
      ],
    }),
  ],
};
