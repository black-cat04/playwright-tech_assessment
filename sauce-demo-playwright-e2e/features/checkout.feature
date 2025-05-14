Feature: Checkout Process
  As a customer
  I want to complete my purchase
  So that I can receive my ordered items

  Background:
    Given I am logged in as a standard user
    When I initialize the cart page
    And I add these products to cart:
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
    And I navigate to cart page
    And I initialize the checkout page
    And I proceed to checkout

  Scenario: Complete purchase with valid information
  When I fill checkout information:
    | First Name | John      |
    | Last Name  | Doe       |
    | Zip Code   | 12345     |
  Then order summary should be visible
  And order summary should show item total "$39.98"
  And order summary should show tax "$3.20"
  And order summary should show total "$43.18"
  When I complete purchase
  Then order confirmation should be visible with message:
    """
    Thank you for your order!
    Your order has been dispatched, and will arrive just as fast as the pony can get there!
    """

  Scenario: Verify order details and return to products
    When I fill checkout information:
      | First Name | Jane      |
      | Last Name  | Smith     |
      | Zip Code   | 67890     |
    Then order summary should be visible
    When I complete purchase
    Then I should be able to return to products 