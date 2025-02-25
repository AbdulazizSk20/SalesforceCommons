## Table of Contents
* [SFDC UI Comman Action Steps](#sfdc-ui-comman-action-steps)
    * [Step Definitions](#action-step-definitions)
        * [Navigation](#navigation)
            * [Go to URL](#go-to-url)
            * [Go to Salesforce Object Page](#go-to-salesforce-object-page)
            * [Go to Lightning App](#go-to-lightning-app)
        * [Element Interaction](#element-interaction)
            * [Click on Element](#click-on-element)
            * [Set Input Value](#set-input-value)
        * [Iframe Management](#iframe-management)
            * [Switch to Iframe](#switch-to-iframe)
            * [Switch to Default Content](#switch-to-default-content)
        * [Waiting](#waiting)
            * [Wait for Element](#wait-for-element)
            * [Wait for spinner disable](#wait-for-spinner-disable)
        * [Salesforce Object Record Page](#salesforce-object-record-page)
            * [Set value in object field](#set-value-in-object-field)
* [SFDC UI Comman Assertion Steps](#sfdc-ui-comman-assertion-steps)
    * [Assertion Step Definitions](#assertion-step-definitions)
        * [Data Verification](#data-verification)
            * [Verify in](#verify-in)
            * [Verify on field](#verify-on-field)
        * [Record Management](#record-management)
            * [Clear all record](#clear-all-record)
            * [Delete record](#delete-record)
            * [Create Record](#create-record)
        * [Error Handling](#error-handling)
            * [Verify error message](#verify-error-message)
            * [Verify toast error](#verify-toast-error)
            * [Verify toast success](#verify-toast-success)
        * [Element Verification](#element-verification)
            * [Verify element disabled](#verify-element-disabled)
            * [Verify Element Enabled](#verify-element-enabled)
        * [Verify validation on object record Page](#verify-validation-on-object-record-page)
            * [Verify validation on field](#verify-validation-on-field)

# SFDC UI Comman Action Steps

## Action Step Definitions

### Navigation

* **Go to URL**
    * **Description:** Navigates to the specified URL using the provided credentials.
    * **Syntax:**
        ```gherkin
        When "{string}" Go to "{string}" as "{string}" user
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.
            2. "{string}" `url`: The URL to navigate to.
            3. "{string}" `credential`: The name of the credential to use for authentication.
* **Go to Salesforce Object Page**
    * **Description:** Navigates to the specified Salesforce object page with the given filter name.
    * **Syntax:**
        ```gherkin
        When "{string}" Go to sobject "{string}" page with list filterName "{string}"
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.
            2. "{string}" `object`: The Salesforce object name.
            3. "{string}" `filterName`: The name of the filter to apply.
* **Go to Lightning App**
    * **Description:** Navigates to the specified Lightning app.
    * **Syntax:**
        ```gherkin
        When "{string}" Go to lightning app "{string}"
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.
            2. "{string}" `appName`: The name of the Lightning app.

### Element Interaction

* **Click on Element**
    * **Description:** Clicks on the element identified by the specified XPath.
    * **Syntax:**
        ```gherkin
        When "{string}" Click on "{string}"
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.
            2. "{string}" `xPath`: The XPath of the element to click.
* **Set Input Value**
    * **Description:** Sets the value of the input field identified by the specified XPath to the given text.
    * **Syntax:**
        ```gherkin
        When "{string}" Set input "{string}" "{string}"
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.
            2. "{string}" `text`: The text to be entered into the input field.
            3. "{string}" `xPath`: The XPath of the input field.

### Iframe Management 

* **Switch to Iframe**
    * **Description:** Switches to the iframe specified by the given xpath and index.
    * **Syntax:**
        ```gherkin
        When "{string}" Switch to iframe "{string}" at index "{string}"
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.
            2. "{string}" `xPath`: The XPath to the iframe element.
            3. "{string}" `index`: The index of the iframe element (0-based).

* **Switch to Default Content**
    * **Description:** Switches the current frame back to the default content.
    * **Syntax:**
        ```gherkin
        When "{string}" Switch iframe to default
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.

### Waiting

* **Wait for Element**
    * **Description:** Waits for the element specified by the given xpath to be visible.
    * **Syntax:**
        ```gherkin
        When "{string}" Wait for element "{string}"
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.
            2. "{string}" `xPath`: The XPath to the element.

* **Wait for Spinner Disable**

    * **Description:** Waits for the spinner element identified by  the specified XPath to disable.
    * **Syntax:**
        ```gherkin
        When "{string}" Wait for spinner disable "{string}"
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the     action being performed. This adds context to the step.
            2. "{string}" `xPath`: The XPath of the spinner element.

### Salesforce Object Record Page

* **Set Value in Object Field**

    * **Description:** Sets the value of a field in an object.
    * **Syntax:**
       ```gherkin
        When <description> Set value in field <objectField> <value> <fieldtype> <field>
        ``````
        - Parameters
            1. "{string}" `description`: A brief description of the action being performed. This adds context to the step.
            2. "{string}" `objectField`: The name of the object field to set the value of.
            3. "{string}" `value`: The value to set the field to.
            4. "{string}" `fieldtype`: The type of the field.
            5. "{string}" `field`: The name of the field.
        ```gherkin
        Ex:- We have to set values on record page of Account Object

        When <description> Set value in field <objectField> <value> <fieldtype> <field>

            | description | objectField                       | field      | fieldtype              | value                                  |
            | description | Account.Rating                    |            | Picklist               | Warm                                   |
            | description | Account.Name                      |            | Text                   | Shubham Navale                         |
            | description | Account.Phone                     |            | Phone                  | 12345678909876                         |
            | description | Account.ParentId                  |            | Lookup                 | shubham Navale                         |
            | description | Account.BillingAddress            | street     | Address.textarea       | Sinhagad housing socity, RX-15         |
            | description | Account.BillingAddress            | city       | Address.text           | Aurangabad                             |
            | description | Account.BillingAddress            | postalCode | Address.number         | 431136                                 |
            | description | Account.BillingAddress            | province   | Address.text           | Maharashtra                            |
            | description | Account.BillingAddress            | country    | Address.text           | India                                  |
            | description | Account.Status__c                 |            | Checkbox               |                                        |
            | description | Account.Books__c                  | Chosen     | Picklist(Multi-Select) | Atmos,Harrey,The Night,Cow Boy,Kingdom |
            | description | Account.isDuplicate__c            |            | Checkbox               |                                        |
        ```

---
# SFDC UI Comman Assertion Steps
---
## Assertion Step Definitions

### Data Verification

* **Verify in**

  * **Description:** Verifies the value of a specific field in a specific object for a given record.

  * **Syntax:**

    ```gherkin
    Then "{string}" Verify in "{string}" of "{string}" value as "{string}" on "{string}"
    ```
    - Parameters

    - "{string}" `description`: A brief description of the step.
    - "{string}" `object`: The name of the Salesforce object.
    - "{string}" `fields`: The name of the field to verify.
    - "{string}" `values`: The expected value of the field.
    - "{string}" `criteria`: The criteria to use for selecting the record to verify.

* **Verify on field**

  * **Description:** Verifies that the specified fields in the given object have the expected values based on the provided criteria.

  * **Syntax:**

    ```gherkin
    Then <description> Verify in <object> of <fields> value as <values> on <criteria>
    ```
    - Parameters

    - `<description>`: A description of the step.
    - `<object>`: The name of the Salesforce object.
    - `<fields>`: A comma-separated list of field names to verify.
    - `<values>`: A comma-separated list of expected field values.
    - `<criteria>`: The criteria to use for selecting the records to verify.

    ```gherkin
    Ex:- We want to verify the data of Student object then

    Then <description> Verify in <object> of <fields> value as <values> on <criteria>

        | description | object     | fields              | values          | criteria         |
        | description | Student__c | Name                | Shaharukh       | Name='Shaharukh' |
        | description | Student__c | Last_Name__c        | khan            | Name='Shaharukh' |
        | description | Student__c | Date_Of_Birth__c    | 1997-03-02      | Name='Shaharukh' |
        | description | Student__c | Email__c            | xyz@enzigma.com | Name='Shaharukh' |
        | description | Student__c | Address__c          | address, xyz    | Name='Shaharukh' |
        | description | Student__c | Legal_First_Name__c | Shaharukh       | Name='Shaharukh' |
        | description | Student__c | Legal_Last_Name__c  | khan            | Name='Shaharukh' |
    
    ```

### Record Management

* **Clear all record**

  * **Description:** Deletes all records from the specified Salesforce object.

  * **Syntax:**

    ```gherkin
    Then "{string}" Clear all record of "{string}"
    ```
    - Parameters

    - "{string}" `description`: A description of the step.
    - "{string}" `object`: The name of the Salesforce object.

* **Delete record**

  * **Description:** Deletes records of the specified object that meet the specified criteria.

  * **Syntax:**

    ```gherkin
    Then "{string}" Delete record of "{string}" on "{string}"
    ```
    - Parameters

    - "{string}" `description`: A description of the step.
    - "{string}" `object`: The name of the object to delete records from.
    - "{string}" `criteria`: The criteria to use for selecting records to delete.

* **Create Record**

    * **Description:** Creates a new record in the specified Salesforce object with the given field values.

    * **Syntax:**

    ```gherkin
    Then "{string}" Create record in "{string}" of "{string}" value as "{string}"
    ```
    - Parameters

        - "{string}" `description`: The description of the test step.
        - "{string}" `object`: The Salesforce object type to create the record in.
        - "{string}" `fields`: A comma-separated list of field names.
        - "{string}" `values`: A comma-separated list of field values.


### Error Handling

* **Verify error message**

  * **Description:** Verifies that an error message is displayed for the specified input field.

  * **Syntax:**

    ```gherkin
    Then "{string}" Error message displays at "{string}" input as "{string}"
    ```
    - Parameters

    - "{string}" `description`: A description of the step.
    - "{string}" `input`: The ID of the input field to check for an error message.
    - "{string}" `message`: The expected error message text.

* **Verify toast error**

  * **Description:** Verifies that the displayed error message matches the expected error message.

  * **Syntax:**

    ```gherkin
    Then "{string}" Verify error message "{string}"
    ```
    - Parameters

    - "{string}" `description`: A descriptive label for the step.
    - "{string}" `message`: The expected error message.

* **Verify toast success**

  * **Description:** Verifies that the displayed success message matches the expected success message.

  * **Syntax:**

    ```gherkin
    Then "{string}" Verify success message "{string}"
    ```
    - Parameters

    - "{string}" `description`: A descriptive label for the step.
    - "{string}" `message`: The expected success message.

### Element Verification

* **Verify element disabled**

    * **Description:** Verifies that the specified element is disabled by checking its class attribute.
    * **Syntax:**

        ```gherkin
        Then "{string}" Verify element disabled "{string}"
        ```
    - Parameters
        - "{string}" `description`: A descriptive label for the step.
        - "{string}" `xPath`: The XPath of the element

* **Verify Element Enabled**

    * **Description:** Verifies that the specified element is enabled by checking its class attribute.

    * **Syntax:**

    ```gherkin
    Then '"{string}" Verify element enabled "{string}"'
    ```
    - Parameters:

        - "{string}" `description`: A descriptive label for the step.
        - "{string}" `xPath`: The XPath of the element to verify.


### Verify validation on object record Page
* **Verify validation on field**
    * **Description:** Verifies that the specified field in the given object has the expected validation based on the provided field type and   expected value.

    * **Syntax:**

    ```gherkin
    Then <description> Verify validation on field <objectField> <field> <fieldtype> <expectedvalue>
    ```
    - Parameters

        - `<description>`: A description of the step.
        - `<objectField>`: The name of the object field to verify.
        - `<field>`: The name of the field to verify.
        - `<fieldtype>`: The type of the field (e.g., text, number, date, checkbox).
        - `<expectedvalue>`: The expected value of the field for validation.
    ```gherkin
    Then <description> Verify validation on field <objectField> <field> <fieldtype> <expectedvalue>

        | description | objectField  | field    | fieldtype | expectedvalue        |
        | description | Lead.Name    | lastName | Text      | Complete this field. |
        | description | Lead.Company |          | Text      | Complete this field. |
        | description | Lead.Status  |          | Picklist  | Complete this field. |
     ```