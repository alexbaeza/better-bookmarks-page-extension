Feature: Display Mode Preference
  As a user
  I want to change the display mode
  So that I can view bookmarks as a grid or list

  Background:
    Given the bookmark extension is loaded

  Scenario: Toggle display mode
    Given I can see bookmarks in grid view
    When I click "view-toggle"
    Then I should see bookmarks in list view
    When I click "view-toggle"
    Then I should see bookmarks in grid view


