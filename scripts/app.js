"use strict";
(function () {
    function AddLinkEvents(link) {
        let linkQuery = $(`a.link[data=${link}]`);
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");
        linkQuery.on("click", function () {
            LoadLink(`${link}`);
        });
        linkQuery.on("mouseover", function () {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });
        linkQuery.on("mouseout", function () {
            $(this).css("font-weight", "normal");
        });
    }
    function AddNavigationEvents() {
        let navLinks = $("ul>li>a");
        navLinks.off("click");
        navLinks.off("mouseover");
        navLinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        navLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function LoadLink(link = "home", data = "") {
        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = capitalizeFirstCharacter(router.ActiveLink);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $(`li>a:contains(${document.title})`).addClass("active");
        LoadContent();
    }
    function AuthGuard() {
        let protected_routes = ["contact-list", "statistics", "event-planning"];
        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                router.ActiveLink = "login";
                alert("User is not authenticated. Sign in to access this page.");
            }
        }
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-undo"></i> Logout</a>`);
            if ($("ul.navbar-nav li a[data='statistics']").length === 0) {
                let statisticsNavItem = `<li class="nav-item"><a class="nav-link" data="statistics"><i class="fa-solid fa-chart-line"></i> Statistics</a></li>`;
                $("ul.navbar-nav").append(statisticsNavItem);
            }
            if ($("ul.navbar-nav li a[data='event-planning']").length === 0) {
                let eventPlanningNavItem = `<li class="nav-item"><a class="nav-link" data="event-planning"><i class="fa-solid fa-calendar-plus"></i> Event Planning</a></li>`;
                $("ul.navbar-nav").append(eventPlanningNavItem);
            }
            AddNavigationEvents();
        }
        $(document).on("click", "#logout", function () {
            sessionStorage.clear();
            $("#login").html(`<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`);
            $("li a[data='statistics']").parent().remove();
            $("li a[data='event-planning']").parent().remove();
            LoadLink("home");
            AddNavigationEvents();
        });
    }
    function ContactFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "Please enter a valid first and lastname.");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please enter a valid contact number.");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address.");
    }
    function ValidateField(input_field_id, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeClass("class").hide();
            }
        });
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function DisplayHome() {
        console.log("Home");
    }
    function DisplayPortfolio() {
        console.log("Portfolio");
    }
    function DisplayContact() {
        console.log("Contact Us");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            LoadLink("contact-list");
        });
        ContactFormValidation();
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function () {
            if (subscribeCheckbox.checked) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }
    function DisplayContactList() {
        console.log("Contact List");
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let index = 1;
            let keys = Object.keys(localStorage);
            for (const key of keys) {
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
        $("#addButton").on("click", () => {
            LoadLink("edit", "add");
        });
        $("button.edit").on("click", function () {
            LoadLink("edit", $(this).val());
        });
        $("button.delete").on("click", function () {
            if (confirm("Delete contact, are you sure?")) {
                localStorage.removeItem($(this).val());
            }
            LoadLink("contact-list");
        });
    }
    function DisplayTeam() {
        console.log("Team");
    }
    function DisplayBlog() {
        console.log("Blog");
        $("a[data='statistics']").off("click");
        $("a[data='statistics']").on("click", function () {
            LoadLink("statistics");
        });
        $("a[data='event-planning']").off("click");
        $("a[data='event-planning']").on("click", function () {
            LoadLink("event-planning");
        });
    }
    function DisplayServices() {
        console.log("Services");
    }
    function DisplayEdit() {
        console.log("Edit");
        ContactFormValidation();
        let page = router.LinkData;
        switch (page) {
            case "add":
                {
                    $("main>h1").text("Add Contact");
                    $("#editButton").html(`<i class="fa fa-plus fa-sm"></i> Add`);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        let fullName = document.forms[0].fullName.value;
                        let contactNumber = document.forms[0].contactNumber.value;
                        let emailAddress = document.forms[0].emailAddress.value;
                        AddContact(fullName, contactNumber, emailAddress);
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", () => {
                        LoadLink("contact-list");
                    });
                }
                break;
            default:
                {
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));
                    $("#fullName").val(contact.fullName);
                    $("#contactNumber").val(contact.contactNumber);
                    $("#emailAddress").val(contact.emailAddress);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        contact.fullName = $("#fullName").val();
                        contact.contactNumber = $("#contactNumber").val();
                        contact.emailAddress = $("#emailAddress").val();
                        localStorage.setItem(page, contact.serialize());
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", () => {
                        LoadLink("contact-list");
                    });
                }
                break;
        }
    }
    function DisplayLogin() {
        console.log("Login");
        AddLinkEvents("register");
        let messageArea = $("#messageArea");
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            $.get("./data/users.json", function (data) {
                for (const user of data.users) {
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;
                    if (username === user.Username && password === user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    LoadLink("contact-list");
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Credentials")
                        .show();
                }
            });
        });
        $("#clearButton").on("click", function () {
            document.forms[0].reset();
            messageArea.removeAttr("class").hide();
            $("#username").trigger("focus").trigger("select");
        });
    }
    function DisplayStatistics() {
        console.log("Statistics");
    }
    function DisplayEventPlanning() {
        console.log("Event Planning");
        let events = JSON.parse(localStorage.getItem('events') || '[]');
        function addEvent(title, date, description) {
            const newEvent = {
                id: `event-${Date.now()}`,
                title,
                date,
                description
            };
            events.push(newEvent);
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList();
        }
        function removeEvent(eventId) {
            events = events.filter(event => event.id !== eventId);
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList();
        }
        function removeAllEvent() {
            events = [];
            localStorage.setItem('events', JSON.stringify(events));
            updateEventList();
        }
        function updateEventList() {
            const eventListElement = document.getElementById('eventList');
            if (eventListElement) {
                eventListElement.innerHTML = '';
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
        document.getElementById('eventList')?.addEventListener('click', function (event) {
            const target = event.target;
            if (target.classList.contains('remove-btn')) {
                const eventId = target.getAttribute('data-event-id');
                if (eventId && confirm("Remove event details, are you sure?")) {
                    removeEvent(eventId);
                }
            }
        });
        document.getElementById('removeAllButton')?.addEventListener('click', function () {
            if (events.length === 0) {
                alert("There are no event details to remove.");
            }
            else {
                if (confirm("Remove all event details, are you sure?")) {
                    removeAllEvent();
                }
            }
        });
        function handleEventFormSubmit(event) {
            event.preventDefault();
            const titleInput = document.getElementById('eventTitle');
            const dateInput = document.getElementById('eventDate');
            const descriptionInput = document.getElementById('eventDescription');
            if (titleInput && dateInput && descriptionInput) {
                addEvent(titleInput.value, dateInput.value, descriptionInput.value);
                titleInput.value = '';
                dateInput.value = '';
                descriptionInput.value = '';
            }
        }
        document.getElementById('eventForm')?.addEventListener('submit', handleEventFormSubmit);
        updateEventList();
    }
    function DisplayRegister() {
        console.log("Register");
        AddLinkEvents("login");
    }
    function Display404() {
        console.log("404");
    }
    function ActiveLinkCallback() {
        switch (router.ActiveLink) {
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
    function capitalizeFirstCharacter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function LoadHeader() {
        $.get("./views/components/header.html", function (html_data) {
            $("header").html(html_data);
            document.title = capitalizeFirstCharacter(router.ActiveLink);
            $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
            AddNavigationEvents();
            CheckLogin();
        });
    }
    function LoadContent() {
        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallback();
        $.get(`./views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data);
            CheckLogin();
            callback();
        });
    }
    function LoadFooter() {
        $.get("./views/components/footer.html", function (html_data) {
            $("footer").html(html_data);
        });
    }
    function Start() {
        console.log("App Started!");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map