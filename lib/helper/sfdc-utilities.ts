const importCwd = require('import-cwd')
import { Utils, getElement, getValue, clickElement, enterTextIntoField,generateUiTestRunId} from '@orektic/ui-auto-framework';
import { CacheProvider} from '@orektic/sfdc-sdk';
import { expect } from 'chai';
import { By } from 'selenium-webdriver';


/**
 * Creates a new record in the specified Salesforce object using the provided engine and record data.
 *
 * @param {Object} engine The Salesforce engine to use for creating the record
 * @param {string} object The Salesforce object to create the record in
 * @param {Object} record The data for the new record
 * @returns {Promise<Object>} The result of the record creation operation
 */
async function createRecord(engine, object: string, records:any) {
    try {
        const result: any = await engine.insert(records, object);
        console.log('Record creation result:', result); // Log result to inspect
        return result;
    } catch (error) {
        console.error('Error creating record in Salesforce:', error);
        throw error; // Re-throw to propagate the error
    }
};
/**
 * Verifies that the toast message heading matches the expected message.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} message The expected toast message heading
 * @returns {Promise<void>}
 */
async function verifyToastHeadMessage(driver, message: string) {
    const element = await driver.findElement(By.xpath("//div[@class='toastTitle slds-text-heading--small']"));
    const text = await element.getText();
    // Verify that the toast message text matches the expected message.
    expect(message).to.equal(text);
}
/**
 * Verifies that the toast message content matches the expected message.
 *
 * @param driver selenium, cypress, webdriverio webdriver to be used
 * @param {string} message: The expected toast message content
 * @param {string} status: The status of the toast message (e.g., "Success", "Error")
 * @returns {Promise<void>}
 */
async function verifyToastMessage(driver, message: string, status: string) {
    var toaster = await getElement(driver, `//div[@aria-label='${status}']//span[@class='toastMessage slds-text-heading--small forceActionsText']`);
    expect(message).equals(await toaster.getText());
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
    let respones;
    // Loop through the retrieved records and delete them.
    for (const record of result.records) {
        recordIds.push(record.Id);
    }
    try {
        if (recordIds.length > 0) {
            respones=await engine.delete(recordIds, object)
            return respones;
        }
    } catch (error) {
        // respones=error;
        // return respones;
    }
};
/**
 * Deletes all records from the specified Salesforce object.
 *
 * @param {Object} engine The Salesforce engine to use for deleting records
 * @param {string} object The Salesforce object to delete records from
 * @returns {Promise<void>}
 */
async function deleteAllRecord(engine, object: string) {
    // Query the specified object to retrieve all records.
    const result: any = await engine.query(`Select id ,Name from ${object}`);
    let respones;
    const recordIds: string[] = [];
    // Loop through the retrieved records and delete them.
    for (const record of result.records) {
        recordIds.push(record.Id);
    }
    try {
        if (recordIds.length > 0) {
            respones=await engine.delete(recordIds, object)
            return respones;
        }
    } catch (error) {
        respones=error;
        return respones;
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
    const resField = await engine.describeObject(object);
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
            await enterTextIntoField(driver, address, value);
            break;
        case 'Picklist':
            field !== '' ? subfield = `//lightning-picklist[@data-field='${field}']` : subfield = '';
            const picklist = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']${subfield}//button[@role='combobox']`;
            await clickElement(driver, picklist);
            await clickElement(driver, `//span[@title='${value}']`);
            break;
        case 'Checkbox':
            let checkStatus: any;
            value === 'true' ? checkStatus = '' : value === 'false' ? checkStatus = '[@Checked]' : checkStatus = '[]';
            const checkbox = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//lightning-input${checkStatus}//input[@type='checkbox']`;
            await clickElement(driver, checkbox);
            break;
        case 'Lookup':
            const lookup = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//input[@role='combobox']`;
            await enterTextIntoField(driver, lookup, value);
            await clickElement(driver, `//lightning-base-combobox-formatted-text[@title='${value}']`);
            break;
        case 'Picklist(Multi-Select)':
            let num; let choice;
            field === 'Available' ? num = 1 : num = 2;
            field === 'Available' ? choice = 'Chosen' : choice = 'Available';
            const values = value.split(",");
            for (let index = 0; index < values.length; index++) {
                const multipicklist = `(//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//div[@class='slds-dueling-list__options'])[${num}]//div[@data-value='${values[index]}']`;
                await clickElement(driver, multipicklist);
                await clickElement(driver, `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//button[@title='Move selection to ${choice}']`);
            }
            break;
        case 'Text Area' || 'Text Area(Long)':
            const textarea = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//textarea[@class='slds-textarea']`;
            await enterTextIntoField(driver, textarea, value);
            break;
        default:
            field !== '' ? subfield = `//lightning-input[@data-field='${field}']` : subfield = '';
            const input = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']${subfield}//input[@class='slds-input']`;
            await enterTextIntoField(driver, input, value);
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
        address = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//${fieldType === 'Address.textarea' ? 'textarea' : 'input'}[@name='${field}']//..//div[@class='slds-form-element__help']`;
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
            const multipicklist = `//div[@data-target-selection-name='sfdc:RecordField.${objectField}']//div[@class='slds-form-element__help']`;
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
async function getRecordCount(engine,object:string) {
    const testQuery = `SELECT Name FROM ${object}`;
    const result: any = await engine.query(testQuery);
    return result.totalSize;
}
async function getRecordCountOnCriteria (engine,object:string,criteria :string) {
    const testQuery = `SELECT Name FROM ${object} Where ${criteria}`;
    const result: any = await engine.query(testQuery);
    return result.totalSize;
}

function getPropertyByPath(obj, path) {
    const keys = path.split('.');
    let currentObj = obj;
    for (const key of keys) {
        if (currentObj[key] !== undefined) {
            currentObj = currentObj[key];
        } else {
            return undefined; // Property not found
        }
    }
    return currentObj;
}

/**
 * Activates the specified objects and sends the activation request to the UI automation service.
 * 
 * This function generates a ZIP file containing the specified objects, creates a POST request 
 * to activate the objects, and includes the ZIP file content along with the object names in the request body. 
 * It also manages the `UITestRunId` for tracking purposes, either retrieving it from the cache 
 * or generating a new one if not already present.
 * 
 * @param engine - The engine object that handles ZIP file creation and Apex remote call.
 * @param objectsToActivate - A list of object names to be activated by the UI automation service.
 * @returns A Promise that resolves once the activation request is sent.
 */
async function activateObjects(engine, objectsToActivate: any) {
    const headers = {
        'Content-Type': 'application/json',
    };
    const endpoint = '/pwr/ui-automation/activateobject';
    const zip=await engine.createZipFiles(objectsToActivate)
    const method = 'POST';
    const body = {
        "ObjectNames": objectsToActivate,
        "content":zip
    };
    const result: any = await engine.callApexRemote(endpoint, method, body,headers);
}

export {
    getPropertyByPath,
    getRecordCount,
    getRecordCountOnCriteria,
    setValueInObjectFieldType,
    assertValidationInObjectFieldType,
    navigateToObjectRecordList,
    waitSpinnerDisableByXpath,
    navigateToApp,
    assertObjectRecordOnCriteria,
    deleteAllRecord,
    deleteRecordOnCriteria,
    verifyErrorOnAbxField,
    verifyToastMessage,
    verifyToastHeadMessage,
    createRecord,
    activateObjects
}