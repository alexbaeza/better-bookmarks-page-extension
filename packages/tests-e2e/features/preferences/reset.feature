Feature: Settings Management
  As a user
  I want to configure my bookmark extension settings
  So that I can customize my experience

  Background:
    Given the bookmark extension is loaded
    And I click "settings-toggle"

  Scenario: Reset all settings
    When I click "maintenance-section-toggle"
    And I click the "Reset all settings" button
    Then I should see "confirmation-modal-container"
    When I click "settings-reset-confirm-button"
    Then I should see "app-content"
    And I can see bookmarks