/*
 * File: user.js
 * Author: Takirul (100862036)
 * Date completed: February 24, 2024
 * Description: This file contains the functions and variables related to the user for the project.
 */

"use strict";

(function(core){

    class User
    {
        // Default constructor that also accepts parameters.
        constructor(displayName = "", emailAddress = "", username = "", password = "") {
            this._displayName = displayName;
            this._emailAddress = emailAddress;
            this._username = username;
            this._password = password;
        }

        // Each property has its own getter and setter.
        get displayName() {
            return this._displayName;
        }

        set displayName(value) {
            this._displayName = value;
        }
        get emailAddress() {
            return this._emailAddress;
        }

        set emailAddress(value) {
            this._emailAddress = value;
        }

        get username() {
            return this._username;
        }

        set username(value) {
            this._username = value;
        }

        // Overridden methods.
        toString(){
            // Returns the user object's string representation.
            return `DisplayName: ${this._displayName}\n 
            EmailAddress: ${this._emailAddress}\n Username: ${this._username}\n`;
        }

        /**
         * Serialize for writing to localStorage.
         * @returns {null|string}
         */
        serialize(){
            // Before serialization, check that all properties are not empty.
            if(this._displayName !== "" && this._emailAddress !== "" && this._username !== "") {
                return `${this._displayName}, ${this._emailAddress}, ${this._username}`;
            }
            console.error("One or more properties of the User are empty or invalid.");
            return null;
        }

        /**
         * Deserialize is used to read data from localStorage.
         * @param data
         */
        deserialize(data){
            // Splits serialized data and assigns it to the appropriate properties.
            let propertyArray = data.split(",");
            this._displayName = propertyArray[0];
            this._emailAddress = propertyArray[1];
            this._username = propertyArray[2];
        }

        toJSON(){
            // Returns the user object's JSON representation.
            return {
                DisplayName : this._displayName,
                EmailAddress : this._emailAddress,
                Username : this._username,
                Password : this._password
            }
        }

        fromJSON(data){
            // Assigns values from the JSON data to their corresponding properties.
            this._displayName = data.DisplayName;
            this._emailAddress = data.EmailAddress;
            this._username = data.Username;
            this._password = data.Password;
        }
    }
    core.User = User;
})(core || (core = {}));