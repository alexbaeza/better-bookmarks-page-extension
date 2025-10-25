Feature: Background Overlay Settings
  As a user
  I want to configure the background overlay
  So that I can customize the visual appearance

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface

  Scenario: Access background overlay settings
    When I click the settings button
    Then I should see the settings panel
    And I should see background overlay options

  Scenario: Change background overlay
    Given I can see background overlay options
    When I select a different overlay
    Then the background should change immediately
    And the new overlay should be applied

  Scenario: Background overlay persistence
    Given I have changed the background overlay
    When I refresh the page
    Then the selected overlay should be maintained

  Scenario: Background overlay preview
    Given I can see background overlay options
    When I hover over an overlay option
    Then I should see a preview of that overlay
    And the preview should be accurate
