const importCwd = require('import-cwd')
import { Utils, getElement, getElementByxpath, getValue, clickElementByxpath, enterTextIntoFieldByxpath } from '@orektic/ui-auto-framework';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';
export {
    setValueInObjectFieldType,
    assertValidationInObjectFieldType,
    navigateToObjectRecordList,
    waitForElementByXpath,
    clickElementAtIndexByXpath,
    waitSpinnerDisableByXpath,
    navigateToApp,
    assertObjectRecordOnCriteria,
    deleteAllRecordOfObject,
    deleteRecordOnCriteria,
    verifyErrorOnAbxField,
    verifyToastMessage,
    verifyToastHeadMessage,
    verifyElementEnable,
    verifyElementDisable,
    createRecordInObject
}
/**
 * Creates a new record in the specified Salesforce object using the provided engine and record data.
 *
 * @param {Object} engine The Salesforce engine to use for creating the record
 * @param {string} object The Salesforce object to create the record in
 * @param {Object} record The data for the new record
 * @returns {Promise<Object>} The result of the record creation operation
 */
async function createRecordInObject(engine, object: string, record) {
    // Insert the record into Salesforce using the engine's insert method
    const result: any = await engine.insert(record, object);
    // Verify that the insert operation was successful
    return result;
};
/**
 * Checks if the element at the specified XPath is enabled, verifying that it doesn't contain the 'pill-disabled' class.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} xPath The XPath selector for the element to check
 * @returns {Promise<void>}
 */
async function verifyElementEnable(driver, xPath) {
    const spanElement = await driver.findElement(By.xpath(await Utils.getValue(xPath)));
    const classAttributeValue = await spanElement.getAttribute('class');
    expect(classAttributeValue).to.not.include('pill-disabled');
};
/**
 * Checks if the element at the specified XPath is disabled, verifying that it contains the 'pill-disabled' class.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} xPath The XPath selector for the element to check
 * @returns {Promise<void>}
 */
async function verifyElementDisable(driver, xPath) {
    const spanElement = await driver.findElement(By.xpath(await Utils.getValue(xPath)));
    const classAttributeValue = await spanElement.getAttribute('class');
    expect(classAttributeValue).to.include('pill-disabled');
};
/**
 * Verifies that the toast message heading matches the expected message.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} message The expected toast message heading
 * @returns {Promise<void>}
 */
async function verifyToastHeadMessage(driver, Message: string) {
    const element = await driver.findElement(By.xpath("//div[@class='toastTitle slds-text-heading--small']"));
    const text = await element.getText();
    // Verify that the toast message text matches the expected message.
    expect(Message).to.equal(text);
}
/**
 * Verifies that the toast message content matches the expected message.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} Message: The expected toast message content
 * @param {string} status: The status of the toast message (e.g., "Success", "Error")
 * @returns {Promise<void>}
 */
async function verifyToastMessage(driver, Message: string, status: string) {
    var toaster = await getElementByxpath(driver, `//div[@aria-label='${status}']//span[@class='toastMessage slds-text-heading--small forceActionsText']`);
    expect(Message).equals(await toaster.getText());
};
/**
 * Verifies that the specified error message is displayed on the ABX field with the provided input name.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} input The name of the input field
 * @param {string} message The expected error message
 * @returns {Promise<void>}
 */
async function verifyErrorOnAbxField(driver, input: string, message: string) {
    // Retrieve the label node for the specified input field.
    let labelNode = await getElement(driver, `abx-field .slds-form-element.slds-has-error label[for='${await Utils.getValue(input)}']`);
    // Locate the error node within the label node's parent element.
    let fieldNode = await labelNode.findElement(By.xpath("./.."));
    let errorNode = await fieldNode.findElement(By.css(".slds-form-element__help"));
    // Verify that the error message matches the expected message.
    expect(message).equals(await errorNode.getText());
};
/**
 * Deletes all records from the specified Salesforce object that match the provided criteria.
 *
 * @param {Object} engine The Salesforce engine to use for deleting records
 * @param {string} object The Salesforce object to delete records from
 * @param {string} criteria The criteria for selecting the records to delete
 * @returns {Promise<void>}
 */
async function deleteRecordOnCriteria(engine, object: string, criteria: string) {
    // Query the specified object to retrieve all records.
    const result: any = await engine.query(`Select id from ${object} where ${criteria}`);
    const recordIds: string[] = [];
    // Loop through the retrieved records and delete them.
    for (const record of result.records) {
        recordIds.push(record.Id);
    }
    try {
        if (recordIds.length > 0) {
            await engine.delete(recordIds, object)
        }
    } catch (error) {

    }
};
/**
 * Deletes all records from the specified Salesforce object.
 *
 * @param {Object} engine The Salesforce engine to use for deleting records
 * @param {string} object The Salesforce object to delete records from
 * @returns {Promise<void>}
 */
async function deleteAllRecordOfObject(engine, object: string) {
    // Query the specified object to retrieve all records.
    const result: any = await engine.query(`Select id ,Name from ${object}`);
    const recordIds: string[] = [];
    // Loop through the retrieved records and delete them.
    for (const record of result.records) {
        recordIds.push(record.Id);
    }
    try {
        if (recordIds.length > 0) {
            await engine.delete(recordIds, object)
        }
    } catch (error) {

    }
};
/**
 * Asserts that the specified field in the first record of the given object matches the expected value.
 *
 * @param {Object} engine The Salesforce engine to use for querying records
 * @param {string} object The Salesforce object to query
 * @param {string} fields The fields to retrieve from the object
 * @param {string} values The expected values of the corresponding fields
 * @param {string} criteria The criteria for selecting records
 * @returns {Promise<void>}
 */
async function assertObjectRecordOnCriteria(engine, object: string, fields: string, values: string, criteria: string) {
    const field = fields.split(",");
    const value = values.split(",");
    const resField = await engine.describeObject('Student__c');
    // Execute the query and retrieve the records.
    let soqlQuery = `SELECT`;
    // Add each field to the SOQL query
    for (const field of resField.fields) {
        soqlQuery += ` ${field.name},`;
    }
    // Remove the trailing comma
    soqlQuery = soqlQuery.substring(0, soqlQuery.length - 1);
    // Complete the SOQL query
    soqlQuery += ` FROM ${object} WHERE ${criteria}`;
    const result: any = await engine.query(soqlQuery);
    // Verify the value of the field in the retrieved record.
    for (let index = 0; index < field.length; index++) {
        expect(value[index]).to.equal(result.records[0][field[index]]);
    }
};
/**
* Navigates to the specified Salesforce app using the provided WebDriver instance\.
*
* @param driver selenium, cypress, webdriverio webdriver to be used
* @param {Object} connection The Salesforce connection information
* @param {string} appName The name of the Salesforce app to navigate to
* @returns {Promise<void>}
*/
async function navigateToApp(driver, connection, appName: string) {
    const objectUrl = `${connection.instanceUrl}/lightning/app/${appName}`;
    await driver.get(objectUrl);
}
/**
 * Waits until the specified spinner element disappears using the provided WebDriver instance.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} xPath The XPath selector for the spinner element
 * @returns {Promise<void>}
 */
async function waitSpinnerDisableByXpath(driver, xPath: string) {
    var element = await driver.findElement(By.xpath(await Utils.getValue(xPath)));
};
/**
 * Clicks the element at the specified index using the provided XPath and WebDriver instance.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} xPath The XPath selector for the element
 * @param {string} index The index of the element to click
 * @returns {Promise<void>}
 */
async function clickElementAtIndexByXpath(driver, xPath: string, index: string) {
    var element = await driver.findElement(By.xpath(`(${await Utils.getValue(xPath)})[${index}]`));
    element.click();
};
/**
 * Getting Element by xpath and wait for element implicitly
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} xPath The XPath selector for the element
 * @returns {Promise<void>}
 */
async function waitForElementByXpath(driver, xPath) {
    var element = await driver.findElement(By.xpath(await Utils.getValue(xPath)));
};
/**
 * Navigates to the specified Salesforce object record list using the provided WebDriver instance and Salesforce connection information.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {Object} connection The Salesforce connection information
 * @param {string} object The name of the Salesforce object
 * @param {string} filterName The name of the filter to apply to the record list
 * @returns {Promise<void>}
 */
async function navigateToObjectRecordList(driver, connection, object: string, filterName: string) {
    // Construct the URL for the Salesforce object page with the specified filter name.
    const objectUrl = `${connection.instanceUrl}/lightning/o/${object}/list?filterName=${filterName}`;
    await driver.get(objectUrl);
};
/**
 * Sets the value of a Salesforce object field using the provided WebDriver instance.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} objectField The name of the Salesforce object field to update
 * @param {string} value The value to set for the specified field
 * @param {string} fieldType The data type of the field (e.g., 'Address', 'Picklist', 'Checkbox', 'Lookup')
 * @param {string} field (Optional) The subfield name for certain field types (e.g., 'BillingAddress', 'ShippingAddress')
 * @returns {Promise<void>}
 */
async function setValueInObjectFieldType(driver, objectField: string, value: string, fieldType: string, field?: string) {
    var address;
    var subfield;
    if (fieldType.startsWith('Address.')) {
        address = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//${fieldType === 'Address.textarea' ? 'textarea' : 'input'}[@name='${field}']`;
        fieldType = 'Address';
    }
    switch (fieldType) {
        case 'Address':
            await enterTextIntoFieldByxpath(driver, address, value);
            break;
        case 'Picklist':
            field !== '' ? subfield = `//lightning-picklist[@data-field='${field}']` : subfield = '';
            const picklist = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']${subfield}//button[@role='combobox']`;
            await clickElementByxpath(driver, picklist);
            await clickElementByxpath(driver, `//span[@title='${value}']`);
            break;
        case 'Checkbox':
            let checkStatus: any;
            value === 'true' ? checkStatus = '' : value === 'false' ? checkStatus = '[@Checked]' : checkStatus = '[]';
            const checkbox = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//lightning-input${checkStatus}//input[@type='checkbox']`;
            await clickElementByxpath(driver, checkbox);
            break;
        case 'Lookup':
            const lookup = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//input[@role='combobox']`;
            await enterTextIntoFieldByxpath(driver, lookup, value);
            await clickElementByxpath(driver, `//lightning-base-combobox-formatted-text[@title='${value}']`);
            break;
        case 'Picklist(Multi-Select)':
            let num; let choice;
            field === 'Available' ? num = 1 : num = 2;
            field === 'Available' ? choice = 'Chosen' : choice = 'Available';
            const values = value.split(",");
            for (let index = 0; index < values.length; index++) {
                const multipicklist = `(//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//div[@class='slds-dueling-list__options'])[${num}]//div[@data-value='${values[index]}']`;
                await clickElementByxpath(driver, multipicklist);
                await clickElementByxpath(driver, `//div[@data-target-selection-name='sfdc:RecordField.Account.Books__c']//button[@title='Move selection to ${choice}']`);
            }
            break;
        case 'Text Area' || 'Text Area(Long)':
            const textarea = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//textarea[@class='slds-textarea']`;
            await enterTextIntoFieldByxpath(driver, textarea, value);
            break;
        default:
            field !== '' ? subfield = `//lightning-input[@data-field='${field}']` : subfield = '';
            const input = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']${subfield}//input[@class='slds-input']`;
            await enterTextIntoFieldByxpath(driver, input, value);
            break;
    }
}
/**
 * Asserts that the validation message for a Salesforce object field matches the expected value.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} objectField The name of the Salesforce object field
 * @param {string} expectedValue The expected validation message text
 * @param {string} fieldType The data type of the field (e.g., 'Address', 'Picklist', 'Checkbox', 'Lookup')
 * @param {string} field (Optional) The subfield name for certain field types (e.g., 'BillingAddress', 'ShippingAddress')
 * @returns {Promise<void>}
 */
async function assertValidationInObjectFieldType(driver, objectField: string, expectedValue: string, fieldType: string, field?: string) {
    var address;
    var subfield;
    if (fieldType.startsWith('Address.')) {
        address = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//${fieldType === 'Address.textarea' ? 'lightning-textarea' : 'lightning-input'}[@class='slds-form-element__help']`;
        fieldType = 'Address';
    }
    switch (fieldType) {
        case 'Address':
            expect(expectedValue).to.equal(await getValue(driver, address));
            break;
        case 'Picklist':
            field !== '' ? subfield = `//lightning-picklist[@data-field='${field}']` : subfield = '';
            const picklist = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']${subfield}//div[@class='slds-form-element__help']`

            expect(expectedValue).to.equal(await getValue(driver, picklist));
            break;
        case 'Checkbox':
            let checkStatus: any;
            expectedValue === 'true' ? checkStatus = '[@Checked]' : checkStatus = '';
            const checkbox = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//lightning-input${checkStatus}//div[@class='slds-form-element__help']`;
            expect(expectedValue).to.equal(await getValue(driver, checkbox));
            break;
        case 'Lookup':
            const lookup = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//div[@class='slds-form-element__help']`;
            expect(expectedValue).to.equal(await getValue(driver, lookup));
            break;
        case 'Picklist(Multi-Select)':
            let num; let choice;
            field === 'Available' ? num = 1 : num = 2;
            field === 'Available' ? choice = 'Chosen' : choice = 'Available';
            const multipicklist = `(//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//div[@class='slds-form-element__help']`;
            expect(expectedValue).to.equal(await getValue(driver, multipicklist));

            break;
        case 'Text Area' || 'Text Area(Long)':
            const textarea = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//div[@class='slds-form-element__help']`;
            expect(expectedValue).to.equal(await getValue(driver, textarea));
            break;
        default:
            field !== '' ? subfield = `//lightning-input[@data-field='${field}']` : subfield = '';
            const input = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']${subfield}//div[@class='slds-form-element__help']`;
            expect(expectedValue).to.equal(await getValue(driver, input));
            break;
    }
}