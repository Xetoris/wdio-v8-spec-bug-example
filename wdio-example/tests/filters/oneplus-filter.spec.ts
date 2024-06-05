import { expect } from "chai";

import {filtersWidget, shelfItemWidget} from "../../components/index.js";

describe('OnePlus Filter', () => {
	before('Setup', async () => {
		await browser.url('/');
	});

	it('Can be applied', async () => {
		await filtersWidget.component.waitForDisplayed();

		await filtersWidget.onePlusToggle.click();

		expect(await filtersWidget.onePlusInput.isSelected()).to.be.true;

		const regex = /^one plus/i;
		await browser.waitUntil(async () => {
			const isVisible = await shelfItemWidget.component.isDisplayed();

			if (!isVisible) return false;

			const text = await shelfItemWidget.titleLabel.getText();

			return regex.test(text);
		}, {
			timeout: 10000
		});
	});
});