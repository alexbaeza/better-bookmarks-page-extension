Feature: Bookmark Management
  As a user
  I want to manage my bookmarks
  So that I can organize and access them efficiently

  Background:
    Given the bookmark extension is loaded
    And I have bookmarks in my browser

  Scenario: View bookmark options menu
    Given I can see bookmarks
    When I click the first "item-options-button"
    Then I should see "Edit" in the app
    And I should see "Delete" in the app

  Scenario: Delete a bookmark successfully
    Given I can see bookmarks
    And I should see my bookmarks displayed
    When I click the first "item-options-button"
    And I click the "Delete" button
    And I click "bookmark-delete-confirm-button"
    Then I should see my bookmarks displayed

  Scenario: Cancel bookmark deletion
    Given I can see bookmarks
    When I click the first "item-options-button"
    And I click the "Delete" button
    And I click "bookmark-delete-cancel-button"
    Then I should see my bookmarks displayed

  Scenario: Open edit modal
    Given I can see bookmarks
    When I click the first "item-options-button"
    And I click the "Edit" button
    Then I should see "modal-close-button"
    When I click "modal-close-button"
    Then I should see my bookmarks displayed

  Scenario: Edit bookmark title
    Given I can see bookmarks
    When I click the first "item-options-button"
    And I click the "Edit" button
    Then I should see "modal-close-button"
    And I enter "Updated Bookmark Title" as "bookmark-edit-title-input"
    And I click the "Save" button
    Then I should see my bookmarks displayed

  Scenario: Navigate bookmark options
    Given I can see bookmarks
    When I click the first "item-options-button"
    Then I should see "Edit" in the app
    And I should see "Delete" in the app
    When I click the first "item-options-button"
    Then I should see my bookmarks displayed