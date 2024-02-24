/*
 * File: authguard.js
 * Author: Takirul (100862036)
 * Date completed: February 24, 2024
 * Description: This file checks if the user is authenticated. If not, it redirects the user to the login page.
 */

"use strict";

(function ()
{
    // Check if the user is authenticated.
    if(!sessionStorage.getItem("user"))
    {
        // If the user is not authenticated, redirect them to the login page.
        location.href = "login.html";
    }

})();