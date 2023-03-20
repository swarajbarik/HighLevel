import { test } from "@playwright/test";
import { CalendarsPage } from "../pages/CalendarsPage";
import { DashBoardPage } from "../pages/DashBoardPage";
import { HomePage } from "../pages/HomePage";

test("Test 1: Verify user can book appointment at any time zone & the same can be shown on appointments tab as per the system time zone configured.", async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const dahboardPage = new DashBoardPage(page);
  const calendarPage = new CalendarsPage(page);

  await homePage.goto(process.env.STAGING_URL as string);
  await homePage.login(
    process.env.USER_NAMRE as string,
    process.env.PASSWORD as string
  );
  await dahboardPage.navigateToLeftSideMenu("Calendars");

  await calendarPage.bookAppointment();

  const expectedBookingTime =
    await calendarPage.getExpectedDateAndTimeOfBooking(
      CalendarsPage.BOOKING_TIME
    );
  await calendarPage.verifyTheBookingDateAndTime(expectedBookingTime);
});
