"use strict";

module.exports = function (api) {
  api.cache.using(function () {
    return 'v1';
  });
  return {
    presets: [['@babel/preset-env']],
    plugins: ['@babel/plugin-proposal-object-rest-spread']
  };
};