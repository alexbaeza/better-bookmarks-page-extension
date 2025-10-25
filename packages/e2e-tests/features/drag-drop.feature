Feature: Drag and Drop Functionality
  As a user
  I want to drag and drop bookmarks and folders
  So that I can organize my bookmarks efficiently

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface
    And I have bookmarks in my browser

  Scenario: Drag bookmark to different folder
    Given I can see bookmarks and folders
    When I drag a bookmark to a folder
    Then the bookmark should be moved to that folder
    And the drag operation should complete successfully

  Scenario: Reorder bookmarks within same folder
    Given I can see multiple bookmarks in a folder
    When I drag a bookmark to a new position
    Then the bookmark should be reordered
    And the new order should be maintained

  Scenario: Move folder to another folder
    Given I can see multiple folders
    When I drag a folder to another folder
    Then the folder should be moved
    And it should become a subfolder

  Scenario: Cancel drag operation
    When I start dragging a bookmark
    And I cancel the drag operation
    Then the bookmark should remain in its original position

  Scenario: Drag visual feedback
    When I start dragging a bookmark
    Then I should see drag visual feedback

  Scenario: Multiple drag operations
    When I perform multiple drag operations
    Then all operations should complete successfully
    And the interface should remain stable

  Scenario: Drag bookmark to same folder (should be prevented)
    Given I can see bookmarks and folders
    When I attempt to drag a bookmark to its current folder
    Then the drag operation should be prevented
    And the bookmark should remain in its original position
