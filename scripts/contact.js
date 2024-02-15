"use strict";

(function(core){

    class Contact{

        // Default constructor that also accepts parameters.
        constructor(fullName = "", contactNumber = "", emailAddress = ""){
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        // Setters and Getters.
        get fullName(){
            return this._fullName;
        }

        set fullName(value){
            this._fullName = value;
        }

        get contactNumber(){
            return this._contactNumber;
        }

        set contactNumber(value){
            this._contactNumber = value;
        }

        get emailAddress(){
            return this._emailAddress;
        }

        set emailAddress(value){
            this._emailAddress = value;
        }

        // Display the Contact information.
        toString(){
            return `Full Name: ${this._fullName}\n Contact Number: ${this._contactNumber}\n
            Email Address: ${this._emailAddress}\n`;
        }

        /**
         * Serialize for writing to localStorage.
         * @returns {null|string}
         */
        serialize(){
            if(this._fullName !== "" && this._contactNumber !== "" && this._emailAddress !== ""){
                return `${this.fullName}, ${this.contactNumber}, ${this.emailAddress}`;
            }
            console.error("One or more properties of the Contact are empty or invalid.");
            return null;
        }

        /**
         * Deserialize is used to read data from localStorage.
         * @param data
         */
        deserialize(data){
            let propertyArray = data.split(",");
            this._fullName = propertyArray[0];
            this._contactNumber = propertyArray[1];
            this._emailAddress = propertyArray[2];
        }
    }
    core.Contact = Contact;
})(core || (core = {}));