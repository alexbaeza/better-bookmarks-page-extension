module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-length': [0], // Disabled - allow unlimited characters in commit body
    'body-max-line-length': [0], // Disabled - allow unlimited characters per line in body
    'subject-case': [0], // Disabled - don't enforce casing for commit subjects
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['release', 'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
  },
};
