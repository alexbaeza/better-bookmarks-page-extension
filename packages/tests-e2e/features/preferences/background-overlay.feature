Feature: Background Overlay Preference
  As a user
  I want to change the background overlay
  So that the background looks the way I like

  Background:
    Given the bookmark extension is loaded

  Scenario: Toggle background overlay
    When I click "settings-toggle"
    And I click "appearance-section-toggle"
    Then I should see the "background-overlay-settings" section
    When I click "background-overlay-toggle"
    Then I should see "settings-modal"

  Scenario: Select Doodle 1 overlay
    When I click "settings-toggle"
    And I click "appearance-section-toggle"
    Then I should see the "background-overlay-settings" section
    When I click "background-overlay-toggle"
    And I click "background-overlay-option-1"
    Then I should see "settings-modal"


