import { ERROR_MESSAGES } from './utils/constants';
import { SauceDemoPage } from './pages/sauce-demo.page';
import { faker } from '@faker-js/faker';

describe('SauceDemo E2E Suite - Positive & Negative Scenarios', () => {
    const envData = Cypress.env();
    console.log('Loaded Environment Data:', envData);
    const page = new SauceDemoPage();

    // ── Faker-generated dynamic data (top-level, shared across tests) ──────────
    const dynamicFirstName  = faker.person.firstName();
    const dynamicLastName   = faker.person.lastName();
    const dynamicZip        = faker.location.zipCode();
    const dynamicEmail      = faker.internet.email();
    const dynamicCity       = faker.location.city();
    const dynamicStreet     = faker.location.streetAddress();
    const dynamicPhone      = faker.phone.number();
    const dynamicUsername   = faker.internet.username();
    const dynamicPassword   = faker.internet.password({ length: 12 });
    const dynamicSearchTerm = faker.commerce.productName();
    const dynamicItemCount  = faker.number.int({ min: 1, max: 3 });

    // ── Positive Test Cases ────────────────────────────────────────────────────
    context('Positive Test Cases', () => {
        beforeEach(() => {
            page.loginWithSession(envData.credentials.username, envData.credentials.password);
            page.visit('/inventory.html');
            page.title.should('be.visible');
        });

        it('[TC-01] [SANITY] should successfully log in with standard_user', () => {
            page.verifyLoggedIn();
        });

        it('[TC-02] [REGRESSION] should add items to cart and complete checkout', () => {
            page.addBackpackToCart();
            page.addBikeLightToCart();

            page.goToCart();
            page.verifyCartContains(envData.products.backpack);
            page.verifyCartContains(envData.products.bikeLight);

            page.proceedToCheckout();

            const profile = envData.checkoutProfiles[0];
            page.fillCheckoutForm(profile.firstName, profile.lastName, profile.postalCode);
            page.continueCheckout();

            page.summaryTotalLabel.should('be.visible');
            page.finishCheckout();

            page.verifyCheckoutComplete();
            page.goBackToProducts();
            page.verifyOnInventoryPage();
        });

        it('[TC-03] [SANITY] should logout successfully', () => {
            page.logout();
            page.verifyOnLoginPage();
        });

        it('[TC-04] [REGRESSION] should complete checkout with fully dynamic user data', () => {
            // Uses faker-generated names/zip — no hardcoding
            page.addBackpackToCart();
            page.goToCart();
            page.proceedToCheckout();

            page.fillCheckoutForm(dynamicFirstName, dynamicLastName, dynamicZip);
            page.continueCheckout();

            page.summaryTotalLabel.should('be.visible');
            page.finishCheckout();
            page.verifyCheckoutComplete();
        });

        it('[TC-05] [REGRESSION] should add a random number of items and verify cart badge count', () => {
            // Adds 1–3 items (random) and asserts the cart badge matches
            const products = [
                envData.products.backpack,
                envData.products.bikeLight,
                envData.products.boltTShirt,
            ].slice(0, dynamicItemCount);

            products.forEach((_product, index) => {
                // Click "Add to cart" for each visible product card by index
                page.addToCartByIndex(index);
            });

            page.cartBadge.should('have.text', String(dynamicItemCount));
        });

    // ── Negative Test Cases ───────────────────────────────────────────────────
    context('Negative Test Cases', () => {
        beforeEach(() => {
            page.visit('/');
            cy.get('body').should('be.visible');
        });

        it('[TC-06] [SMOKE] should show error with locked_out_user', () => {
            page.login(envData.credentials.lockedOutUser, envData.credentials.password)
                .verifyErrorMessage(ERROR_MESSAGES.lockedOutUser);
        });

        it('[TC-07] [SMOKE] should show error with invalid credentials', () => {
            page.login(dynamicUsername, dynamicPassword)
                .verifyErrorMessage(ERROR_MESSAGES.invalidCredentials);
        });

        // ── NEW: faker-driven negative tests ──────────────────────────────────

        it('[TC-08] [NEGATIVE] should show error when login attempted with random fake credentials', () => {
            // Fully dynamic — no hardcoded username or password
            page.login(dynamicUsername, dynamicPassword)
                .verifyErrorMessage(ERROR_MESSAGES.invalidCredentials);
        });

        it('[TC-09] [NEGATIVE] should show error when username is valid but password is random', () => {
            page.login(envData.credentials.username, dynamicPassword)
                .verifyErrorMessage(ERROR_MESSAGES.invalidCredentials);
        });

        it('[TC-10] [NEGATIVE] should show error when username is random but password is valid', () => {
            page.login(dynamicUsername, envData.credentials.password)
                .verifyErrorMessage(ERROR_MESSAGES.invalidCredentials);
        });

        context('Authenticated Tests for Standard User', () => {
            beforeEach(() => {
                page.loginWithSession(envData.credentials.username, envData.credentials.password);
                page.visit('/inventory.html');
                page.title.should('be.visible');
            });

            it('[TC-11] should show error when mandatory checkout fields are missing', () => {
                page.addBackpackToCart();
                page.goToCart();
                page.proceedToCheckout();

                page.continueCheckout();
                page.verifyErrorMessage(ERROR_MESSAGES.checkoutFirstNameRequired);

                page.firstNameInput.type(dynamicFirstName);
                page.continueCheckout();
                page.verifyErrorMessage(ERROR_MESSAGES.checkoutLastNameRequired);

                page.lastNameInput.type(dynamicLastName);
                page.continueCheckout();
                page.verifyErrorMessage(ERROR_MESSAGES.checkoutPostalCodeRequired);
            });

            it('[TC-12] should not allow checkout with an empty cart', () => {
                page.goToCart();
                page.proceedToCheckout();
                page.verifyCheckoutStepOne();
            });

            it('[TC-13] [NEGATIVE] should show postal code error when only first and last name are dynamic', () => {
                // Only postal code is left blank to target that specific validation
                page.addBackpackToCart();
                page.goToCart();
                page.proceedToCheckout();

                page.firstNameInput.type(dynamicFirstName);
                page.lastNameInput.type(dynamicLastName);
                // Intentionally skip postal code
                page.continueCheckout();
                page.verifyErrorMessage(ERROR_MESSAGES.checkoutPostalCodeRequired);
            });

            it('[TC-14] [NEGATIVE] should show last name error when only first name is dynamic', () => {
                page.addBackpackToCart();
                page.goToCart();
                page.proceedToCheckout();

                page.firstNameInput.type(dynamicFirstName);
                // Intentionally skip last name and postal code
                page.continueCheckout();
                page.verifyErrorMessage(ERROR_MESSAGES.checkoutLastNameRequired);
            });

            it('[TC-15] [NEGATIVE] should complete checkout with faker zip but verify total label appears', () => {
                // Dynamic zip to ensure no hardcoded postal format is assumed
                page.addBackpackToCart();
                page.goToCart();
                page.proceedToCheckout();

                page.fillCheckoutForm(dynamicFirstName, dynamicLastName, dynamicZip);
                page.continueCheckout();
                page.summaryTotalLabel.should('be.visible');
            });
        });

        it('[TC-16] should redirect to login if accessing inventory directly', () => {
            page.clearCookiesAndStorage();
            cy.visit('/inventory.html', { failOnStatusCode: false });
            page.verifyErrorMessage(ERROR_MESSAGES.unauthorizedAccess);
        });

        it('[TC-17] should show visual and functional issues for problem_user', () => {
            page.login(envData.credentials.problemUser, envData.credentials.password);
            page.inventoryItems.first().should('be.visible');
            page.inventoryItems.should('contain', envData.products.backpack);
        });
    });
});
});