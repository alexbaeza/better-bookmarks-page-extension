module.exports = {
  branches: [
    'main',
    {
      name: 'develop',
      prerelease: 'beta',
    },
  ],
  preset: 'conventionalcommits',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { release: 'minor', type: 'feat' },
          { release: 'patch', type: 'fix' },
          { release: 'patch', type: 'perf' },
          { release: 'patch', type: 'revert' },
          { release: false, type: 'docs' },
          { release: false, type: 'style' },
          { release: false, type: 'chore' },
          { release: 'patch', type: 'refactor' },
          { release: false, type: 'test' },
          { release: false, type: 'build' },
          { release: false, type: 'ci' },
          { release: 'major', type: 'release' },
        ],
        parserOpts: {
          headerPattern: /^(\w+)(?:\(([\d.]+)\))?: (.*)$/,
          headerCorrespondence: ['type', 'version', 'subject'],
        },
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'pnpm release',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            label: 'Chrome Extension',
            name: 'chrome-extension-v${nextRelease.version}.zip',
            path: 'release/extension-chrome-*.zip',
          },
          {
            label: 'Firefox Extension',
            name: 'firefox-extension-v${nextRelease.version}.zip',
            path: 'release/extension-firefox-*.zip',
          },
        ],
      },
    ],
  ],
};
