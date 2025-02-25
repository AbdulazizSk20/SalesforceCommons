# Salesforce Automation Framework

This framework provides utility functions for Salesforce automation testing across different automation frameworks such as Selenium, Cypress, and WebdriverIO.

## Table of Contents
* [SFDC UI Comman Functions](#sfdc-ui-comman-action-steps)
    * [Record Management Functions](#record-management-functions)
        * [`createRecordInObject`](#createrecordinobject)
        * [`deleteRecordOnCriteria`](#deleterecordoncriteria)
        * [`deleteAllRecordOfObject`](#deleteallrecordofobject)
    * [Actions Functions](#actions-functions)
        * [`navigateToApp`](#navigatetoapp)
        * [`waitSpinnerDisableByXpath`](#waitspinnerdisablebyxpath)
        * [`clickElementAtIndexByXpath`](#clickelementatindexbyxpath)
        * [`waitForElementByXpath`](#waitforelementbyxpath)
        * [`navigateToObjectRecordList`](#navigatetoobjectrecordlist)
        * [`setValueInObjectFieldType`](#setvalueinobjectfieldtype)
    * [Assertions Functions](#assertions-functions)
        * [`verifyElementEnable`](#verifyelementenable)
        * [`verifyElementDisable`](#verifyelementdisable)
        * [`verifyToastHeadMessage`](#verifytoastheadmessage)
        * [`verifyToastMessage`](#verifytoastmessage)
        * [`verifyErrorOnAbxField`](#verifyerroronabxfield)
        * [`assertObjectRecordOnCriteria`](#assertobjectrecordoncriteria)
        * [`assertValidationInObjectFieldType`](#assertvalidationinobjectfieldtype)

 

# SFDC UI Comman Functions


## Record Management Functions

### `createRecordInObject`

- **Description:**
  Creates a new record in the specified Salesforce object using the provided engine and record data.

- **Syntax:**
  ```javascript
  async function createRecordInObject(engine:any, object: string, record:string): Promise<Object>
  ```
  - Parameters:
    1. `{any} engine` - The Salesforce engine to use for creating the record.
    2. `{string} object` - The Salesforce object to create the record in.
    3. `{string} record` - The data for the new record.

### `deleteRecordOnCriteria`

- **Description:**
  Deletes all records from the specified Salesforce object that match the provided criteria.

- **Syntax:**
  ```javascript
  async function deleteRecordOnCriteria(engine:any, object: string, criteria: string): Promise<void>
  ```
  - Parameters:
    1. `{any} engine` - The Salesforce engine to use for deleting records.
    2. `{string} object` - The Salesforce object to delete records from.
    3. `{string} criteria` - The criteria for selecting the records to delete.

### `deleteAllRecordOfObject`

- **Description:**
  Deletes all records from the specified Salesforce object.

- **Syntax:**
  ```javascript
  async function deleteAllRecordOfObject(engine:any, object: string): Promise<void>
  ```
  - Parameters:
    1. `{any} engine` - The Salesforce engine to use for deleting records.
    2. `{string} object` - The Salesforce object to delete records from.

## Actions Functions
### `navigateToApp`

- **Description:**
  Navigates to the specified Salesforce app using the provided WebDriver instance.

- **Syntax:**
  ```javascript
  async function navigateToApp(driver:any, connection: any, appName: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{any} connection` - The Salesforce connection information.
    3.`{string} appName`- The name of the Salesforce app to navigate to.

### `waitSpinnerDisableByXpath`

- **Description:**
  Waits until the specified spinner element disappears using the provided WebDriver instance.

- **Syntax:**
  ```javascript
  async function waitSpinnerDisableByXpath(driver:any, xPath: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} xPath` - The XPath selector for the spinner element.

### `clickElementAtIndexByXpath`

- **Description:**
  Clicks the element at the specified index using the provided XPath and WebDriver instance.

- **Syntax:**
  ```javascript
  async function clickElementAtIndexByXpath(driver:any, xPath: string, index: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} xPath` - The XPath selector for the element.
    3. `{string} index` - The index of the element to click.

### `waitForElementByXpath`

- **Description:**
  Getting Element by XPath and wait for the element implicitly.

- **Syntax:**
  ```javascript
  async function waitForElementByXpath(driver:any, xPath: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} xPath` - The XPath selector for the element.

### `navigateToObjectRecordList`

- **Description:**
  Navigates to the list view of the specified Salesforce object using the provided WebDriver instance.

- **Syntax:**
  ```javascript
  async function navigateToObjectRecordList(driver:any, object: string, listViewName: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} object` - The Salesforce object to navigate to.
    3. `{string} listViewName` - The name of the list view to navigate to.

### `setValueInObjectFieldType`

- **Description:**
  Sets the value in the specified field type of the first record of the given object using the provided WebDriver instance.

- **Syntax:**
  ```javascript
  async function setValueInObjectFieldType(driver:any, object: string, fieldType: string, value): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} object` - The Salesforce object to update.
    3. `{string} feildType` - The type of the field to set (e.g., "input", "dropdown", "checkbox").
    4. `{string} value` - The value to set in the field.


## Assertions Functions

### `verifyElementEnable`

- **Description:**
  Checks if the element at the specified XPath is enabled, verifying that it doesn't contain the 'pill-disabled' class.

- **Syntax:**
  ```javascript
  async function verifyElementEnable(driver:any, xPath: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} xPath` - The XPath selector for the element to check.

### `verifyElementDisable`

- **Description:**
  Checks if the element at the specified XPath is disabled, verifying that it contains the 'pill-disabled' class.

- **Syntax:**
  ```javascript
  async function verifyElementDisable(driver:any, xPath: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} xPath` - The XPath selector for the element to check.

### `verifyToastHeadMessage`

- **Description:**
  Verifies that the toast message heading matches the expected message.

- **Syntax:**
  ```javascript
  async function verifyToastHeadMessage(driver:any, message: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} message` - The expected toast message heading.

### `verifyToastMessage`

- **Description:**
  Verifies that the toast message content matches the expected message.

- **Syntax:**
  ```javascript
  async function verifyToastMessage(driver:any, message: string, status: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} message` - The expected toast message content.
    3. `{string} status` - The status of the toast message (e.g., "Success", "Error").

### `verifyErrorOnAbxField`

- **Description:**
  Verifies that the specified error message is displayed on the ABX field with the provided input name.

- **Syntax:**
  ```javascript
  async function verifyErrorOnAbxField(driver:any, input: string, message: string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} input` - The name of the input field.
    3. `{string} message` - The expected error message.


### `assertObjectRecordOnCriteria`

- **Description:**
  Asserts that the specified field in the first record of the given object matches the expected value.

- **Syntax:**
  ```javascript
  async function assertObjectRecordOnCriteria(engine:any, object: string, fields: string, values: string, criteria:string): Promise<void>
  ```
  - Parameters:
    1. `{any} engine` - The Salesforce engine to use for querying records.
    2. `{string} object` - The Salesforce object to query.
    3. `{string} fields` - The fields to retrieve from the object.
    4. `{string} values` - The expected values of the corresponding fields.
    5. `{string} criteria` - The criteria for selecting records.




### `assertValidationInObjectFieldType`

- **Description:**
  Asserts the validation error message in the specified field type of the first record of the given object using the provided WebDriver instance.

- **Syntax:**
  ```javascript
  async function assertValidationInObjectFieldType(driver:any, object: string, fieldType: string, expectedErrorMessage:string): Promise<void>
  ```
  - Parameters:
    1. `{any} driver` - Selenium, Cypress, or WebdriverIO instance.
    2. `{string} object` - The Salesforce object to validate.
    3. `{string} feildType` - The type of the field to validate (e.g., "input", "dropdown", "checkbox").
    4. `{string} expectedErrorMessage` - The expected validation error message.
    