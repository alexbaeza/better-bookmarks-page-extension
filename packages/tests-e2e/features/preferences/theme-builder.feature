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

  Scenario Outline: Change color in custom theme
    When I click "settings-toggle"
    Then I should see the "theme-settings" section
    When I select the "default" theme
    When I click "theme-custom"
    Then the app should have custom theme with "<colorKey>" color
    And the "<colorKey>" color should be "<defaultColor>"
    When I select color "<newColor>" for "<colorKey>"
    Then the app should have custom theme with "<colorKey>" color
    And the "<colorKey>" color should be "<newColor>"

    Examples:
      | colorKey           | defaultColor | newColor |
      | bgColor-primary    | #1F1E25      | #FF0000  |
      | bgColor-secondary  | #1C1B22      | #00FF00  |
      | bgColor-accent     | #007AFF      | #0000FF  |
      | fgColor-primary     | #F9F9FA      | #FFFFFF  |
      | fgColor-danger     | #E03C31      | #FF4444  |

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
