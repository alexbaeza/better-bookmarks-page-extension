Feature: Search Bar Settings
  As a user
  I want to configure the search bar behavior
  So that I can optimize my search experience

  Background:
    Given the bookmark extension is loaded
    And I can see the main interface

  Scenario: Access search bar settings
    When I click the settings button
    Then I should see the settings panel
    And I should see search bar options

  Scenario: Configure search behavior
    Given I can see search bar options
    When I modify search settings
    Then the search behavior should update
    And the changes should be applied immediately

  Scenario: Search settings persistence
    Given I have changed search settings
    When I refresh the page
    Then the search settings should be maintained

  Scenario: Search functionality
    Given I have configured search settings
    When I use the search bar
    Then the search should work according to my settings
    And the results should be accurate
