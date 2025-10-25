Feature: Settings Reset
  As a user
  I want to reset my settings to default values
  So that I can start fresh if needed

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface

  Scenario: Access settings reset
    When I click the settings button
    Then I should see the settings panel
    And I should see a reset option

  Scenario: Reset all settings
    Given I have modified various settings
    When I click the reset button
    Then I should see a confirmation dialog
    And when I confirm the reset
    Then all settings should return to default values
    And the interface should reflect the default state

  Scenario: Cancel settings reset
    Given I have modified various settings
    When I click the reset button
    And I cancel the confirmation dialog
    Then my current settings should be preserved
    And no changes should be made

  Scenario: Reset confirmation
    Given I can see the reset option
    When I click the reset button
    Then I should see a clear confirmation message
    And the confirmation should explain what will be reset
