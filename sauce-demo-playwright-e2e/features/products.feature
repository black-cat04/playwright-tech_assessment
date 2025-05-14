Feature: Product Listing and Search
  As a customer
  I want to view and search products
  So that I can find items I want to purchase

  Background:
    Given I am logged in as a standard user
    When I initialize the products page

  Scenario: Verify product list after login
    Then I should see 6 products displayed
    And the following products should be visible:
      | Sauce Labs Backpack                |
      | Sauce Labs Bike Light              |
      | Sauce Labs Bolt T-Shirt            |
      | Sauce Labs Fleece Jacket           |
      | Sauce Labs Onesie                  |
      | Test.allTheThings() T-Shirt (Red)  |

  Scenario: Search for specific products
    When I search for product containing "Sauce Labs"
    Then I should see 5 products displayed
    And 5 products should contain "Sauce Labs"
    When I search for product containing "T-Shirt"
    Then I should see 2 products displayed
    And all visible products should contain "T-Shirt"

  Scenario: Verify product prices
    Then the item "Sauce Labs Backpack" should cost "$29.99"
    And the item "Sauce Labs Bike Light" should cost "$9.99"
    And the item "Sauce Labs Bolt T-Shirt" should cost "$15.99"
    And the item "Sauce Labs Fleece Jacket" should cost "$49.99"
