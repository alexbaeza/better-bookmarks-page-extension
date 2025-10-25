Feature: Bookmark Management
  As a user
  I want to manage my bookmarks
  So that I can organize and access them efficiently

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface
    And I have bookmarks in my browser

  Scenario: View bookmarks on page load
    When the page loads
    Then I should see my bookmarks displayed
    And I should see folder structures
    And I should see bookmark counts

  Scenario: Navigate to folder contents
    Given I can see bookmark folders
    When I click on a folder
    Then I should see the folder contents
    And I should be able to navigate back
    And the folder name should be displayed in the header

  Scenario: Drag and drop bookmark to folder
    Given I can see bookmarks and folders
    When I drag a bookmark to a folder
    Then the bookmark should be moved to that folder
    And the bookmark should no longer be in its original location
    And the folder should show updated bookmark count
    And the drag operation should complete successfully

  Scenario: Reorder bookmarks within folder
    Given I can see multiple bookmarks in a folder
    When I drag a bookmark to a new position
    Then the bookmark should be reordered
    And the new order should be maintained
    And the new order should be maintained after page refresh

  Scenario: Move folder to another folder
    Given I can see multiple folders
    When I drag a folder to another folder
    Then the folder should be moved
    And it should become a subfolder
    And the parent folder should show updated folder count

  Scenario: Search bookmarks
    Given I can see bookmarks
    When I type in the search bar
    Then I should see filtered results
    And only matching bookmarks should be displayed
    And the search should be case-insensitive

  Scenario: Toggle view modes
    Given I can see bookmarks in grid view
    When I click the view toggle
    Then I should see bookmarks in list view
    When I click the view toggle
    Then I should see bookmarks in grid view

  Scenario: Access settings
    When I click the settings button
    Then I should see the settings panel
    And I should be able to configure options
    And I should be able to close the settings

  Scenario: Handle empty folders
    Given I have an empty folder
    When I click on the empty folder
    Then I should see an empty state message
    And I should be able to add bookmarks to it

  Scenario: Responsive layout
    Given I am on a desktop device
    When I resize the browser window
    Then the layout should adapt appropriately
    And bookmarks should remain accessible

  Scenario: Drag operation cancellation
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
