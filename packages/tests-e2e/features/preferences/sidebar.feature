Feature: Preferences
  As a user
  I want to configure preferences
  So that the app reflects my choices

  Background:
    Given the bookmark extension is loaded

  Scenario: Toggle sidebar
    When I click "settings-toggle"
    Then I should see the "sidebar-settings" section
    When I toggle "sidebar-settings-toggle"
    Then "sidebar" should not exist
    When I toggle "sidebar-settings-toggle"
    Then I should see "sidebar"  