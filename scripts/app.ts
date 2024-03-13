"use strict";

// IIFE - Immediately Invoked Functional Expression.
(function(){

    /**
     * Binds click, mouseover, and mouseout events to anchor tags with class "link" and a matching
     * data attribute. Applies CSS changes for visual feedback and handles link activation on click.
     * @param link
     */
    function AddLinkEvents(link:string):void {

        let linkQuery = $(`a.link[data=${link}]`);

        // Remove all link events from event queue.
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        // Add css to adjust look of links.
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");

        // Add link events.
        linkQuery.on("click", function(){
            LoadLink(`${link}`);
        });

        linkQuery.on("mouseover", function(){
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });

        linkQuery.on("mouseout", function() {
            $(this).css("font-weight", "normal");
        });

    }

    /**
     * Sets up event listener for navigation links found within list items or the unordered list
     * Removes any existing click and mouseover events before re-establishing new ones to control
     * navigation behaviour and visual cues.
     */
    function AddNavigationEvents():void {

        // Finds all navigation links.
        let navLinks = $("ul>li>a");

        // Remove navigation events - empty event queue.
        navLinks.off("click");
        navLinks.off("mouseover");

        // Loop through and load appropriate content on click.
        navLinks.on("click", function(){
            LoadLink($(this).attr("data") as string);
        });

        // Make navLinks look clickable.
        navLinks.on("mouseover", function(){
            $(this).css("cursor", "pointer");
        });

    }

    /**
     * Updates the application current active link, manages authentication and updates the browsers history
     * Its also updates the navigation UI to reflect the current active link and loads the corresponding content.
     * @param link
     * @param data
     */
    function LoadLink(link:string, data:string = ""): void{

        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;

        // History.pushState --> browser url gets swap/updated.
        history.pushState({}, "", router.ActiveLink);

        // Capitalize the active link and set document title to it.
        document.title = capitalizeFirstCharacter(router.ActiveLink);
        // Remove all active links.
        $("ul>li>a").each( function() {
            $(this).removeClass("active");
        });

        $(`li>a:contains(${document.title})`).addClass("active");

        LoadContent();

    }

    function AuthGuard(): void{
        let protected_routes:string[] = ["contact-list"];
        if(protected_routes.indexOf(router.ActiveLink) > -1) {
            // Check if user is logged in.
            if(!sessionStorage.getItem("user")){
                // Change active link to login page
                router.ActiveLink = "login";
            }
        }
    }

    function CheckLogin(){
        // Change login nav element to logout.
        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-undo"></i> Logout</a>`);
        }

        // When user clicks logout, clear session storage.
        $("#logout").on("click", function(){
            // Perform logout.
            sessionStorage.clear();
            // Swap out the login link for logout.
            $("#login").html(`<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`);

            // Redirect back to home page.
            LoadLink("home");
        });
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
    function ValidateField(input_field_id:string, regular_expression:RegExp, error_message:string){
        let messageArea = $("#messageArea").hide();

        // When the user leaves the full name text box.
        $(input_field_id).on("blur", function (){
            let inputFieldText = $(this).val() as string;

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
    function AddContact(fullName:string, contactNumber:string, emailAddress:string){
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = contact.fullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    // Functions that run when the user is on that page.
    function DisplayHomePage(){
        console.log("Home Page");

        // jQuery code to redirect user when they click the button.
        $("#AboutUsBtn").on("click", () => {
            LoadLink("about");
        });

        // jQuery code to write to the main paragraph.
        $("main").append(`<p id="MainParagraph"
                                class="mt-3">This is my first paragraph</p>`);

        // jQuery code to write to the article paragraph.
        $("main").append(`<article class="container">
                                <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`)

    }

    function DisplayAboutPage(){
        console.log("About Us Page");

        $("#AboutUsBtn").on("click", () => {
            LoadLink("about");
        });
    }

    function DisplayContactPage(){
        console.log("Contact Us Page");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function (){
            LoadLink("contact-list");
        });

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function(){
            if(subscribeCheckbox.checked){

                let fullName:string = document.forms[0].fullName.value;
                let contactNumber:string = document.forms[0].contactNumber.value;
                let emailAddress:string = document.forms[0].emailAddress.value;

                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }

    function DisplayContactListPage(){
        console.log("Contact List Page");

        if(localStorage.length > 0){
            let contactList = document.getElementById("contactList") as HTMLElement;
            let data = "";

            let index = 1;
            let keys = Object.keys(localStorage);

            for(const key of keys){
                let contact = new core.Contact();
                let contactData = localStorage.getItem(key) as string;
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
            LoadLink("edit", "add");
        });

        $("button.edit").on("click", function(){
            LoadLink("edit", $(this).val() as string);
        });

        $("button.delete").on("click", function(){
            if(confirm("Confirm contact Delete?")){
                localStorage.removeItem($(this).val() as string);
            }

            // Refresh after deleting.
            LoadLink("contact-list");
        });

    }

    function DisplayProductPage(){
        console.log("Product Page");

        $("#AboutUsBtn").on("click", ()=> {
            LoadLink("about");
        });
    }

    function DisplayServicesPage(){
        console.log("Services Page");

        $("#AboutUsBtn").on("click", ()=> {
            LoadLink("about");
        });
    }

    function DisplayEditPage(){
        console.log("Edit Page");

        ContactFormValidation();

        //let page = location.hash.substring(1);
        let page = router.LinkData;

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

                    let fullName:string = document.forms[0].fullName.value;
                    let contactNumber:string = document.forms[0].contactNumber.value;
                    let emailAddress:string = document.forms[0].emailAddress.value;

                    AddContact(fullName, contactNumber, emailAddress);
                    LoadLink("contact-list");
                });

                $("#cancelButton").on("click", () => {
                    LoadLink("contact-list");
                });
            }

            break;

            // Edit operation.
            default:
                {
                    // Get the contact info from local storage.
                    let contact = new core.Contact();
                    // Get the key for the contact.
                    contact.deserialize(localStorage.getItem(page) as string);
                    // Display the contact information.
                    $("#fullName").val(contact.fullName);
                    $("#contactNumber").val(contact.contactNumber);
                    $("#emailAddress").val(contact.emailAddress);

                    $("#editButton").on("click", (event)=> {
                        // Prevent form submission.
                        event.preventDefault();
                        // Read and store values in the form fields.
                        contact.fullName = $("#fullName").val() as string;
                        contact.contactNumber = $("#contactNumber").val() as string;
                        contact.emailAddress = $("#emailAddress").val() as string;

                        // Serialize the edited contact to create a new key.
                        localStorage.setItem(page, contact.serialize() as string);
                        LoadLink("contact-list");
                    });

                    $("#cancelButton").on("click", ()=> {
                        LoadLink("contact-list");
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

            // Read the users.json file.
            $.get("./data/users.json", function(data){
                // Loop through the users.json file.
                for(const user of data.users){
                    console.log(user);

                    let username:string = document.forms[0].username.value;
                    let password:string = document.forms[0].password.value;

                    // Check if the username and password.
                    if(username === user.Username && password === user.Password)
                    {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                if(success){
                    // Add user to session storage.
                    sessionStorage.setItem("user", newUser.serialize() as string);
                    messageArea.removeAttr("class").hide();

                    // Redirect user to secure area of the site.
                    LoadLink("contact-list");
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

        // Reset form.
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            LoadLink("home");
        });
    }

    function DisplayRegisterPage(){
        console.log("Register Page");
        AddLinkEvents("login");
    }

    function Display404Page(){
        console.log("404 Page");
    }

    function ActiveLinkCallback():Function{
        switch(router.ActiveLink){
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "products": return DisplayProductPage;
            case "services": return DisplayServicesPage;
            case "register": return DisplayRegisterPage;
            case "login": return DisplayLoginPage;
            case "edit": return DisplayEditPage;
            case "404": return Display404Page;
            default:
                    console.log("ERROR: callback function does not exist " + router.ActiveLink);
                    return new Function();
        }
    }

    function capitalizeFirstCharacter(str:string){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function LoadHeader(){

        $.get("./views/components/header.html", function(html_data)
        {
            $("header").html(html_data);
            document.title = capitalizeFirstCharacter(router.ActiveLink);
            $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");

            AddNavigationEvents();
            CheckLogin();
        });
    }

    function LoadContent(){
        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallback();

        $.get(`./views/content/${page_name}.html`, function(html_data){
            $("main").html(html_data);
            CheckLogin();
            callback();
        });
    }

    function LoadFooter(){
        $.get("./views/components/footer.html", function(html_data){
            $("footer").html(html_data);
        });
    }

    function Start()
    {
        console.log("App Started!");

        LoadHeader();
        LoadLink("home");
        LoadFooter();

    }
    window.addEventListener("load", Start);

})()