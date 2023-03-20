import { Locator, Page } from "@playwright/test";

export class DashBoardPage {
  readonly navMenu: Locator;
  readonly menuItem;

  constructor(page: Page) {
    this.navMenu = page.locator("div.hl_nav-header");
    this.menuItem = (menu:string) => this.navMenu.locator(`a>span:text('${menu}')`);
  }

  async navigateToLeftSideMenu(menu: string) {
    await this.menuItem(menu).click();
  }
}
