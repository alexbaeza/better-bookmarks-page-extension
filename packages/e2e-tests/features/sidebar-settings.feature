Feature: Sidebar Settings
  As a user
  I want to configure the sidebar behavior
  So that I can optimize my navigation experience

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface

  Scenario: Access sidebar settings
    When I click the settings button
    Then I should see the settings panel
    And I should see sidebar options

  Scenario: Toggle sidebar visibility
    Given I can see sidebar options
    When I toggle the sidebar visibility
    Then the sidebar should show or hide accordingly
    And the change should be immediate

  Scenario: Sidebar persistence
    Given I have changed the sidebar visibility
    When I refresh the page
    Then the sidebar state should be maintained

  Scenario: Sidebar behavior
    Given the sidebar is visible
    When I interact with the main content
    Then the sidebar should remain accessible
    And the layout should remain stable
