# Overview
This repository uses [Playwright](https://playwright.dev/) to complete the appointment booking on https://app.gohighlevel.com/

### Run Tests
`npm run test`

# Framework Known Issues
1. When the user tries to select the Calendar as "Cal1" while booking the amount, the script fails due to multiple lements found (can be handled through code)
2. If any calendar does not show the availble time slots then due to empty value in the time the script fails (this also can be handled)

# Framework Enhancements
1. Can be more optimized by moving the locators to constructor 
