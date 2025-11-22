Feature: Language Preference
  As a user
  I want to change the app language
  So that I can use the app in my preferred language

  Background:
    Given the bookmark extension is loaded

  Scenario: Switch to Spanish and verify translation
    When I click "settings-toggle"
    And I click "personalization-section-toggle"
    Then I should see the "language-settings" section
    When I select "Español" from "language-select"
    And I click "settings-toggle"
    Then I should see "Páginas" in the sidebar
    And I should see "Todos los elementos" in the sidebar
    And I should see "Carpetas" in the sidebar

