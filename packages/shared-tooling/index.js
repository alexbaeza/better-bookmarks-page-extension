// Shared tooling configuration exports
const path = require('node:path');

module.exports = {
  commitlint: require('./configs/commitlint.config.cjs'),
  biome: require('./configs/biome.json'),
  semanticRelease: require('./configs/.releaserc.cjs'),
  scripts: {
    conventionalCommit: './scripts/conventional-commit.sh',
    createRelease: './scripts/create-release.sh',
    currentVersionCheck: './scripts/current-version-check.sh',
  },
  // Helper function to get config paths
  getConfigPath: (configName) => path.resolve(__dirname, 'configs', configName),
};
