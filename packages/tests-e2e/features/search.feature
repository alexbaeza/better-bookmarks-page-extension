Feature: Search
  As a user
  I want to search my bookmarks
  So that I can quickly find what I need

  Background:
    Given the bookmark extension is loaded

  Scenario: Search yields results
    Given I can see bookmarks
    When I type "Mozilla" in the "search-input" field
    Then only results matching "Mozilla" should be displayed

  Scenario: Search yields no results
    Given I can see bookmarks
    When I type "Non-existent-results" in the "search-input" field
    Then no results should match


