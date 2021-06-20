/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App.jsx';

jest.mock('./containers/Home', () => () => 'Home');
jest.mock('./containers/Signup', () => () => 'Signup');
jest.mock('./containers/Login', () => () => 'Login');

test('renders login page on startup', () => {
  render(<App />);
  const loginComponent = screen.getByText('Login');
  expect(loginComponent).toBeInTheDocument();
});
