Feature: Settings Management
  As a user
  I want to configure my bookmark extension settings
  So that I can customize my experience

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface

  Scenario: Access settings panel
    When I click the settings button
    Then I should see the settings panel
    And I should be able to configure options
    And I should be able to close the settings

  Scenario: Settings panel persistence
    When I click the settings button
    And I configure some options
    And I close the settings
    And I reopen the settings
    Then my previous settings should be preserved

  Scenario: Settings validation
    When I click the settings button
    And I enter invalid configuration
    Then I should see validation errors
    And I should not be able to save invalid settings
