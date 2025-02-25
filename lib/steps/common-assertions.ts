const importCwd = require('import-cwd')
const { Then } = importCwd('@cucumber/cucumber');
import { Utils, getElement } from '@orektic/ui-auto-framework';
import { CacheProvider } from '@orektic/sfdc-sdk';
import { expect } from "chai";
import { DataTable } from '@cucumber/cucumber'
import {
    assertValidationInObjectFieldType,
    assertObjectRecordOnCriteria,
    deleteRecordOnCriteria,
    verifyErrorOnAbxField,
    verifyToastMessage,
    verifyToastHeadMessage,
    createRecord,
    getRecordCount,
    getPropertyByPath,
    getRecordCountOnCriteria
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
    let cacheSet = new Set<string>();
    const integerSet = new Set();
    for (const row of dataTable.hashes()) {
        const object = row.object;
        const field = row.fields;
        const value = row.values;
        const criteria = row.criteria;
        if (!CacheProvider.hasCache(`${object}:${criteria}`)) {
            const engine = this.parameters.context.sforce;
            const resField = await engine.describeObject(object)
            let soqlQuery = `SELECT`;
            for (const field of resField.fields) {
                const integerFields=['integer','double'];
                integerFields.includes(field.type)?integerSet.add(field.name):'';
                soqlQuery += ` ${field.name},`;
            }
            soqlQuery = soqlQuery.substring(0, soqlQuery.length - 1);
            soqlQuery += ` FROM ${object} WHERE ${criteria}`;
            const result: any = await engine.query(soqlQuery);
            CacheProvider.setCache(`${object}:${criteria}`, result);
            cacheSet.add(`${object}:${criteria}`);
            if(integerSet.has(field)) {
                const data = getPropertyByPath(result.records[0], field)?.toString();
                expect(value).to.equal(data);
            } else {
                if(value === 'null'){
                    expect(null).to.equal(getPropertyByPath(result.records[0], field));
                }else{
                    expect(value).to.equal(getPropertyByPath(result.records[0], field));
                }  
            }
        }
        else {
            const result = CacheProvider.getCache(`${object}:${criteria}`)
            if (integerSet.has(field)) {
                const data = getPropertyByPath(result.records[0], field)?.toString();
                expect(value).to.equal(data);
            } else {
                if(value === 'null'){
                    expect(null).to.equal(getPropertyByPath(result.records[0], field));
                }else{
                    expect(value).to.equal(getPropertyByPath(result.records[0], field));
                }
            }
        }
    }
    cacheSet.forEach(function (item) {
        CacheProvider.deleteCache(item);
    });
});
/**
* Verifies that a success toast message with the specified text is displayed.
*
* @param {string} description - A description of the step.
* @param {string} message - The expected text of the success toast message.
*/
Then('{string} Verify head success toast message {string}', async function (description: string, message: string) {
    const driver = this.parameters.context.browser;
    await verifyToastHeadMessage(driver, message)
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
Then('{string} Verify error toast message {string}', async function (description: string, message: string) {
    const driver = this.parameters.context.browser;
    await verifyToastMessage(driver, message, 'Error');

});
/**
* Verifies that the displayed success toast message matches the expected success message.
*
* @param {string} description:string A descriptive label for the step.
* @param {string} message:string The expected success message.
*/
Then('{string} Verify success toast message {string}', async function (description, message: string) {
    const driver = this.parameters.context.browser;
    await verifyToastMessage(driver, message, 'Success');
});
/**
* Verifies that the displayed warning message matches the expected warning message.
*
* @param {string} description:string A descriptive label for the step.
* @param {string} message:string The expected warning message.
*/
Then('{string} Verify warning toast message {string}', async function (description: string, message: string) {
    const driver = this.parameters.context.browser;
    await verifyToastMessage(driver, message, 'Warning');
});

Then('{string} Verify {string} object record count {string}', async function (description: string, object: string, xPath:string) {
    const engine = this.parameters.context.sforce;
    const driver = this.parameters.context.browser;
    const getelement = await getElement(driver, await Utils.getValue(xPath));
    const textfromui = await getelement.getText();
    const match = textfromui.match(/\d+/);
    const recordCount = await getRecordCount(engine,object)
    if (match && match.length > 0) {
        const uiCount = parseInt(match[0])
        console.log("Count from UI-->", uiCount);
        console.log("Count from backend-->", recordCount);
        expect(uiCount).to.equal(recordCount)
    }  
});

Then('{string} Verify {string} object record count {string} {string}', async function (description: string, object: string,criteria:string, xPath:string) {
    const engine = this.parameters.context.sforce;
    const driver = this.parameters.context.browser;
    const getelement = await getElement(driver, await Utils.getValue(xPath));
    const textfromui = await getelement.getText();
    const match = textfromui.match(/\d+/);
    const recordCount = await getRecordCountOnCriteria(engine,object,criteria)
    if (match && match.length > 0) {
        const uiCount = parseInt(match[0])
        console.log("Count from UI-->", uiCount);
        console.log("Count from backend-->", recordCount);
        expect(uiCount).to.equal(recordCount)
    } 
});

