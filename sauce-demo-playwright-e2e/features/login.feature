Feature: Login Functionality
  As a user
  I want to be able to log in to the application
  So that I can access my account

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter username "standard_user" and password "secret_sauce"
    And I click the login button
    Then I should be on the "products" page

  Scenario: Login failure with locked out user
    When I enter username "locked_out_user" and password "secret_sauce"
    And I click the login button
    Then I should see a login error message "Epic sadface: Sorry, this user has been locked out."

  Scenario: Login failure with invalid password
    When I enter username "standard_user" and password "wrong_password"
    And I click the login button
    Then I should see a login error message "Epic sadface: Username and password do not match any user in this service" 