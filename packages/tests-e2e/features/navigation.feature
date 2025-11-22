Feature: Navigation
  As a user
  I want to navigate folders and view bookmarks
  So that I can explore my bookmark structure

  Background:
    Given the bookmark extension is loaded

  Scenario: Toggle view modes while navigating
    Given I can see bookmarks in grid view
    When I click "view-toggle"
    Then I should see bookmarks in list view
    When I click "view-toggle"
    Then I should see bookmarks in grid view

  Scenario: Navigate sidebar pages
    When the page loads
    Then I should see the sidebar
    When I click "All Items" in the sidebar
    Then I should see all bookmarks
    When I click "Uncategorized" in the sidebar
    Then I should see uncategorized bookmarks

  Scenario: Expand and collapse sidebar folders
    When the page loads
    Then I should see the sidebar
    And I should see sidebar folders
    When I expand a sidebar folder
    Then I should see expanded folder contents
    When I collapse the sidebar folder
    Then I should see collapsed folder contents

  # Scenario: Open sidebar folder flyout
    # When the page loads
    # Then I should see the sidebar
    # When I click on a sidebar folder
    # Then I should see the sidebar flyout
    # And I should see folder contents in flyout
    # When I close the sidebar flyout
    # Then I should not see the sidebar flyout
