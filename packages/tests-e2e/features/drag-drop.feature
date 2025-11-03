Feature: Drag and Drop
  As a user
  I want to organize my bookmarks by dragging items
  So that I can keep things tidy

  Background:
    Given the bookmark extension is loaded
    And I have bookmarks in my browser

  Scenario: Test basic drag and drop functionality
    Given I can see bookmarks and folders
    When I drag a bookmark to a folder
    Then the drag operation should complete successfully

  Scenario: Reorder items within a folder
    Given I can see bookmarks and folders
    When I drag the first bookmark to the second position
    Then the bookmark should be reordered
    And the drag operation should complete successfully
    When I reload the page
    Then the bookmark order should persist

  Scenario: Move bookmark between folders
    Given I can see bookmarks and folders
    When I drag a bookmark to a folder
    Then the bookmark should be moved to that folder
    And the drag operation should complete successfully
    When I reload the page
    Then the bookmark should still be in the target folder
