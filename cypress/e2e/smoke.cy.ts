import { faker } from '@faker-js/faker';

describe('smoke tests', () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it('should allow you to register and login', () => {
    const name = faker.internet.userName();
    const loginForm = {
      name,
      email: `${name}@example.com`,
      password: faker.internet.password()
    };
    cy.then(() => ({ email: loginForm.email })).as('user');

    cy.visitAndCheck('/');
    cy.findByRole('link', { name: /join/i }).click();

    cy.findByRole('textbox', { name: /name/i }).type(loginForm.name);
    cy.findByRole('textbox', { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole('button', { name: /create account/i }).click();

    cy.findByRole('link', { name: /notes/i }).click();
    cy.findByRole('button', { name: /logout/i }).click();
    cy.findByRole('link', { name: /log in/i });
  });
});
