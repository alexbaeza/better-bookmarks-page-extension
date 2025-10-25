Feature: Theme Builder
  As a user
  I want to create custom themes by picking colors
  So that I can personalize the app appearance

  Background:
    Given the bookmark extension is loaded

  Scenario: Enable custom theme builder
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I click "theme-custom"
    Then the app should have custom theme with "bgColor-primary" color

  Scenario: Change primary background color
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I click "theme-custom"
    Then the app should have custom theme with "bgColor-primary" color
    And the "bgColor-primary" color should be "#1F1E25"
    When I select color "#FF0000" for "bgColor-primary"
    Then the app should have custom theme with "bgColor-primary" color
    And the "bgColor-primary" color should be "#FF0000"

  Scenario: Change secondary background color
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I click "theme-custom"
    Then the app should have custom theme with "bgColor-secondary" color
    And the "bgColor-secondary" color should be "#1C1B22"
    When I select color "#00FF00" for "bgColor-secondary"
    Then the app should have custom theme with "bgColor-secondary" color
    And the "bgColor-secondary" color should be "#00FF00"

  Scenario: Change accent color
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I click "theme-custom"
    Then the app should have custom theme with "bgColor-accent" color
    And the "bgColor-accent" color should be "#007AFF"
    When I select color "#0000FF" for "bgColor-accent"
    Then the app should have custom theme with "bgColor-accent" color
    And the "bgColor-accent" color should be "#0000FF"

  Scenario: Change primary foreground color
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I click "theme-custom"
    Then the app should have custom theme with "fgColor-primary" color
    And the "fgColor-primary" color should be "#F9F9FA"
    When I select color "#FFFFFF" for "fgColor-primary"
    Then the app should have custom theme with "fgColor-primary" color
    And the "fgColor-primary" color should be "#FFFFFF"

  Scenario: Change danger color
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I click "theme-custom"
    Then the app should have custom theme with "fgColor-danger" color
    And the "fgColor-danger" color should be "#E03C31"
    When I select color "#FF4444" for "fgColor-danger"
    Then the app should have custom theme with "fgColor-danger" color
    And the "fgColor-danger" color should be "#FF4444"

  Scenario: Switch from custom theme to preset theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I click "theme-custom"
    Then the app should have custom theme with "bgColor-primary" color
    When I click "theme-github-dark"
    Then the app should have "github-dark" theme
    And "custom-theme-style" should not exist

  Scenario: Create complete custom theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I click "theme-custom"
    Then the app should have custom theme with "bgColor-primary" color
    When I select color "#2D1B69" for "bgColor-primary"
    And I select color "#3D2B7A" for "bgColor-secondary"
    And I select color "#4D3B8A" for "bgColor-tertiary"
    And I select color "#FF6B6B" for "bgColor-accent"
    And I select color "#FFFFFF" for "fgColor-primary"
    And I select color "#CCCCCC" for "fgColor-secondary"
    And I select color "#FF4444" for "fgColor-danger"
    Then the app should have custom theme with "bgColor-primary" color
    And the "bgColor-primary" color should be "#2D1B69"
    And the "bgColor-secondary" color should be "#3D2B7A"
    And the "bgColor-accent" color should be "#FF6B6B"
    And the "fgColor-primary" color should be "#FFFFFF"
    And the "fgColor-danger" color should be "#FF4444"
