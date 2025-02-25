const importCwd = require('import-cwd');
const { When } = importCwd('@cucumber/cucumber');
import { Utils, getBrowserFromPool, goToUrl, switchToIframeAtIndex, switchToIframeDefault,generateUiTestRunId } from '@orektic/ui-auto-framework';
import { CacheProvider, Engine } from '@orektic/sfdc-sdk';
import {
    createRecord,
    deleteAllRecord,
    deleteRecordOnCriteria,
    navigateToApp,
    navigateToObjectRecordList,
    setValueInObjectFieldType,
    waitSpinnerDisableByXpath,
    activateObjects
} from '../helper/sfdc-utilities';
import { DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { eventBus } from '../helper/eventbus';
/**
 * This step definition navigates to the specified URL using the provided credentials.
 *
 * @param {string} description The description of the step.
 * @param {string} url The URL to navigate to.
 * @param {string} credential The name of the credential to use for authentication.
 */
When('{string} Go to {string} as {string} user', async function (this, description, url, credential) {
    let driver;
    let UITestRunId;
    if (credential == "public") {
        driver = await getBrowserFromPool(credential);
        this.parameters.context = {
            browser: driver,
        }
    } else {
        let objCredentials: any = await Utils.getValue(credential);
        const driver = await getBrowserFromPool(objCredentials.username);
        const engine = new Engine(objCredentials.environment);
        const connection: Engine = await engine.login(objCredentials);
        let generatedURL = await engine.getLoginUrl();
        await goToUrl(driver, generatedURL);
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
    UITestRunId= await generateUiTestRunId();
    eventBus.emit('uitestrunid', UITestRunId);
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
    await navigateToObjectRecordList(driver, connection, object, filterName);
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
/**
 * Navigates to the specified Lightning app in Salesforce based on the given description.
 * 
 * @param {string} description - Description of the step.
 * @param {string} appName - Name of the Lightning app to navigate to.
 */
When('{string} Go to lightning app {string}', async function (description, appName: string) {
    const driver = this.parameters.context.browser;
    const conn = this.parameters.context.connection;
    await navigateToApp(driver, conn, appName);
});

/**
* This step definition deletes all records from the specified Salesforce object.
*
* @param {string} description The description of the step.
* @param {string} object The name of the Salesforce object.
*/
When('{string} Clear all record of {string}', async function (description: string, object: string) {
    const engine = this.parameters.context.sforce;
    const result=await deleteAllRecord(engine, object);
    expect(result.success).to.equal(true);
});
/**
* Deletes records of the specified object that meet the specified criteria.
*
* @param {string} description - A description of the step.
* @param {string} object - The name of the object to delete records from.
* @param {string} criteria - The criteria to use for selecting records to delete.
*/
When('{string} Delete record of {string} on {string}', async function (description: string, object: string, criteria: string) {
    const engine = this.parameters.context.sforce;
    const result=await deleteRecordOnCriteria(engine, object, criteria);
});
/**
 * Creates a new record in the specified Salesforce object with the given field values.
 *
 * @param description The description of the test step
 * @param object The Salesforce object type to create the record in
 * @param fields A comma-separated list of field names
 * @param values A comma-separated list of field values
 */
When('{string} Create record in {string} of {string} value as {string}', async function (description: string, object: string, fields: string, values: string) {
    const engine = this.parameters.context.sforce;
    const record: { [key: string]: string } = {};
    let fieldValues = fields.split(',');
    let valueArr = values.split(',');
    for (let i = 0; i < fieldValues.length; i++) {
        record[fieldValues[i]] = valueArr[i];
    }
    const result: any = await createRecord(engine, object, record);
});
/**
 * Creates a new record in the specified Salesforce object with the given field values.
 *
 * @param description The description of the test step
 * @param object The Salesforce object type to create the record in
 * @param recordPath :string The path of the json object record to create.
 */
When('{string} Create record in {string} {string}', async function (description: string, object: string, recordPath: string) {
    const engine = this.parameters.context.sforce;
    let record = await Utils.getValue(recordPath);

    try {
        const result: any = await createRecord(engine, object, record);
        console.log('Record creation result:', result); // Debugging log
        result.forEach(r => {
            expect(r.success).to.equal(true, `Error: ${JSON.stringify(r.errors)}`);
        });
    } catch (error) {
        console.error('Error during record creation:', error.message);
        throw new Error(error.message); // Fail the step with the error message
    }
});

When('{string} Activate objects for test automation {string}', async function (description: string, objects: string) {
    const engine = this.parameters.context.sforce;
    const objectsToActivate = await Utils.getValue(objects);
    await activateObjects(engine, objectsToActivate);
});

When('{string} Cleanup Test data {string}', async function (description: string, objects: string) {
    const engine = this.parameters.context.sforce;
    const objectsToActivate = await Utils.getValue(objects); 
    await engine.cleanupTestData(engine, objectsToActivate);
});
