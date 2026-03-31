export class SauceDemoPage {
    // Login Page Elements
    get usernameInput() { return cy.get('[data-test="username"]'); }
    get passwordInput() { return cy.get('[data-test="password"]'); }
    get loginButton() { return cy.get('[data-test="login-button"]'); }
    get errorMessage() { return cy.get('[data-test="error"]'); }

    // Inventory Page Elements
    get title() { return cy.get('.title'); }
    get shoppingCartLink() { return cy.get('.shopping_cart_link'); }
    get inventoryItems() { return cy.get('.inventory_item_name'); }
    get burgerMenuButton() { return cy.get('#react-burger-menu-btn'); }
    get logoutLink() { return cy.get('#logout_sidebar_link'); }

    // Product Elements
    getBackpackAddButton() { return cy.get('[data-test="add-to-cart-sauce-labs-backpack"]'); }
    getBikeLightAddButton() { return cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]'); }

    // Cart Page Elements
    get cartList() { return cy.get('.cart_list'); }
    get checkoutButton() { return cy.get('[data-test="checkout"]'); }

    // Checkout Page Elements
    get firstNameInput() { return cy.get('[data-test="firstName"]'); }
    get lastNameInput() { return cy.get('[data-test="lastName"]'); }
    get postalCodeInput() { return cy.get('[data-test="postalCode"]'); }
    get continueButton() { return cy.get('[data-test="continue"]'); }
    get summaryTotalLabel() { return cy.get('.summary_total_label'); }
    get finishButton() { return cy.get('[data-test="finish"]'); }
    get completeHeader() { return cy.get('.complete-header'); }
    get backToProductsButton() { return cy.get('[data-test="back-to-products"]'); }

    // Page Actions
    visit(url: string = '/') {
        cy.visit(url);
        return this;
    }

    // Login Actions
    login(username: string, password: string) {
        this.usernameInput.type(username);
        this.passwordInput.type(password);
        this.loginButton.click();
        return this;
    }

    // Inventory Actions
    addBackpackToCart() {
        this.getBackpackAddButton().click();
        return this;
    }

    addBikeLightToCart() {
        this.getBikeLightAddButton().click();
        return this;
    }

    goToCart() {
        this.shoppingCartLink.click();
        return this;
    }

    logout() {
        this.burgerMenuButton.click();
        this.logoutLink.click();
        return this;
    }

    // Cart Actions
    proceedToCheckout() {
        this.checkoutButton.click();
        return this;
    }

    // Checkout Actions
    fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        this.firstNameInput.type(firstName);
        this.lastNameInput.type(lastName);
        this.postalCodeInput.type(postalCode);
        return this;
    }

    continueCheckout() {
        this.continueButton.click();
        return this;
    }

    finishCheckout() {
        this.finishButton.click();
        return this;
    }

    goBackToProducts() {
        this.backToProductsButton.click();
        return this;
    }

    // Verification Methods
    verifyLoggedIn() {
        cy.url().should('include', '/inventory.html');
        this.title.should('have.text', 'Products');
        this.shoppingCartLink.should('be.visible');
        return this;
    }

    verifyErrorMessage(expectedMessage: string) {
        this.errorMessage.should('be.visible').and('contain', expectedMessage);
        return this;
    }

    verifyCartContains(productName: string) {
        this.cartList.should('contain', productName);
        return this;
    }

    verifyCheckoutComplete() {
        this.completeHeader.should('have.text', 'Thank you for your order!');
        return this;
    }

    verifyOnInventoryPage() {
        cy.url().should('include', '/inventory.html');
        return this;
    }

    verifyOnLoginPage() {
        this.loginButton.should('be.visible');
        return this;
    }

    verifyCheckoutStepOne() {
        cy.url().should('include', '/checkout-step-one.html');
        return this;
    }

    // Utility Methods
    clearCookiesAndStorage() {
        cy.clearCookies();
        cy.clearLocalStorage();
        return this;
    }
}