const importCwd = require('import-cwd')
const { Then } = importCwd('@cucumber/cucumber');
import { Utils, getElement, getElementByxpath } from '@orektic/ui-auto-framework';
import { Engine, CacheProvider } from '@orektic/sfdc-sdk';
import { expect } from "chai";
import { DataTable } from '@cucumber/cucumber'
import {
    assertValidationInObjectFieldType,
    assertObjectRecordOnCriteria,
    setValueInObjectFieldType,
    deleteAllRecordOfObject,
    deleteRecordOnCriteria,
    verifyErrorOnAbxField,
    verifyToastMessage,
    verifyToastHeadMessage,
    verifyElementEnable,
    verifyElementDisable,
    createRecordInObject
} from '../helper/sfdc-utilities';
/**
* This step definition verifies the value of a specific field in a specific object for a given record.
*
* @param {string} description The description of the step.
* @param {string} object The name of the Salesforce object.
* @param {string} field The name of the field to verify.
* @param {string} value The expected value of the field.
*/
Then('{string} Verify in {string} of {string} value as {string} on {string}', async function (description: string, object: string, fields: string, values: string, criteria: string) {
    const engine = this.parameters.context.sforce;
    await assertObjectRecordOnCriteria(engine, object, fields, values, criteria)
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
Then('<description> Verify validation on field <objectField> <field> <fieldtype> <expectedvalue>', async function (dataTable: DataTable) {
    const driver = this.parameters.context.browser;
    for (const row of dataTable.hashes()) {
        const objectField = row.objectField;
        const fieldtype = row.fieldtype;
        const value = row.expectedvalue;
        const field = row.field;
        await assertValidationInObjectFieldType(driver, objectField, value, fieldtype, field);
    }
});
/**
* This step definition verifies that the specified fields in the given object have the expected values based on the provided criteria.
*
* @param {DataTable} dataTable A DataTable containing rows of data to be verified.
*/
Then('<description> Verify in <object> of <fields> value as <values> on <criteria>', async function (dataTable: DataTable) {
    // Iterate through each row of data in the DataTable
    let cacheSet = new Set<string>();
    for (const row of dataTable.hashes()) {
        // console.log(row.fields);
        const object = row.object;
        const field = row.fields;
        const value = row.values;
        const criteria = row.criteria;
        // Check if the cached data for the object and criteria exists
        if (!CacheProvider.hasCache(`${object}:${criteria}`)) {
            // Initialize the Data and Engine objects.
            const engine = this.parameters.context.sforce;
            const resField = await engine.describeObject(object)
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
            CacheProvider.setCache(`${object}:${criteria}`, result);
            cacheSet.add(`${object}:${criteria}`);
            expect(value).to.equal(result.records[0][field]);
        }
        else {
            // Retrieve the cached data
            const result = CacheProvider.getCache(`${object}:${criteria}`)
            expect(value).to.equal(result.records[0][field]);
        }
    }
    cacheSet.forEach(function (item) {
        CacheProvider.deleteCache(item);
    });
});
/**
* This step definition deletes all records from the specified Salesforce object.
*
* @param {string} description The description of the step.
* @param {string} object The name of the Salesforce object.
*/
Then('{string} Clear all record of {string}', async function (description: string, object: string) {
    const engine = this.parameters.context.sforce;
    // Query the specified object to retrieve all records.
    await deleteAllRecordOfObject(engine, object);
});
/**
* Deletes records of the specified object that meet the specified criteria.
*
* @param {string} description - A description of the step.
* @param {string} object - The name of the object to delete records from.
* @param {string} criteria - The criteria to use for selecting records to delete.
*/
Then('{string} Delete record of {string} on {string}', async function (description: string, object: string, criteria: string) {
    const engine = this.parameters.context.sforce;
    // Query the specified object to retrieve all records.
    await deleteRecordOnCriteria(engine, object, criteria);
});
/**
* Verifies that a success toast message with the specified text is displayed.
*
* @param {string} description - A description of the step.
* @param {string} message - The expected text of the success toast message.
*/
Then('{string} Verify head success toast message {string}', async function (description: string, Message: string) {
    const driver = this.parameters.context.browser;
    await verifyToastHeadMessage(driver, Message)
});
/**
* Verifies that an error message is displayed for the specified input field.
*
* @param {string} description - A description of the step.
* @param {string} input - The ID of the input field to check for an error message.
* @param {string} message - The expected error message text.
*/
Then('{string} Error message displays at {string} input as {string}', async function (this, description: string, input: string, message: string) {
    const driver = this.parameters.context.browser;
    await verifyErrorOnAbxField(driver, input, message);
});
/**
* Verifies that the displayed error message matches the expected error message.
*
* @param {string} description:string A descriptive label for the step.
* @param {string} message:string The expected error message.
*/
Then('{string} Verify error toast message {string}', async function (description: string, Message: string) {
    const driver = this.parameters.context.browser;
    await verifyToastMessage(driver, Message, 'Error');

});
/**
* Verifies that the displayed success toast message matches the expected success message.
*
* @param {string} description:string A descriptive label for the step.
* @param {string} message:string The expected success message.
*/
Then('{string} Verify success toast message {string}', async function (description, Message: string) {
    const driver = this.parameters.context.browser;
    await verifyToastMessage(driver, Message, 'Success');
});
/**
* Verifies that the displayed warning message matches the expected warning message.
*
* @param {string} description:string A descriptive label for the step.
* @param {string} message:string The expected warning message.
*/
Then('{string} Verify warning toast message {string}', async function (description: string, Message: string) {
    const driver = this.parameters.context.browser;
    await verifyToastMessage(driver, Message, 'Warning');
});
/**
* Verifies that the specified element is disabled by checking its class attribute.
*
* @param {string} description:string A descriptive label for the step.
* @param {string} xPath:string The XPath of the element to verify.
*/
Then('{string} Verify element disabled {string}', async function (description, xPath) {
    const driver = this.parameters.context.browser;
    await verifyElementDisable(driver, xPath)
})
/**
* Verifies that the specified element is enabled by checking its class attribute.
*
* @param {string} description:string A descriptive label for the step.
* @param {string} xPath:string The XPath of the element to verify.
*/
Then('{string} Verify element enabled {string}', async function (description, xPath) {
    const driver = this.parameters.context.browser;
    await verifyElementEnable(driver, xPath)
});
/**
 * Creates a new record in the specified Salesforce object with the given field values.
 *
 * @param description The description of the test step
 * @param object The Salesforce object type to create the record in
 * @param fields A comma-separated list of field names
 * @param values A comma-separated list of field values
 */
Then('{string} Create record in {string} of {string} value as {string}', async function (description: string, object: string, fields: string, values: string) {
    // Connect to Salesforce using the context's Sforce engine
    const engine = this.parameters.context.sforce;
    // Create an empty record object to store the field values
    const record: { [key: string]: string } = {};
    // Split the fields and values strings into arrays
    const fieldValues = fields.split(',');
    const valueArr = values.split(',');
    // Iterate through the field-value pairs and add them to the record object
    for (let i = 0; i < fieldValues.length; i++) {
        record[fieldValues[i]] = valueArr[i];
    }
    // Insert the record into Salesforce using the engine's insert method
    const result: any = await createRecordInObject(engine, object, record);
    // Verify that the insert operation was successful
    expect(true).to.equal(result.success);
});
/**
 * Creates a new record in the specified Salesforce object with the given field values.
 *
 * @param description The description of the test step
 * @param object The Salesforce object type to create the record in
 * @param recordPath :string The path of the json object record to create.
 */
Then('{string} Create record in {string} {string}', async function (description: string, object: string, recordPath: string) {
    // Connect to Salesforce using the context's Sforce engine and connection
    const engine = this.parameters.context.sforce;
    // Retrieve the record data from the specified path using the Utils class
    const record = await Utils.getValue(recordPath)
    // Retrieve the record data from the specified path using the Utils class
    const result: any = await createRecordInObject(engine, object, record);
    // Verify that the insert operation was successful
    expect(true).to.equal(result.success);
});