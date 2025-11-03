// Shared tooling configuration exports
const path = require('node:path');

module.exports = {
  biome: require('./configs/biome.json'),
  commitlint: require('./configs/commitlint.config.cjs'),
  // Helper function to get config paths
  getConfigPath: (configName) => path.resolve(__dirname, 'configs', configName),
  scripts: {
    conventionalCommit: './scripts/conventional-commit.sh',
    createRelease: './scripts/create-release.sh',
    currentVersionCheck: './scripts/current-version-check.sh',
  },
  semanticRelease: require('./configs/.releaserc.cjs'),
};
