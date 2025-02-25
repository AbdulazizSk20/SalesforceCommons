import { expect } from "chai";
import { Builder, By, Capabilities,Key, WebDriver } from "selenium-webdriver";
import { assertValidationInObjectFieldType, setValueInObjectFieldType, verifyErrorOnAbxField, verifyToastHeadMessage, verifyToastMessage } from "../helper/sfdc-utilities";
let driver: any;
const path = require('path');
const testAllData=require('./data/testData.json')
const testData=testAllData.data;
const xpath=testAllData.xpath;
const testPagePath = path.join(__dirname, 'data/pages', 'testPage.html');
describe("SFDC-Utilities", async function () {
    before(async function () {
        const recordPagePath = path.join(__dirname, 'data/pages', 'recordForm.html');
        let capabilities;
        capabilities = Capabilities.chrome();
        capabilities.set("goog:chromeOptions", {
            args: ["--disable-gpu", "--window-size=1920x1080"], //'--headless',
        });
        driver = await new Builder()
            .forBrowser("Chrome")
            .withCapabilities(capabilities)
            .build();
        await driver.manage().setTimeouts({
            pageLoad: 440000,
            implicit: 90000,
        });
        await driver.get(recordPagePath);
    });

    after(async function () {
        await driver.quit()
    });

    describe("setValueInObjectFieldType function", async function () {
        it('should set value in Account Name text', async function () {
            await setValueInObjectFieldType(driver, testData.text.fieldName,testData.text.value,"Text",'');
            const element = await driver.findElement(By.xpath(xpath.text));
            const actualText = await element.getAttribute('value');
            expect(testData.text.value).to.equal(actualText);
            expect(testData.text.value).to.not.equal('');
        });

        it('should set value in Account Rating picklist', async function () {
            await driver.findElement(By.xpath("//input[@id='picklist']")).click();
            await driver.findElement(By.xpath("//input[@id='picklist']")).sendKeys(" "+Key.BACK_SPACE);
            await setValueInObjectFieldType(driver, testData.picklist.fieldName,testData.picklist.value,"Picklist",'');
            const element = await driver.findElement(By.xpath(xpath.picklist));
            const actualText = await element.getAttribute('value');
            expect(testData.picklist.value).to.equal(actualText);
            expect(testData.picklist.value).to.not.equal('');
        });

        it('should set value in Account Summary textarea', async function () {
            await setValueInObjectFieldType(driver, testData.textarea.fieldName,testData.textarea.value,"Text Area",'');
            const element = await driver.findElement(By.xpath(xpath.textarea));
            const actualText = await element.getAttribute('value');
            expect(testData.textarea.value).to.equal(actualText);
            expect(testData.textarea.value).to.not.equal('');
        });

        it('should click on Account Checkbox checkbox', async function () {
            await setValueInObjectFieldType(driver, testData.checkbox.fieldName,testData.checkbox.value,"Checkbox",'');
        });

        it('should set value in Account BillingAddress street', async function () {
            await setValueInObjectFieldType(driver,  testData.address.fieldName,testData.address.streetValue,"Address.textarea",'street');
            const element = await driver.findElement(By.xpath(xpath.address.streetXpath));
            const actualText = await element.getAttribute('value');
            expect(testData.address.streetValue).to.equal(actualText);
            expect(testData.address.streetValue).to.not.equal('');
        });

        it('should set value in Account BillingAddress city', async function () {
            await setValueInObjectFieldType(driver,  testData.address.fieldName,testData.address.cityValue,"Address.text",'city');
            const element = await driver.findElement(By.xpath(xpath.address.cityXpath));
            const actualText = await element.getAttribute('value');
            expect(testData.address.cityValue).to.equal(actualText);
            expect(testData.address.cityValue).to.not.equal('');
        });

        it('should set value in Account BillingAddress postalCode', async function () {
            await setValueInObjectFieldType(driver,  testData.address.fieldName,testData.address.postalCodeValue,"Address.text",'postalCode');
            const element = await driver.findElement(By.xpath(xpath.address.postalCodeXpath));
            const actualText = await element.getAttribute('value');
            expect(testData.address.postalCodeValue).to.equal(actualText);
            expect(testData.address.postalCodeValue).to.not.equal('');
        });

        it('should set value in Account BillingAddress province', async function () {
            await setValueInObjectFieldType(driver,  testData.address.fieldName,testData.address.stateValue,"Address.text",'province');
            const element = await driver.findElement(By.xpath(xpath.address.stateXpath));
            const actualText = await element.getAttribute('value');
            expect(testData.address.stateValue).to.equal(actualText);
            expect(testData.address.stateValue).to.not.equal('');
        });

        it('should set value in Account BillingAddress country', async function () {
            await setValueInObjectFieldType(driver,  testData.address.fieldName,testData.address.countryValue,"Address.text",'country');
            const element = await driver.findElement(By.xpath(xpath.address.countryXpath));
            const actualText = await element.getAttribute('value');
            expect(testData.address.countryValue).to.equal(actualText);
            expect(testData.address.countryValue).to.not.equal('');
        });

        it('should set value in Account Lookup lookup', async function () {
            await setValueInObjectFieldType(driver, testData.lookup.fieldName,testData.lookup.value,"Lookup",'');
            const element = await driver.findElement(By.xpath(xpath.lookup));
            const actualText = await element.getAttribute('value');
            expect(testData.lookup.value).to.equal(actualText);
            expect(testData.lookup.value).to.not.equal('');
        });

        it('should set value in Account Multipicklist Picklist(Multi-Select)', async function () {
            await setValueInObjectFieldType(driver, testData.multipicklist.fieldName,testData.multipicklist.value,"Picklist(Multi-Select)",testData.multipicklist.choiceValue);
        });

    });

    describe("assertValidationInObjectFieldType function", async function () {

        it('verify validation of Account Name text', async function () {
            await assertValidationInObjectFieldType(driver, testData.text.fieldName,testData.text.validation,"Text",'');
        });

        it('verify validation of Account Rating picklist', async function () {
            await assertValidationInObjectFieldType(driver, testData.picklist.fieldName,testData.picklist.validation,"Picklist",'');
        });

        it('verify validation of Account Summary textarea', async function () {
            await assertValidationInObjectFieldType(driver, testData.textarea.fieldName,testData.textarea.validation,"Text Area",'');
        });

        it('verify validation of Checkbox checkbox', async function () {
            await assertValidationInObjectFieldType(driver, testData.checkbox.fieldName,testData.checkbox.validation,"Checkbox",'');
        });

        it('verify validation of Account BillingAddress street', async function () {
            await assertValidationInObjectFieldType(driver,  testData.address.fieldName,testData.address.streetValidation,"Address.textarea",'street');
        });

        it('verify validation of Account BillingAddress city', async function () {
            await assertValidationInObjectFieldType(driver,  testData.address.fieldName,testData.address.cityValidation,"Address.text",'city');
        });

        it('verify validation of Account BillingAddress state', async function () {
            await assertValidationInObjectFieldType(driver,  testData.address.fieldName,testData.address.stateValidation,"Address.text",'province');
        });

        it('verify validation of Account BillingAddress postal code', async function () {
            await assertValidationInObjectFieldType(driver,  testData.address.fieldName,testData.address.postalCodeValidation,"Address.text",'postalCode');
        });

        it('verify validation of Account BillingAddress country', async function () {
            await assertValidationInObjectFieldType(driver,  testData.address.fieldName,testData.address.countryValidation,"Address.text",'country');
        });

        it('verify validation of Account Lookup lookup', async function () {
            await assertValidationInObjectFieldType(driver, testData.lookup.fieldName,testData.lookup.validation,"Lookup",'');
        });

        it('verify validation of Account Multipicklist Picklist(Multi-Select)', async function () {
            await assertValidationInObjectFieldType(driver, testData.multipicklist.fieldName,testData.multipicklist.validation,"Picklist(Multi-Select)",testData.multipicklist.choiceValue);
        });

    });

    describe("verifyToastMessage and verifyToastHeadMessage function", async function () {
        before(async function () {
            await driver.get(testPagePath);
        });

        it('verify success toast message', async function () {
            await verifyToastMessage(driver, testAllData.tostMessage.success.message,testAllData.tostMessage.success.varient);
        });

        it('verify warning toast message', async function () {
            await verifyToastMessage(driver, testAllData.tostMessage.warning.message,testAllData.tostMessage.warning.varient);
        });

        it('verify error toast message', async function () {
            await verifyToastMessage(driver, testAllData.tostMessage.error.message,testAllData.tostMessage.error.varient);
        });
        it('verify head toast message', async function () {
            await verifyToastHeadMessage(driver,  testAllData.tostMessage.headMessage);
        });
    });

    describe("verifyErrorOnAbxField function", async function () {
        it('verify error on abx field Name', async function () {
            await verifyErrorOnAbxField(driver, testData.abxName.fieldName,testData.abxName.validation);
        });

        it('verify error on abx field Date', async function () {
            await verifyErrorOnAbxField(driver, testData.abxDate.fieldName,testData.abxDate.validation);
        });
    });

});