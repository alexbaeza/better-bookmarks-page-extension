Feature: Theme Settings
  As a user
  I want to customize the theme of my bookmark extension
  So that I can have a personalized visual experience

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface

  Scenario: Access theme settings
    When I click the settings button
    Then I should see the settings panel
    And I should see theme options

  Scenario: Change theme
    Given I can see theme options
    When I select a different theme
    Then the theme should change immediately
    And the new theme should be applied

  Scenario: Theme persistence
    Given I have changed the theme
    When I refresh the page
    Then the selected theme should be maintained

  Scenario: Theme preview
    Given I can see theme options
    When I hover over a theme option
    Then I should see a preview of that theme
    And the preview should be accurate
