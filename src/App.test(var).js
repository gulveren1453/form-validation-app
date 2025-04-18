import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';




var firstName = "John";
var lastName = "Doe";
var email = "john@doe";
var password = "password123";
var confPassword = "password123";
var DOB = "02/01/2003";

// Test grubunu başlatıyoruz - form validasyonlarını test ediyoruz
describe('Form validation tests', () => {
  
  // Her testten önce uygulama bileşenini render et
  beforeEach(() => {
    render(<App />);
  });

  // Yardımcı fonksiyon: Label'a göre alanı doldurur
  const fillField = (labelText, value) => {
    fireEvent.change(screen.getByLabelText(labelText), { target: { value } });
  };

  // Yardımcı fonksiyon: Submit butonuna tıklar
  const clickSubmit = () => {
    fireEvent.click(screen.getByText('SUBMIT'));
  };

  // TEST 1: Zorunlu alanlar boş bırakıldığında hata mesajları gösterilmeli
  test('shows error messages when required fields are empty', () => {
    clickSubmit();
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
  });

  // TEST 2: Geçersiz e-posta formatı girildiğinde uyarı vermeli
  test('shows error for invalid email format', () => {
    fillField('First Name', firstName);
    fillField('Last Name', lastName);
    fillField('E-mail', email); // eksik domain uzantısı
    fillField('Password', password);
    fillField('Confirm Password', confPassword);
    fillField('Date of Birth (dd/mm/yyyy)', DOB);
    clickSubmit();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  // TEST 3: Şifreler eşleşmiyorsa uyarı vermeli
  test('shows error when passwords do not match', () => {
    fillField('Password', password);
    fillField('Confirm Password', confPassword); // uyuşmayan şifre
    clickSubmit();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  // TEST 4: Geçersiz tarih formatı (örn: tireyle ayrılmış) girilirse uyarı vermeli
  test('shows error for invalid date format', () => {
    fillField('Date of Birth (dd/mm/yyyy)', DOB);
    clickSubmit();
    expect(screen.getByText('Date format must be dd/mm/yyyy')).toBeInTheDocument();
  });

  // TEST 5: Geçersiz gün sınırı aşıldığında (örn: 32/01/2000) uyarı vermeli
  test('shows error for invalid day in date (boundary)', () => {
    fillField('Date of Birth (dd/mm/yyyy)', DOB);
    clickSubmit();
    expect(screen.getByText('Day must be between 1 and 31')).toBeInTheDocument();
  });

  // TEST 6: Geçersiz ay sınırı aşıldığında (örn: 02/21/2000) uyarı vermeli
  test('shows error for invalid day in date (boundary)', () => {
    fillField('Date of Birth (dd/mm/yyyy)', DOB);
    clickSubmit();
    expect(screen.getByText('Month must be between 1 and 12')).toBeInTheDocument();
  });

  // TEST 7: Şubat ayı için geçersiz gün sınırı aşıldığında (örn: 30/02/2000) uyarı vermeli
  test('shows error for invalid day in date (boundary)', () => {
    fillField('Date of Birth (dd/mm/yyyy)', DOB);
    clickSubmit();
    expect(screen.getByText('February cannot have more than 29 days')).toBeInTheDocument();
  });

  // TEST 8: Şifre 8 karakterden kısa olduğunda uyarı vermeli
  test('shows error when password is less than 8 characters (boundary)', () => {
    fillField('Password', password); // 7 karakter
    fillField('Confirm Password', confPassword);
    clickSubmit();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  //TEST 9: Özel karakter veya harf olmayınca uyarı verir.
  test('shows error when password lacks letter or special character', () => {
    fillField('Password', password);  // Özel karakter yok
    fillField('Confirm Password', confPassword);
    clickSubmit();
    expect(screen.getByText('Password must contain at least one letter')).toBeInTheDocument();
  
    fillField('Password', password); // harf var, özel karakter yok
    fillField('Confirm Password', confPassword);
    clickSubmit();
    expect(screen.getByText('Password must contain at least one special character')).toBeInTheDocument();
  });

  // TEST 10: Alanlara sadece boşluk girildiğinde "boş bırakıldı" uyarısı vermeli
  test('shows error when fields contain only spaces', () => {
    fillField('First Name', '   ');
    fillField('Last Name', '   ');
    fillField('E-mail', '   ');
    fillField('Password', '        ');
    fillField('Confirm Password', '        ');
    fillField('Date of Birth (dd/mm/yyyy)', '   ');
    clickSubmit();
    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
  });

  // TEST 11: Tüm alanlar doğru girildiğinde form başarıyla gönderilmeli
  test('form submits successfully with valid data', () => {
    fillField('First Name', firstName);
    fillField('Last Name', lastName);
    fillField('E-mail', email);
    fillField('Password', password); 
    fillField('Confirm Password', confPasswordn);
    fillField('Date of Birth (dd/mm/yyyy)', DOB);
    clickSubmit();
    expect(screen.getByText('Account created successfully!')).toBeInTheDocument();
  });

});
