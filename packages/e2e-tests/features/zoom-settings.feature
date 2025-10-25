Feature: Zoom Settings
  As a user
  I want to adjust the zoom level of my bookmark extension
  So that I can optimize the display for my needs

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface

  Scenario: Access zoom settings
    When I click the settings button
    Then I should see the settings panel
    And I should see zoom options

  Scenario: Change zoom level
    Given I can see zoom options
    When I select a different zoom level
    Then the zoom should change immediately
    And the new zoom level should be applied

  Scenario: Zoom persistence
    Given I have changed the zoom level
    When I refresh the page
    Then the selected zoom level should be maintained

  Scenario: Zoom limits
    Given I can see zoom options
    When I try to set an extreme zoom level
    Then the zoom should be limited to reasonable bounds
    And the interface should remain usable
