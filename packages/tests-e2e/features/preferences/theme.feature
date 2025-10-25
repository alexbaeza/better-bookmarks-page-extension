Feature: Theme Preference
  As a user
  I want to change the theme
  So that the app matches my preference

  Background:
    Given the bookmark extension is loaded

  Scenario: Change to default theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "default" theme
    Then the app should have "default" theme

  Scenario: Change to github-light theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "github-light" theme
    Then the app should have "github-light" theme

  Scenario: Change to github-dark theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "github-dark" theme
    Then the app should have "github-dark" theme

  Scenario: Change to solarized-light theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "solarized-light" theme
    Then the app should have "solarized-light" theme

  Scenario: Change to solarized-dark theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "solarized-dark" theme
    Then the app should have "solarized-dark" theme

  Scenario: Change to nord-light theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "nord-light" theme
    Then the app should have "nord-light" theme

  Scenario: Change to nord theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "nord" theme
    Then the app should have "nord" theme

  Scenario: Change to vscode-dark theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "vscode-dark" theme
    Then the app should have "vscode-dark" theme

  Scenario: Change to dracula theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "dracula" theme
    Then the app should have "dracula" theme

  Scenario: Change to tokyo-night theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "tokyo-night" theme
    Then the app should have "tokyo-night" theme

  Scenario: Change to catppuccin-mocha theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "catppuccin-mocha" theme
    Then the app should have "catppuccin-mocha" theme

  Scenario: Change to pink theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "pink" theme
    Then the app should have "pink" theme
