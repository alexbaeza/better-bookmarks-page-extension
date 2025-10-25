Feature: Greeting Settings
  As a user
  I want to customize my greeting message
  So that I can personalize my bookmark extension

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface

  Scenario: Access greeting settings
    When I click the settings button
    Then I should see the settings panel
    And I should see greeting options

  Scenario: Change greeting message
    Given I can see greeting options
    When I enter a new greeting message
    Then the greeting should update immediately
    And the new greeting should be displayed

  Scenario: Greeting persistence
    Given I have changed the greeting message
    When I refresh the page
    Then the new greeting should be maintained

  Scenario: Greeting validation
    Given I can see greeting options
    When I enter an empty greeting message
    Then I should see a validation error
    And the greeting should not be saved
