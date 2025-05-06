import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Form validation tests", () => {
  beforeEach(() => {
    render(<App />);
  });


  const fillField = (labelText, value) => {
    fireEvent.change(screen.getByLabelText(labelText), { target: { value } });
  };


  const clickSubmit = () => {
    fireEvent.click(screen.getByText("SUBMIT"));
  };
//boş bırakılınca hata verecek
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

  // mail uzantısı eksik olunca hata verecek
  test("shows error for invalid email format", () => {
    fillField("First Name", "Ali");
    fillField("Last Name", "Veli");
    fillField("E-mail", "ali@veli"); 
    fillField("Password", "password123");
    fillField("Confirm Password", "password123");
    fillField("Date of Birth (dd/mm/yyyy)", "01/01/2000");
    clickSubmit();
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  // eşleşip eşleşmediğine bakıyor
  test("shows error when passwords do not match", () => {
    fillField("Password", "password123");
    fillField("Confirm Password", "password321"); 
    clickSubmit();
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  // - ile giriş yapınca hata veriyor
  test("shows error for invalid date format", () => {
    fillField("Date of Birth (dd/mm/yyyy)", "01-01-2000");
    clickSubmit();
    expect(
      screen.getByText("Date format must be dd/mm/yyyy")
    ).toBeInTheDocument();
  });

  // gün 1-31 arasında olur
  test("shows error for invalid day in date (boundary)", () => {
    fillField("Date of Birth (dd/mm/yyyy)", "32/01/2000");
    clickSubmit();
    expect(
      screen.getByText("Day must be between 1 and 31")
    ).toBeInTheDocument();
  });

  // ay 1-12 arasında
  test("shows error for invalid day in date (boundary)", () => {
    fillField("Date of Birth (dd/mm/yyyy)", "01/13/2000");
    clickSubmit();
    expect(
      screen.getByText("Month must be between 1 and 12")
    ).toBeInTheDocument();
  });

  // en az 8 karakter olmalı
  test("shows error when password is less than 8 characters (boundary)", () => {
    fillField("Password", "pass123"); 
    fillField("Confirm Password", "pass123");
    clickSubmit();
    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  // hem harf hem özel karakter isteği
  test("shows error when password lacks letter or special character", () => {
    fillField("Password", "12345678");
    fillField("Confirm Password", "12345678");
    clickSubmit();
    expect(
      screen.getByText("Password must contain at least one letter")
    ).toBeInTheDocument();

    fillField("Password", "abcde123");
    fillField("Confirm Password", "abcde123");
    clickSubmit();
    expect(
      screen.getByText("Password must contain at least one special character")
    ).toBeInTheDocument();
  });


  // her şeyin doğru girilmesi
  test("form submits successfully with valid data", () => {
    fillField("First Name", "Ali");
    fillField("Last Name", "Veli");
    fillField("E-mail", "ali.veli@example.com");
    fillField("Password", "Password@123");
    fillField("Confirm Password", "Password@123");
    fillField("Date of Birth (dd/mm/yyyy)", "01/01/2000");
    clickSubmit();
    expect(
      screen.getByText("Account created successfully!")
    ).toBeInTheDocument();
  });
});