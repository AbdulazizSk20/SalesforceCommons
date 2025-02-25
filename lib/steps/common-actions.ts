const importCwd = require('import-cwd');
const { When } = importCwd('@cucumber/cucumber');
import { Utils, getBrowserFromPool, goToUrl, switchToIframeAtIndex, switchToIframeDefault } from '@orektic/ui-auto-framework';
import { Engine } from '@orektic/sfdc-sdk';
import {
    clickElementAtIndexByXpath,
    navigateToApp,
    navigateToObjectRecordList,
    setValueInObjectFieldType,
    waitForElementByXpath,
    waitSpinnerDisableByXpath
} from '../helper/sfdc-utilities';
import { DataTable } from '@cucumber/cucumber';
/**
 * This step definition navigates to the specified URL using the provided credentials.
 *
 * @param {string} description The description of the step.
 * @param {string} url The URL to navigate to.
 * @param {string} credential The name of the credential to use for authentication.
 */
When('{string} Go to {string} as {string} user', async function (this, description, url, credential) {
    let driver;
    // Check if the credential is the public one.
    if (credential == "public") {
        // Get a browser instance from the pool.
        driver = await getBrowserFromPool(credential);
        // Set the browser context.
        this.parameters.context = {
            browser: driver,
        }
    } else {
        // Retrieve the credential object from the specified credential name.
        let objCredentials: any = await Utils.getValue(credential);
        // Get a browser instance from the pool using the user's username.
        const driver = await getBrowserFromPool(objCredentials.username);
        // Initialize the Salesforce Engine.
        const engine = new Engine(objCredentials.environment);
        //Login using the provided credentials and retrieve the connection.
        const connection: Engine = await engine.login(objCredentials);
        // Retrieve the login URL from the engine.
        let generatedURL = await engine.getLoginUrl();
        // Navigate to the login URL based on the framework.
        await goToUrl(driver, generatedURL);
        // Set the user, browser, Salesforce connection context.
        this.parameters.context = {
            user: objCredentials,
            browser: driver,
            connection: connection,
            sforce: engine
        }
    }
    url = await Utils.getValue(url);
    if (url != '/') {
        await goToUrl(driver, url);
    }
});
/**
* This step definition navigates to the specified Salesforce object page with the given filter name.
*
* @param {string} description The description of the step.
* @param {string} object The Salesforce object name.
* @param {string} filterName The name of the filter to apply.
*/
When('{string} Go to sobject {string} page with list filterName {string}', async function (description, object: string, filterName: string) {
    const driver = this.parameters.context.browser;
    const connection = this.parameters.context.connection;
    // Construct the URL for the Salesforce object page with the specified filter name.
    await navigateToObjectRecordList(driver, connection, object, filterName);
});
/**
* This step definition switches to the iframe specified by the given xpath and index.
*
* @param {string} description The description of the step.
* @param {string} xpath The XPath to the iframe element.
* @param {string} index The index of the iframe element (0-based).
*/
When('{string} Switch to iframe {string} at index {string}', async function (description: string, xPath: string, index: string) {
    const driver = this.parameters.context.browser;
    await switchToIframeAtIndex(driver, xPath, index);
});
/**
* This step definition switches the current frame back to the default content.
*
* @param {string} description The description of the step.
*/
When('{string} Switch iframe to default', async function (description: string) {
    const driver = this.parameters.context.browser;
    await switchToIframeDefault(driver)
});
/**
* This step definition waits for the element specified by the given xpath to be visible.
*
* @param {string} description The description of the step.
* @param {string} xPath The XPath to the element.
*/
When('{string} Wait for element {string}', async function (description: string, xPath: string) {
    const driver = this.parameters.context.browser;
    await waitForElementByXpath(driver, xPath);
});
/**
* This step definition clicks on the element located at the specified index within the given XPath.
*
* @param {string} description The description of the step.
* @param {string} xPath The XPath of the elements.
* @param {string} index The index of the element to click.
*/
When('{string} Click on element {string} at index {string}', async function (description, xPath: string, index: string) {
    const driver = this.parameters.context.browser;
    await clickElementAtIndexByXpath(driver, xPath, index)
});
/**
* This step definition waits for the spinner element identified by the specified XPath to disable.
*
* @param {string} description The description of the step.
* @param {string} xPath The XPath of the spinner element.
*/
When('{string} Wait for spinner disable {string}', async function (description, xPath: string) {
    const driver = this.parameters.context.browser;
    await waitSpinnerDisableByXpath(driver, xPath);
});
/**
* This function sets the value of a field in an object.
*
* @param {DataTable} dataTable The DataTable containing the data.
* @param {string} objectField The name of the object field to set the value of.
* @param {string} value The value to set the field to.
* @param {string} fieldtype The type of the field.
* @param {string} field The name of the field.
*/
When('<description> Set value in field <objectField> <value> <fieldtype> <field>', async function (dataTable: DataTable) {
    const driver = this.parameters.context.browser;
    for (const row of dataTable.hashes()) {
        const objectField = row.objectField;
        const fieldtype = row.fieldtype;
        const value = row.value;
        const field = row.field;
        await setValueInObjectFieldType(driver, objectField, value, fieldtype, field);
    }
});


When('{string} Go to lightning app {string}', async function (description, appName: string) {
    const driver = this.parameters.context.browser;
    const conn = this.parameters.context.connection;
    // Construct the URL for the Salesforce App page with the specified filter name.
    await navigateToApp(driver, conn, appName);
});


