"use strict";

// IIFE - Immediately Invoked Function Expression.
// AKA - Anonymous Self-Executing Function.
(function(){

    function addAboutUsButtonListener(){

        // Bind the button on the home page to a variable.
        let AboutUsButton = document.getElementById("AboutUsBtn");

        // Create an event listener for when the user clicks the button.
        // When the user clicks the button, redirect to the about us page.
        AboutUsButton.addEventListener("click", function ()
        {
            location.href = "about.html";
        });
    }

    // Functions that run when the user is on that page.
    function DisplayHomePage() {
        console.log("Called DisplayHomePage");
        addAboutUsButtonListener();

        // Assigning a variable with the first main tag on the homepage.
        let MainContent = document.getElementsByTagName("main")[0];

        // Creating a paragraph tag inside the homepage.
        let MainParagraph = document.createElement("p");

        // Set the id and class attribute to the paragraph tag.
        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");

        // Add content to the paragraph.
        MainParagraph.textContent = "This is my first paragraph.";

        // Attach Main paragraph to the main tag.
        MainContent.appendChild(MainParagraph);

        let FirstString = "This is ";
        let SecondString = `${FirstString}the main paragraph.`;

        // Append the paragraph with the new string.
        MainParagraph.textContent = SecondString;

        // Update the main tag.
        MainContent.appendChild(MainParagraph);

        // Create a variable that accesses the body.
        let DocumentBody = document.body;

        // Create an article tag.
        let Article = document.createElement("article");
        let ArticleParagraph= `<p id = "ArticleParagraph" class = "mt-3"> This is my article paragraph.</p>`;
        Article.setAttribute("class", "container");

        // Add the article attributes inside the article tag.
        Article.innerHTML = ArticleParagraph;

        // Add the article content to the webpage.
        DocumentBody.appendChild(Article);
    }

    function DisplayAboutPage(){
        console.log("Called DisplayAboutPage");
        addAboutUsButtonListener();
    }

    function DisplayContactPage(){
        console.log("Called DisplayContactPage");
        addAboutUsButtonListener();
    }

    function DisplayProductPage(){
        console.log("Called DisplayProductPage");
        addAboutUsButtonListener();
    }

    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage");
        addAboutUsButtonListener();
    }

    function Start()
    {
        console.log("App Started!");

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
        }
    }
    window.addEventListener("load", Start);

})();