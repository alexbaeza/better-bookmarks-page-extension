Feature: Greeting Preference
  As a user
  I want to set a greeting message
  So that I can personalize the app

  Background:
    Given the bookmark extension is loaded

  Scenario: Set greeting message
    When I click "settings-toggle"
    Then I should see the "greeting-settings" section
    When I enter "Hello World" as "greeting-name-input"
    Then the "greeting-name-input" field should contain "Hello World"
    When I click "settings-toggle"
    Then I should see "Hello World" in the "greeting-message"
