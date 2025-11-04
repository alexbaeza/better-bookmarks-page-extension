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
    // Analyze commits for version bumps
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
          headerPattern: /^(\w+)(?:\(([^)]+)\))?: (.*)$/,
          headerCorrespondence: ['type', 'scopeOrVersion', 'subject'],
        },
      },
    ],

    // Generate changelog sections with custom formatting
    [
      '@semantic-release/release-notes-generator',
      {
        writerOpts: {
          commitsSort: ['subject', 'scope'],
        },
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: '✨ Features' },
            { type: 'fix', section: '🐛 Bug Fixes' },
            { type: 'refactor', section: '🧠 Refactor' },
            { type: 'perf', section: '⚡ Performance' },
            { type: 'docs', section: '📝 Docs' },
            { type: 'chore', section: '🧹 Chore' },
            { type: 'test', section: '🧪 Tests' },
            { type: 'build', section: '🏗️ Build' },
            { type: 'ci', section: '🤖 CI' },
            { type: 'style', hidden: true },
          ],
        },
      },
    ],

    // Update or create CHANGELOG.md
    '@semantic-release/changelog',

    // Update package.json but don’t publish to npm
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],

    //️ Build + prepare step
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'pnpm release',
      },
    ],

    // Commit back version + changelog
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],

    // Publish GitHub release with dynamic artifact names
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
