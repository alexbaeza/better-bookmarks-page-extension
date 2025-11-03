const semanticReleaseSharedConfig = require('@better-bookmarks/shared-tooling').semanticRelease;

module.exports = {
  ...semanticReleaseSharedConfig,
  releaseRules: [
    ...semanticReleaseSharedConfig.releaseRules,
    { release: 'minor', type: 'release' }, // Allow release: type to trigger minor releases
  ],
};
