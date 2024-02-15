"use strict";

// IIFE - Immediately Invoked Function Expression.
// AKA - Anonymous Self-Executing Function.
(function(){

    function CheckLogin(){

        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`);
        }

        $("#logout").on("click", function(){
            // Perform logout.
            sessionStorage.clear();

            // Redirect to login.html page.
            location.href = "index.html";
        });
    }

    function LoadHeader(html_data)
    {
        $("header").html(html_data);
        $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
        CheckLogin();
    }

    function AjaxRequest(method, url, callback){

        // Step 1: Initialize an XHR object.
        let xhr= new XMLHttpRequest();

        // Step 2: Add an event listener to monitor the readystatechange.
        xhr.addEventListener("readystatechange",()=> {

            // Check if the event loaded and successful.
            if(xhr.readyState === 4 && xhr.status === 200)
            {
                // Determine if the callback is a function.
                if(typeof callback == "function") {
                    callback(xhr.responseText);
                }
                else{
                    console.error("ERROR: Callback not a function");
                }
            }
        });

        // Step 3: Open a connection to the server.
        xhr.open(method, url);

        // Step 4: Send the request to the server.
        xhr.send();
    }

    /**
     * Function that calls the ValidateField function for each form element.
     */
    function ContactFormValidation(){
        // Full Name Validation.
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,"Please enter a valid first and lastname.");

        // Contact Number Validation.
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,"Please enter a valid contact number.");

        // Email Address Validation.
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,"Please enter a valid email address.");
    }

    /**
     * This function validates input for contact and edit pages.
     * @param {string} input_field_id
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
    function ValidateField(input_field_id, regular_expression, error_message){
        let messageArea = $("#messageArea").hide();

        // When the user leaves the full name text box.
        $(input_field_id).on("blur", function (){
            let inputFieldText = $(this).val();

            // Validation failed.
            if (!regular_expression.test(inputFieldText)){
                // Highlight and display error message.
                $(this).trigger("focus").trigger("select");
                // Daisy chain method calls to addClass, change text and show the element.
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            // Validation passed.
            else{
                messageArea.removeClass("class").hide();
            }
        });
    }

    /**
     * Add a contact to localStorage.
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */

    // Add contact function.
    function AddContact(fullName, contactNumber, emailAddress){
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = contact.fullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }

    // Functions that run when the user is on that page.
    function DisplayHomePage(){
        console.log("Home Page");

        // jQuery code to redirect user when they click the button.
        $("#AboutUsBtn").on("click", () => {
            location.href = "about.html";
        });

        // jQuery code to write to the main paragraph.
        $("main").append(`<p id="MainParagraph"
                                class="mt-3">This is my main paragraph</p>`);

        // jQuery code to write to the article paragraph.
        $("body").append(`<article class="container">
                                <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`)
    }

    function DisplayAboutPage(){
        console.log("About Us Page");

        $("#AboutUsBtn").on("click", () => {
            location.href = "about.html";
        });
    }

    function DisplayContactPage(){
        console.log("Contact Us Page");

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(){
            if(subscribeCheckbox.checked){
                AddContact(fullName.value, contactNumber.value, emailAddress.value);
            }
        });
    }

    function DisplayContactListPage(){
        console.log("Contact List Page");

        if(localStorage.length > 0){
            let contactList = document.getElementById("contactList");
            let data = "";

            let index = 1;
            let keys = Object.keys(localStorage);

            for(const key of keys){
                let contact = new core.Contact();
                let contactData = localStorage.getItem(key);
                contact.deserialize(contactData);
                data += `<tr>
                        <th scope="row" class="text-center">${index}</th>
                        <td>${contact.fullName}</td>
                        <td>${contact.contactNumber}</td>
                        <td>${contact.emailAddress}</td>
                        <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                <i class="fas fa-edit fa-sm"></i> Edit
                            </button>
                        </td>
                        <td class="text-center"> 
                            <button value="${key}" class="btn btn-danger btn-sm delete">
                                <i class="fas fa-trash-alt fa-sm"></i> Delete
                            </button>
                        </td>
                        </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }

        // jQuery event handlers when the buttons are clicked on contact-list.html.
        $("#addButton").on("click", () => {
            location.href = "edit.html#add";
        });

        $("button.edit").on("click", function (){
            location.href = "edit.html#" + $(this).val();
        });

        $("button.delete").on("click", function (){
            if(confirm("Delete contact, are you sure?")){
                localStorage.removeItem($(this).val());
            }
            location.href = "contact-list.html";
        });
    }

    function DisplayProductPage(){
        console.log("Product Page");

        $("#AboutUsBtn").on("click", ()=> {
            location.href = "about.html";
        });
    }

    function DisplayServicesPage(){
        console.log("Services Page");

        $("#AboutUsBtn").on("click", ()=> {
            location.href = "about.html";
        });
    }

    function DisplayEditPage(){
        console.log("Edit Page");

        ContactFormValidation();

        let page = location.hash.substring(1);
        switch (page){
            // Add a new user.
            case "add":
            {
                // Refactor the edit page to an add page.
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fa fa-plus fa-sm"></i> Add`);
                $("#editButton").on("click", (event)=> {
                    // Prevent form submission.
                    event.preventDefault();
                    // Add the new contact, passing the values.
                    AddContact(fullName.value, contactNumber.value, emailAddress.value);
                    location.href = "contact-list.html";
                });

                $("#cancelButton").on("click", () => {
                    location.href = "contact-list.html";
                });
            }
                break;

            // Edit operation.
            default:
                {
                    // Get the contact info from local storage.
                    let contact = new core.Contact();
                    // Get the key for the contact.
                    contact.deserialize(localStorage.getItem(page));
                    // Display the contact information.
                    $("#fullName").val(contact.fullName);
                    $("#contactNumber").val(contact.contactNumber);
                    $("#emailAddress").val(contact.emailAddress);

                    $("#editButton").on("click", (event)=> {
                        // Prevent form submission.
                        event.preventDefault();
                        // Read and store values in the form fields.
                        contact.fullName = $("#fullName").val();
                        contact.contactNumber = $("#contactNumber").val();
                        contact.emailAddress = $("#emailAddress").val();

                        // Serialize the edited contact to create a new key.
                        localStorage.setItem(page, contact.serialize());
                        location.href = "contact-list.html";
                    });

                    $("#cancelButton").on("click", ()=> {
                        location.href = "contact-list.html";
                    });
                }
                break;
        }
    }

    function DisplayLoginPage(){
        console.log("Login Page");

        let messageArea = $("#messageArea");

        $("#loginButton").on("click", function () {

            let success = false;
            let newUser = new core.User();

            $.get( "./data/users.json", function (data){

                for(const user of data.users){

                    console.log(user);
                    // Check if the username and password.
                    if(username.value === user.Username && password.value === user.Password)
                    {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                if(success){
                    // Add user to session storage.
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();

                    // Redirect user to secure area of the site.
                    location.href = "contact-list.html";
                }else{
                    // They do not match.
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Credentials")
                        .show();
                }
            });
        });

        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            location.href = "index.html";
        });

    }

    function DisplayRegisterPage(){
        console.log("Register Page");

    }

    function Start()
    {
        console.log("App Started!");

        AjaxRequest("GET", "header.html", LoadHeader);

        // Detect what page the user is on based on the HTML title tag.
        switch (document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "About Us":
                DisplayAboutPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
            case "Products":
                DisplayProductPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
        }
    }
    window.addEventListener("load", Start);

})();