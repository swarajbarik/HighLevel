import { expect, Locator, Page } from "@playwright/test";

import moment from "moment-timezone";

export class CalendarsPage {
  readonly page: Page;
  readonly bookAppointmentButton: Locator;
  readonly calendarDropdownLocator: Locator;
  readonly userCalendarDropDownLocator: Locator;
  readonly userTimeZoneDropDownLocator: Locator;
  readonly openedDropDown: string;
  readonly calendarDropdownItemLocator: any;
  readonly existingUserLocator: any;

  static SELECTED_CALENDAR: string;
  static SELECTED_USER: string;
  static SELECTED_USER_CALENDAR: string;
  static SELECTED_TIME_ZONE: string;
  static BOOKING_TIME: string;

  constructor(page: Page) {
    this.page = page;
    this.openedDropDown =
      "//div[contains(@class,'n-base-select-menu') and not(contains(@style, 'display'))]//div[@class='n-base-select-option__content']";
    this.bookAppointmentButton = page.locator(
      'button:has-text("Book Appointment")'
    );
    this.calendarDropdownLocator = page.locator(
      "#pg-appt__drpdwn--menu-apt__BV_toggle_"
    );
    this.calendarDropdownItemLocator = (item: string) =>
      page.locator(`ul.show a.dropdown-item:has-text('${item}')`);
    this.existingUserLocator = (userName) =>
      page
        .frameLocator('iframe[name="calendar-app"]')
        .locator(
          `div.self-start>div>div.items-center div.font-semibold:has-text('${userName}')`
        )
        .first();
    this.userCalendarDropDownLocator = page
      .frameLocator('iframe[name="calendar-app"]')
      .locator("#book-appt-selected-calendar input.n-base-selection-input");
    this.userTimeZoneDropDownLocator = page
      .frameLocator('iframe[name="calendar-app"]')
      .locator("#select-timezone-dropdown input.n-base-selection-input");
  }

  async getClendarsList() {
    const calendars = await this.page
      .locator("ul.show a.dropdown-item")
      .allTextContents();
    return calendars;
  }

  async getListOfExistingUsers() {
    await this.bookAppointmentButton.click();

    const users = await this.page
      .frameLocator('iframe[name="calendar-app"]')
      .locator("div.self-start>div>div.items-center div.font-semibold")
      .allTextContents();
    return users;
  }

  async selectCalendar(calendar?: string) {
    await this.calendarDropdownLocator.click();
    if (calendar === undefined) {
      const calendars = await this.getClendarsList();
      calendar = calendars[Math.floor(Math.random() * calendars.length)];
    }
    await this.calendarDropdownItemLocator(calendar).click();
    CalendarsPage.SELECTED_CALENDAR = calendar;
  }

  async selectAvailableCalendar() {
    const calendars = await this.getClendarsListForTheSelectedUser();
    const randomCalendarItem =
      calendars[Math.floor(Math.random() * calendars.length)];
    await this.calendarDropdownItemLocator(randomCalendarItem).click();
    CalendarsPage.SELECTED_CALENDAR = randomCalendarItem;
  }

  async getClendarsListForTheSelectedUser() {
    await this.userCalendarDropDownLocator.click();
    const user_calendars = await this.page
      .frameLocator('iframe[name="calendar-app"]')
      .locator(this.openedDropDown)
      .allTextContents();
    return user_calendars;
  }

  async getListofTimezones() {
    await this.userTimeZoneDropDownLocator.click();
    const time_zones = await this.page
      .frameLocator('iframe[name="calendar-app"]')
      .locator(this.openedDropDown)
      .allTextContents();
    return time_zones;
  }

  async bookAppointment() {
    const users = await this.getListOfExistingUsers();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    await this.existingUserLocator(randomUser).click();
    CalendarsPage.SELECTED_USER = randomUser;

    const userCalendars = await this.getClendarsListForTheSelectedUser();
    const userCalendar =
      userCalendars[Math.floor(Math.random() * userCalendars.length)];
    await this.page
      .frameLocator('iframe[name="calendar-app"]')
      .locator(this.openedDropDown)
      .locator(`text=${userCalendar}`)
      .first()
      .click();

    const timeZones = await this.getListofTimezones();
    const timeZone = timeZones[Math.floor(Math.random() * timeZones.length)];
    await this.page
      .frameLocator('iframe[name="calendar-app"]')
      .locator(this.openedDropDown)
      .locator(`text=${timeZone}`)
      .first()
      .click();
    CalendarsPage.SELECTED_TIME_ZONE = timeZone;
    CalendarsPage.SELECTED_USER_CALENDAR = userCalendar;

    const date = await this.page
      .frameLocator('iframe[name="calendar-app"]')
      .locator("#date-picker-standard input")
      .inputValue();

    const time = await this.page
      .frameLocator('iframe[name="calendar-app"]')
      .locator("#slot-picker-standard div.n-base-selection-input__content")
      .textContent();

    await this.page
      .frameLocator('iframe[name="calendar-app"]')
      .locator("#save-appointment-button")
      .click();

    CalendarsPage.BOOKING_TIME = date + "-" + time?.split("-")[0].trim();
  }

  async getExpectedDateAndTimeOfBooking(actualBookingTime: string) {
    const actTime = moment.tz(
      `${actualBookingTime}`,
      "ddd, MMMM Do YYYY-h:mm a",
      CalendarsPage.SELECTED_TIME_ZONE.split(" ")[1]
    );
    const istTime = actTime.clone().tz(process.env.SYSTEM_TIME_ZONE as string);
    const actualTime = istTime.format("MMM DD YYYY, hh:mm a");
    return actualTime;
  }

  async verifyTheBookingDateAndTime(expectedBookingTime) {
    await this.page
      .locator('div.topmenu-nav a>span:has-text("Appointments")')
      .click();
      await this.selectCalendar(CalendarsPage.SELECTED_USER_CALENDAR);

      const addedUser = await this.page.locator('div.hl_appointments--table tbody>tr').locator('td').nth(1).locator('h4').textContent();
      expect(addedUser?.toLowerCase().trim()).toEqual(CalendarsPage.SELECTED_USER?.toLowerCase().trim());

      const bookedTime = await this.page.locator('div.hl_appointments--table tbody>tr').locator('td').nth(2).locator('div').textContent();
      expect(bookedTime?.trim()).toEqual(expectedBookingTime);
  }
}
