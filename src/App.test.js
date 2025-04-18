import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// Test suite - to test form validation
describe("Form validation tests", () => {
  // Before each test render the new account page
  beforeEach(() => {
    render(<App />);
  });

  // Helper function: Fill in the field depending on the label
  const fillField = (labelText, value) => {
    fireEvent.change(screen.getByLabelText(labelText), { target: { value } });
  };

  // Helper function: Click on the submit button
  const clickSubmit = () => {
    fireEvent.click(screen.getByText("SUBMIT"));
  };

  // TEST 1: It should display an error when required fields are left empty
  test("shows error messages when required fields are empty", () => {
    clickSubmit();
    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(
      screen.getByText("Please confirm your password")
    ).toBeInTheDocument();
    expect(screen.getByText("Date of birth is required")).toBeInTheDocument();
  });

  // TEST 2: Should give a warning when an email is entered in an invalid format
  test("shows error for invalid email format", () => {
    fillField("First Name", "John");
    fillField("Last Name", "Doe");
    fillField("E-mail", "john@site"); // missing email domain (eg. .com)
    fillField("Password", "password123");
    fillField("Confirm Password", "password123");
    fillField("Date of Birth (dd/mm/yyyy)", "01/01/2000");
    clickSubmit();
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  // TEST 3: Should give a warning if the passwords dosen't match
  test("shows error when passwords do not match", () => {
    fillField("Password", "password123");
    fillField("Confirm Password", "password321"); // unmatching password
    clickSubmit();
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  // TEST 4: Should give a warning if invalid date format is entered
  test("shows error for invalid date format", () => {
    fillField("Date of Birth (dd/mm/yyyy)", "01-01-2000");
    clickSubmit();
    expect(
      screen.getByText("Date format must be dd/mm/yyyy")
    ).toBeInTheDocument();
  });

  // TEST 5: Should give a warning when out-of-range date is entered
  test("shows error for invalid day in date (boundary)", () => {
    fillField("Date of Birth (dd/mm/yyyy)", "32/01/2000");
    clickSubmit();
    expect(
      screen.getByText("Day must be between 1 and 31")
    ).toBeInTheDocument();
  });

  // TEST 6: Should give a warning when out-of-range date is entered
  test("shows error for invalid day in date (boundary)", () => {
    fillField("Date of Birth (dd/mm/yyyy)", "02/21/2000");
    clickSubmit();
    expect(
      screen.getByText("Month must be between 1 and 12")
    ).toBeInTheDocument();
  });

  // TEST 7: Should give a warning when Fabruary month day limit is exceded
  test("shows error for invalid day in date (boundary)", () => {
    fillField("Date of Birth (dd/mm/yyyy)", "30/02/2000");
    clickSubmit();
    expect(
      screen.getByText("February cannot have more than 29 days")
    ).toBeInTheDocument();
  });

  // TEST 8: Should give a warning if the password is not long enough
  test("shows error when password is less than 8 characters (boundary)", () => {
    fillField("Password", "pass123"); // 7 character
    fillField("Confirm Password", "pass123");
    clickSubmit();
    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  //TEST 9: Should give a warning if the password has no letter or special character
  test("shows error when password lacks letter or special character", () => {
    fillField("Password", "12345678"); // no letter
    fillField("Confirm Password", "12345678");
    clickSubmit();
    expect(
      screen.getByText("Password must contain at least one letter")
    ).toBeInTheDocument();

    fillField("Password", "abcde123"); // letter but no special character
    fillField("Confirm Password", "abcde123");
    clickSubmit();
    expect(
      screen.getByText("Password must contain at least one special character")
    ).toBeInTheDocument();
  });

  // TEST 10: Should give a warning when the fields are left blank
  test("shows error when fields contain only spaces", () => {
    fillField("First Name", "   ");
    fillField("Last Name", "   ");
    fillField("E-mail", "   ");
    fillField("Password", "        ");
    fillField("Confirm Password", "        ");
    fillField("Date of Birth (dd/mm/yyyy)", "   ");
    clickSubmit();
    expect(screen.getByText("First name is required")).toBeInTheDocument();
    expect(screen.getByText("Last name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(
      screen.getByText("Please confirm your password")
    ).toBeInTheDocument();
    expect(screen.getByText("Date of birth is required")).toBeInTheDocument();
  });

  // TEST 11: The form should be sent successfully when all the fields are entered correctly
  test("form submits successfully with valid data", () => {
    fillField("First Name", "Jane");
    fillField("Last Name", "Smith");
    fillField("E-mail", "jane.smith@example.com");
    fillField("Password", "Password@123");
    fillField("Confirm Password", "Password@123");
    fillField("Date of Birth (dd/mm/yyyy)", "01/01/1990");
    clickSubmit();
    expect(
      screen.getByText("Account created successfully!")
    ).toBeInTheDocument();
  });
});