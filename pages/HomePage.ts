import { Locator, Page } from "@playwright/test";
import { DashBoardPage } from "./DashBoardPage";

export class HomePage {
  readonly page: Page;
  readonly user_name_locator: Locator;
  readonly password: Locator;
  readonly signButton:Locator;

  dashBoardPageObj: DashBoardPage;
  
  constructor(page: Page) {
    this.page = page;
    this.user_name_locator = page.locator('[placeholder="Your email address"]');
    this.password = page.locator('[placeholder="The password you picked"]');
    this.signButton = page.locator('button:has-text("Sign in")');
  }

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: "networkidle" });
  }

  async login(username: string, password: string) {
    await this.user_name_locator.fill(username);
    await this.password.fill(password);
    await this.signButton.click();
  }
}
