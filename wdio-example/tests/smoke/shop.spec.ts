import {browser} from "@wdio/globals";
import {filtersWidget} from "../../components/index.js";

describe('Shop: Smoke', () => {
	it('Loads', async () => {
		await browser.url('/');

		await filtersWidget.component.waitForDisplayed({
			timeoutMsg: "Shop page was not displayed!"
		});
	});
});