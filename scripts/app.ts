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
     * Sets up event listener for navigation links found within list items or the unordered list.
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
     * Updates the application current active link, manages authentication and updates the browsers history.
     * Its also updates the navigation UI to reflect the current active link and loads the corresponding content.
     * @param link
     * @param data
     */
    function LoadLink(link: string = "home", data: string = ""): void {

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
        let protected_routes:string[] = ["contact-list", "statistics", "event-planning"];
        if(protected_routes.indexOf(router.ActiveLink) > -1) {
            // Check if user is logged in.
            if(!sessionStorage.getItem("user")){
                // Change active link to login page.
                router.ActiveLink = "login";
                // Show an error message.
                alert("User is not authenticated. Sign in to access this page.");
            }
        }
    }

    function CheckLogin() {
        // Check if the user is logged in.
        if(sessionStorage.getItem("user")) {
            // Change the login nav element to logout.
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-undo"></i> Logout</a>`);

            // Check if the Statistics link already exists to prevent duplication.
            if($("ul.navbar-nav li a[data='statistics']").length === 0) {
                // Add the Statistics link to the navbar for authenticated users.
                let statisticsNavItem = `<li class="nav-item"><a class="nav-link" data="statistics"><i class="fa-solid fa-chart-line"></i> Statistics</a></li>`;
                // Append the Statistics link to the navbar.
                $("ul.navbar-nav").append(statisticsNavItem);
            }

            // Check if the Event Planning link already exists to prevent duplication.
            if($("ul.navbar-nav li a[data='event-planning']").length === 0) {
                // Add the Event Planning link to the navbar for authenticated users.
                let eventPlanningNavItem = `<li class="nav-item"><a class="nav-link" data="event-planning"><i class="fa-solid fa-calendar-plus"></i> Event Planning</a></li>`;
                // Append the Event Planning link to the navbar.
                $("ul.navbar-nav").append(eventPlanningNavItem);
            }

            // Rebind the navigation events to include the new link.
            AddNavigationEvents();
        }

        // Bind the logout event after changing the login/logout link.
        $(document).on("click", "#logout", function() {
            // Perform logout.
            sessionStorage.clear();

            // Swap out the logout link for login.
            $("#login").html(`<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`);

            // Remove the Statistics link if it exists.
            $("li a[data='statistics']").parent().remove();

            // Remove the Event Planning link if it exists.
            $("li a[data='event-planning']").parent().remove();

            // Redirect back to home page with a default 'home' link.
            LoadLink("home");

            // Rebind the navigation events to reflect the changes.
            AddNavigationEvents();
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
    function DisplayHome(){
        console.log("Home");

    }

    function DisplayPortfolio(){
        console.log("Portfolio");

    }

    function DisplayContact(){
        console.log("Contact Us");

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

    function DisplayContactList(){
        console.log("Contact List");

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
            if(confirm("Delete contact, are you sure?")){
                localStorage.removeItem($(this).val() as string);
            }

            // Refresh after deleting.
            LoadLink("contact-list");
        });

    }

    function DisplayTeam(){
        console.log("Team");

    }

    function DisplayBlog(){
        console.log("Blog");

        $("a[data='statistics']").off("click");
        $("a[data='statistics']").on("click", function (){
            LoadLink("statistics");
        });

        $("a[data='event-planning']").off("click");
        $("a[data='event-planning']").on("click", function (){
            LoadLink("event-planning");
        });
    }

    function DisplayServices(){
        console.log("Services");

    }

    function DisplayEdit(){
        console.log("Edit");

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

    function DisplayLogin(){
        console.log("Login");
        AddLinkEvents("register");

        let messageArea = $("#messageArea");

        $("#loginButton").on("click", function () {

            let success = false;
            let newUser = new core.User();

            // Read the users.json file.
            $.get("./data/users.json", function(data){
                // Loop through the users.json file.
                for(const user of data.users){

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
        $("#clearButton").on("click", function () {
            document.forms[0].reset();
            messageArea.removeAttr("class").hide();
            $("#username").trigger("focus").trigger("select");
        });
    }

    function DisplayStatistics(){
        console.log("Statistics");

    }

    function DisplayEventPlanning() {
        console.log("Event Planning");

        // Event interface to define the structure of an event object
        interface IEvent {
            id: string;
            title: string;
            date: string;
            description: string;
        }

        // Array to store events
        let events: IEvent[] = JSON.parse(localStorage.getItem('events') || '[]');

        // Function to add a new event
        function addEvent(title: string, date: string, description: string): void {
            const newEvent: IEvent = {
                id: `event-${Date.now()}`,
                title,
                date,
                description
            };
            events.push(newEvent);
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList();
        }

        // Function to remove an event
        function removeEvent(eventId: string): void {
            events = events.filter(event => event.id !== eventId);
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList();
        }

        // Function to clear all events
        function removeAllEvent(): void {
            events = [];
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList();
        }

        // Function to update the event list in the UI
        function updateEventList(): void {
            const eventListElement = document.getElementById('eventList');
            if (eventListElement) {
                // Clear the current list
                eventListElement.innerHTML = '';
                // Add each event as a list item
                events.forEach(event => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                <h3>${event.title}</h3>
                <p>Date: ${event.date}</p>
                <p>${event.description}</p>
                <button class="btn btn-danger remove-btn" data-event-id="${event.id}">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            `;
                    eventListElement.appendChild(listItem);
                });
            }
        }

        // Event delegation for remove button
        document.getElementById('eventList')?.addEventListener('click', function(event) {
            const target = event.target as HTMLElement;
            if (target.classList.contains('remove-btn')) {
                const eventId = target.getAttribute('data-event-id');
                if (eventId && confirm("Remove event details, are you sure?")) {
                    removeEvent(eventId);
                }
            }
        });

        document.getElementById('removeAllButton')?.addEventListener('click', function() {
            // Check if there are any events to remove
            if (events.length === 0) {
                alert("There are no event details to remove.");
            } else {
                // Ask for confirmation before removing all events
                if (confirm("Remove all event details, are you sure?")) {
                    removeAllEvent();
                }
            }
        });

        // Function to handle the form submission for new events
        function handleEventFormSubmit(event: Event): void {
            event.preventDefault();
            const titleInput = document.getElementById('eventTitle') as HTMLInputElement;
            const dateInput = document.getElementById('eventDate') as HTMLInputElement;
            const descriptionInput = document.getElementById('eventDescription') as HTMLInputElement;

            if (titleInput && dateInput && descriptionInput) {
                addEvent(titleInput.value, dateInput.value, descriptionInput.value);
                titleInput.value = '';
                dateInput.value = '';
                descriptionInput.value = '';
            }
        }

        // Add event listener for the event form submission
        document.getElementById('eventForm')?.addEventListener('submit', handleEventFormSubmit);

        // Initial call to populate the event list
        updateEventList();
    }

    function DisplayRegister(){
        console.log("Register");
        AddLinkEvents("login");
    }

    function Display404(){
        console.log("404");
    }

    function ActiveLinkCallback():Function{
        switch(router.ActiveLink){
            case "home": return DisplayHome;
            case "portfolio": return DisplayPortfolio;
            case "services": return DisplayServices;
            case "team": return DisplayTeam;
            case "blog": return DisplayBlog;
            case "contact": return DisplayContact;
            case "login": return DisplayLogin;
            case "statistics": return DisplayStatistics;
            case "event-planning": return DisplayEventPlanning;
            case "register": return DisplayRegister;
            case "contact-list": return DisplayContactList;
            case "edit": return DisplayEdit;
            case "404": return Display404;
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

})();