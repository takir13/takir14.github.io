/*
 * File: app.js
 * Author: Takirul (100862036)
 * Date completed: February 24, 2024
 * Description: This file contains the main JavaScript code for a web application that allows users
 * to contact and subscribe to a service. It also provides features such as a blog, a portfolio, a gallery,
 * and a contact list. The file uses the core module from core.js and the jQuery and Leaflet libraries.
 */

"use strict";

// IIFE - Immediately Invoked Function Expression.
// AKA - Anonymous Self-Executing Function.
(function(){

    /**
     * CheckLogin function.
     * This function checks if a user is logged in by checking the session storage.
     * If a user is logged in, it changes the login navigation element to logout.
     * It also adds an event listener to the logout button to clear the session storage and redirect to the index page when clicked.
     */
    function CheckLogin() {
        // Check if the user is logged in.
        if(sessionStorage.getItem("user")){
            // Change the login nav element to logout.
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`);

            // Show the username between the Contact Us and Logout buttons.
            $("#login").before(`<li class="nav-item"><a class="nav-link" href="#"><i class="fa-solid fa-user"></i> ${sessionStorage.getItem("user").split(",")[0]}</a></li>`);
        }

        // Add an event listener to the logout button.
        $("#logout").on("click", function(){
            // Clear session storage to perform a logout.
            sessionStorage.clear();

            // Redirect the user to the index.html page after logging out.
            location.href = "index.html";
        });
    }

    /**
     * LoadHeader function.
     * This function loads the header of the webpage.
     * It takes an HTML string as input and sets it as the content of the header element.
     * It also sets the navigation link corresponding to the current page as active and calls the CheckLogin function.
     * @param {string} html_data - The HTML string to be loaded into the header.
     */
    function LoadHeader(html_data)
    {
        // Set the content of the header element.
        $("header").html(html_data);

        // Find the navigation link that corresponds to the current page and set it as active.
        $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");

        // Call the CheckLogin function to update the login/logout link.
        CheckLogin();
    }

    /**
     * AjaxRequest function.
     * This function sends an AJAX request to a specified URL and calls a callback function when the request is successful.
     * It uses the XMLHttpRequest object to send the request.
     * @param {string} method - The HTTP method to use for the request (e.g., "GET", "POST").
     * @param {string} url - The URL to send the request to.
     * @param {function} callback - The function to call when the request is successful. This function takes one parameter: the response text from the server.
     */
    function AjaxRequest(method, url, callback){

        // Step 1: Initialize an XHR object.
        let xhr= new XMLHttpRequest();

        // Step 2: Add an event listener to monitor the readystatechange.
        xhr.addEventListener("readystatechange",()=> {

            // Check if the request is complete and was successful.
            if(xhr.readyState === 4 && xhr.status === 200)
            {
                // Determine if the callback is a function.
                if(typeof callback == "function") {
                    // If the callback is a function, call it with the response text.
                    callback(xhr.responseText);
                }
                else{
                    // If the callback is not a function, log an error.
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
     * ContactFormValidation function.
     * This function validates the contact form by calling the ValidateField function for each form element.
     * It validates the full name, contact number, and email address fields.
     * The validation rules are defined by regular expressions.
     * If a field does not pass validation, an error message is displayed.
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
     * RegistrationFormValidation function.
     * This function validates the contact form by calling the ValidateField function for each form element.
     * It validates the email address and password fields.
     * The validation rules are defined by regular expressions.
     * If a field does not pass validation, an error message is displayed.
     */
    function RegistrationFormValidation(){

        // Email Address Validation.
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]{8,}@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,"Please enter an email address length of 8 characters with an @ symbol.");

        // Password Validation.
        ValidateField("#password", /^.{6,}$/,"Please enter a password length of 6 characters.");
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
     * @param {string} fullName - The full name of the contact.
     * @param {string} contactNumber - The contact number of the contact.
     * @param {string} emailAddress - The email address of the contact.
     */
    function AddContact(fullName, contactNumber, emailAddress){
        // Create a new Contact object.
        let contact = new core.Contact(fullName, contactNumber, emailAddress);

        // Check if the contact can be serialized.
        if(contact.serialize()){
            // Create a unique key for the contact.
            let key = contact.fullName.substring(0,1) + Date.now();

            // Store the serialized contact in localStorage with the generated key.
            localStorage.setItem(key, contact.serialize());
        }
    }

    /**
     * Function that runs when the user is on the home page.
     * This function currently logs a message to the console for debugging purposes.
     */
    function DisplayHomePage(){
        console.log("Home Page");

    }

    /**
     * Function that runs when the user is on the blog page.
     * This function logs a message to the console, fetches blog content from a JSON file,
     * parses the response, and dynamically adds each blog post to the page.
     */
    function DisplayBlogPage()
    {
        console.log("Blog Page");

        // Use AJAX to dynamically load blog content.
        AjaxRequest("GET", "./data/blog.json", (responseText) =>
        {
            // Parse the response in JSON.
            let blogPosts = JSON.parse(responseText);

            // Iterate through the blog posts and attach them to the page.
            blogPosts.forEach(post =>
            {
                // Create a new HTML element for each blog post.
                let postElement =
                    `<div class="post">
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                </div>`;

                // Append the new blog post element to the container on the page.
                $(".container").append(postElement);
            });
        });
    }

    /**
     * Function that runs when the user is on the contact page.
     * This function logs a message to the console, validates the contact form,
     * and sets up an event listener for the submit button. If the subscribe checkbox is checked,
     * it collects the form data and sends an AJAX request to the server.
     */
    function DisplayContactPage(){
        console.log("Contact Us Page");

        // Validate the contact form.
        ContactFormValidation();

        // Get references to the form elements.
        let submitButton = document.getElementById("submitButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        let fullName = document.getElementById("fullName");
        let contactNumber = document.getElementById("contactNumber");
        let emailAddress = document.getElementById("emailAddress");
        let commentArea = document.getElementById("commentArea");
        let experienceRating = document.getElementById("experienceRating");

        // Set up an event listener for the submit button.
        submitButton.addEventListener("click", function(){
            // Check if the subscribe checkbox is checked.
            if(subscribeCheckbox.checked){

                // Prepare the form data for the AJAX request.
                let formData = {
                    "fullName": fullName.value,
                    "contactNumber": contactNumber.value,
                    "emailAddress": emailAddress.value,
                    "commentArea": commentArea.value,
                    "experienceRating": experienceRating.value
                };

                // Execute the AJAX request.
                $.ajax({
                    type: "POST",
                    url: "feedback.php",
                    data: formData
                })
                    .done(function(response) {
                        // This function logs a success message and the server's response to the console.
                        console.log("Successfully submitted feedback form:", response);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        // This function logs an error message and the error details to the console.
                        console.error("Failed to submit feedback form:", textStatus, errorThrown);
                    });
            }
        });
    }

    /**
     * Function that runs when the user is on the contact list page.
     * This function logs a message to the console, checks if there are any contacts in localStorage,
     * and if there are, it creates a table row for each contact and adds it to the contact list on the page.
     * It also sets up event listeners for the add, edit, and delete buttons.
     */
    function DisplayContactListPage(){
        console.log("Contact List Page");

        // Check if there are any contacts in localStorage.
        if(localStorage.length > 0){
            // Get a reference to the contact list element on the page.
            let contactList = document.getElementById("contactList");
            let data = "";

            // Initialize an index for numbering the contacts.
            let index = 1;
            // Get the keys of the contacts in localStorage.
            let keys = Object.keys(localStorage);

            // Iterate over the keys.
            for(const key of keys){
                // Create a new Contact object.
                let contact = new core.Contact();
                // Get the contact data from localStorage.
                let contactData = localStorage.getItem(key);
                // Deserialize the contact data.
                contact.deserialize(contactData);
                // Create a table row for the contact and add it to the data string.
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
                // Increment the index.
                index++;
            }
            // Add the data string to the contact list element.
            contactList.innerHTML = data;
        }

        // Set up jQuery event handlers for the buttons on the contact list page.
        $("#addButton").on("click", () => {
            // When the add button is clicked, redirect to the add contact page.
            location.href = "edit.html#add";
        });

        $("button.edit").on("click", function (){
            // When an edit button is clicked, redirect to the edit contact page for the clicked contact.
            location.href = "edit.html#" + $(this).val();
        });

        $("button.delete").on("click", function (){
            // When a delete button is clicked, confirm the deletion, remove the contact from localStorage if confirmed, and refresh the page.
            if(confirm("Delete contact, are you sure?")){
                localStorage.removeItem($(this).val());
            }
            location.href = "contact-list.html";
        });
    }

    /**
     * Function that runs when the user is on the portfolio page.
     * This function currently logs a message to the console for debugging purposes.
     */
    function DisplayPortfolioPage(){
        console.log("Portfolio Page");

    }

    /**
     * Function that initializes a map on the page.
     * This function creates a map, sets its view to a preferred geographical coordinates and zoom level,
     * adds an OpenStreetMap tile layer to the map, includes a marker in the community center,
     * and adds a circle to represent local facilities.
     */
    function InitializeMap() {
        // Define the map and adjust its view to a preferred geographical coordinates and a zoom level.
        let map = L.map('map').setView([51.505, -0.09], 13);

        // Create an OpenStreetMap tile layer on the map.
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Include a marker in the community centre.
        let marker = L.marker([51.505, -0.09]).addTo(map);
        marker.bindPopup("<b>Harmony Hub Community Center</b>").openPopup();

        // Add a circle to represent local facilities.
        let circle = L.circle([51.505, -0.09], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map);
        circle.bindPopup("Nearby facilities");
    }

    /**
     * Function that runs when the user is on the services page.
     * This function logs a message to the console for debugging purposes and initializes a map on the page.
     */
    function DisplayServicesPage(){
        console.log("Services Page");

        // Initialize a map on the page using the InitializeMap function.
        InitializeMap();
    }

    /**
     * Function that runs when the user is on the edit page.
     * This function logs a message to the console, validates the contact form,
     * and sets up an event listener for the submit and cancel buttons.
     * Depending on the page state (add or edit), it either adds a new contact or updates an existing one.
     */
    function DisplayEditPage(){
        console.log("Edit Page");

        // Validate the contact form.
        ContactFormValidation();

        // Get the page state from the URL hash.
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
                    // Redirect to the contact list page.
                    location.href = "contact-list.html";
                });

                // Set up an event listener for the cancel button to redirect to the contact list page.
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

                // Set up an event listener for the submit button to update the contact and redirect to the contact list page.
                $("#editButton").on("click", (event)=> {
                    // Prevent form submission.
                    event.preventDefault();
                    // Read and store values in the form fields.
                    contact.fullName = $("#fullName").val();
                    contact.contactNumber = $("#contactNumber").val();
                    contact.emailAddress = $("#emailAddress").val();

                    // Serialize the edited contact to create a new key.
                    localStorage.setItem(page, contact.serialize());
                    // Redirect to the contact list page.
                    location.href = "contact-list.html";
                });

                // Set up an event listener for the cancel button to redirect to the contact list page.
                $("#cancelButton").on("click", ()=> {
                    location.href = "contact-list.html";
                });
            }
                break;
        }
    }

    /**
     * Function that runs when the user is on the login page.
     * This function logs a message to the console, sets up an event listener for the login and clear buttons.
     * When the login button is clicked, it checks the entered username and password against a list of users,
     * and if a match is found, it logs the user in and redirects them to the contact list page.
     * If no match is found, it displays an error message.
     * When the clear button is clicked, it resets the form and hides any error messages.
     */
    function DisplayLoginPage(){
        console.log("Login Page");

        let messageArea = $("#messageArea");

        // Set up an event listener for the login button.
        $("#loginButton").on("click", function () {
            // Initialize a flag to indicate whether a matching user was found.
            let success = false;
            // Create a new User object.
            let newUser = new core.User();

            // Read the users.json file.
            $.get("./data/users.json", function(data){
                // Loop through the users in the file.
                for(const user of data.users){
                    // Log the user data to the console for debugging purposes.
                    console.log(user);
                    // Check if the entered username and password match the current user.
                    if(username.value === user.Username && password.value === user.Password)
                    {
                        // If a match is found, populate the newUser object with the user data and set the success flag to true.
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                // If a matching user was found.
                if(success){
                    // Add the user to session storage.
                    sessionStorage.setItem("user", newUser.serialize());
                    // Hide any error messages.
                    messageArea.removeAttr("class").hide();

                    // Confirm the login with the user and, if confirmed, redirect them to the secure area of the site.
                    if(confirm("Welcome back, " + newUser.displayName + "!")) {
                        location.href = "contact-list.html";
                    }
                }else{
                    // If no matching user was found, display an error message.
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Credentials")
                        .show();
                }
            });
        });

        // Set up an event listener for the clear button to reset the form and hide any error messages.
        $("#clearButton").on("click", function () {
            document.forms[0].reset();
            messageArea.removeAttr("class").hide();
        });
    }

    /**
     * DisplayRegisterPage function
     * This function is responsible for displaying the registration page and handling the registration process.
     * It validates the registration form inputs and registers a new user if the inputs are valid.
     */
    function DisplayRegisterPage() {
        console.log("Displaying Register Page");

        // Validate the registration form inputs.
        RegistrationFormValidation();

        let messageArea = $("#messageArea");

        // Get the input elements from the registration form.
        let emailAddress = document.getElementById("emailAddress");
        let username = document.getElementById("username");
        let password = document.getElementById("password");
        let confirmPassword = document.getElementById("confirmPassword");

        // Add a click event listener to the register button.
        $("#registerButton").on("click", (event) => {
            // Check if the email address is at least 8 characters long and the password is at least 6 characters long.
            if (emailAddress.value.length < 8 || password.value.length < 6) {
                // Prevent form submission.
                event.preventDefault();
                messageArea
                    .addClass("alert alert-danger")
                    .text("Error: Email must be at least 8 characters and password must be at least 6 characters.")
                    .show();
            }
            // Check if the password matches the confirm password.
            else if (password.value !== confirmPassword.value) {
                // Prevent form submission.
                event.preventDefault();
                messageArea
                    .addClass("alert alert-danger")
                    .text("Error: Password does not match with Confirm Password.")
                    .show();
            }
            else {
                // Prevent form submission.
                event.preventDefault();

                // Create a new instance of the User class with the input values.
                let user = new core.User("", emailAddress.value, username.value, "");

                // Use the localStorage API to save the user object as a JSON string.
                localStorage.setItem("user", JSON.stringify(user));

                // Redirect to the login page.
                location.href = "login.html";
            }
        });
    }

    /**
     * DisplayTeamPage function
     * This function is responsible for logging a message to the console.
     */
    function DisplayTeamPage() {
        console.log("Team Page");

    }

    /**
     * DisplayEventsPage function
     * This function is responsible for displaying the events page.
     * It uses AJAX to dynamically load the events content from a JSON file.
     * The events data is then parsed and each event is displayed on the page.
     */
    function DisplayEventsPage()
    {
        console.log("Events Page");

        // Use AJAX to dynamically load events content.
        AjaxRequest("GET", "./data/events.json", (responseText) =>
        {
            // Parse the response in JSON.
            let events = JSON.parse(responseText);

            // Iterate through the events' details and attach them to the page.
            events.forEach(event =>
            {
                let eventElement =
                    `<div class="event">
                    <h3>${event.name}</h3>
                    <p>${event.date}</p>
                    <p>${event.location}</p>
                    <p>${event.description}</p>
                </div>`;
                $(".container").append(eventElement);
            });
        });
    }

    /**
     * DisplayGalleryPage function
     * This function is responsible for displaying the gallery page.
     * It uses AJAX to dynamically load the gallery content from a JSON file.
     * The gallery data is then parsed and each image is displayed on the page.
     * After displaying all images, it activates the lightbox plugin script.
     */
    function DisplayGalleryPage()
    {
        console.log("Gallery Page");

        // Use AJAX to dynamically load gallery content.
        AjaxRequest("GET", "./data/gallery.json", (responseText) =>
        {
            // Parse the response in JSON.
            let images = JSON.parse(responseText);

            // Iterate through the images and attach them to the page.
            images.forEach(image =>
            {
                let imageElement =
                    `<div class="col-md-4">
                    <a href="${image.url}" data-lightbox="gallery" data-title="${image.caption}">
                        <img src="${image.url}" alt="${image.caption}" class="img-fluid">
                    </a>
                </div>`;
                $(".container").append(imageElement);
            });

            // Activate the lightbox plugin script.
            $.getScript("./node_modules/lightbox2/dist/js/lightbox.min.js");
        });
    }

    /**
     * Start function
     * This function is responsible for starting the application.
     * It first logs a message to the console, then makes an AJAX request to load the header.
     * After that, it checks the title of the document to determine which page the user is on,
     * and calls the appropriate function to display that page.
     */
    function Start()
    {
        console.log("App Started!");

        // Make an AJAX request to load the header.
        AjaxRequest("GET", "header.html", LoadHeader);

        // Detect what page the user is on based on the HTML title tag.
        switch (document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "Blog":
                DisplayBlogPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
            case "Portfolio":
                DisplayPortfolioPage();
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
            case "Team":
                DisplayTeamPage();
                break;
            case "Events":
                DisplayEventsPage();
                break;
            case "Gallery":
                DisplayGalleryPage();
                break;
        }
    }
    // Add an event listener for the load event of the window, and set the handler to the Start function.
    window.addEventListener("load", Start);

})();