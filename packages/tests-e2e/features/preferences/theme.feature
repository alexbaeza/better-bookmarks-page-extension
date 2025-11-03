Feature: Theme Preference
  As a user
  I want to change the theme
  So that the app matches my preference

  Background:
    Given the bookmark extension is loaded

  Scenario Outline: Change to preset theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "<theme>" theme
    Then the app should have "<theme>" theme

    Examples:
      | theme             |
      | default           |
      | github-light      |
      | github-dark       |
      | solarized-light   |
      | solarized-dark    |
      | nord-light        |
      | nord              |
      | vscode-dark       |
      | dracula           |
      | tokyo-night       |
      | catppuccin-mocha  |
      | pink              |
