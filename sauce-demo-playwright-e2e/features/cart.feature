Feature: Shopping Cart Operations
  As a customer
  I want to manage items in my shopping cart
  So that I can purchase the products I want

  Background:
    Given I am logged in as a standard user
    And I am on the products page
    When I initialize the cart page

  Scenario: Add single product to cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1" items
    When I navigate to cart page
    Then I should see "Sauce Labs Backpack" in the cart
    And the cart item "Sauce Labs Backpack" should cost "$29.99"

  Scenario: Add multiple products to cart
    When I add the following products to cart:
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
    Then the cart badge should show "3" items
    When I go to the cart
    Then I should see the following items in cart:
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
    And the cart item "Sauce Labs Backpack" should cost "$29.99"
    And the cart item "Sauce Labs Bike Light" should cost "$9.99"
    And the cart item "Sauce Labs Bolt T-Shirt" should cost "$15.99"

  Scenario: Remove items from cart
    Given I have added "Sauce Labs Backpack" to the cart
    And I have added "Sauce Labs Bike Light" to the cart
    When I go to the cart
    And I remove "Sauce Labs Backpack" from the cart
    Then the cart badge should show "1" items
    And I should not see "Sauce Labs Backpack" in the cart
    But I should see "Sauce Labs Bike Light" in the cart

  Scenario: Update cart with mixed operations
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    And I go to the cart
    Then I should see "2" items in the cart
    When I remove "Sauce Labs Backpack" from the cart
    And I continue shopping
    And I add "Sauce Labs Bolt T-Shirt" to the cart
    And I go to the cart
    Then I should see "2" items in the cart
    And I should see the following items in cart:
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt | 