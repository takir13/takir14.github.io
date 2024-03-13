"use strict";

namespace core {

    export class User {

        private _displayName:string;

        private _emailAddress:string;

        private _username:string;

        private _password:string;

        // Default constructor that also accepts parameters.
        constructor(displayName:string = "", emailAddress:string = "",
                    username:string = "", password:string = "") {
            this._displayName = displayName;
            this._emailAddress = emailAddress;
            this._username = username;
            this._password = password;
        }

        public get displayName():string {
            return this._displayName;
        }

        public set displayName(value:string) {
            this._displayName = value;
        }
        public get emailAddress():string {
            return this._emailAddress;
        }

        public set emailAddress(value:string) {
            this._emailAddress = value;
        }

        public get username():string {
            return this._username;
        }

        public set username(value:string) {
            this._username = value;
        }

        public get password():string {
            return this._password;
        }

        public set password(value:string) {
            this._password = value;
        }

        // Overridden methods.
        public toString():string {
            return `DisplayName: ${this._displayName}\n 
            EmailAddress: ${this._emailAddress}\n Username: ${this._username}\n`;
        }

        /**
         * Serialize for writing to localStorage.
         * @returns {null|string}
         */
        public serialize():string|null {
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
        public deserialize(data:string) {
            let propertyArray = data.split(",");
            this._displayName = propertyArray[0];
            this._emailAddress = propertyArray[1];
            this._username = propertyArray[2];
        }

        public toJSON() : {DisplayName:string; EmailAddress:string; Username:string} {
            return {
                DisplayName : this._displayName,
                EmailAddress : this._emailAddress,
                Username : this._username
            }
        }

        public fromJSON(data:User){
            this._displayName = data.displayName;
            this._emailAddress = data.emailAddress;
            this._username = data.username;
            this._password = data.password;
        }
    }

}