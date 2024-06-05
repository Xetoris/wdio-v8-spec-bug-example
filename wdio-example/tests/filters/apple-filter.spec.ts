import {expect} from "chai";

import {filtersWidget, shelfItemWidget} from "../../components/index.js";

describe('Apple Filter', () => {
	before('Setup', async () => {
		await browser.url('/');
	});

	it('Can be applied', async () => {
		await filtersWidget.component.waitForDisplayed();

		await filtersWidget.appleToggle.click();

		expect(await filtersWidget.appleInput.isSelected()).to.be.true;

		const firstProductTitle = await shelfItemWidget.titleLabel.getValue();


		const regex = /^iphone/i;
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