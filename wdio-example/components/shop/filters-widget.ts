import {ChainablePromiseElement} from "webdriverio";

class FiltersWidget {
	get component(): ChainablePromiseElement<WebdriverIO.Element> {
		return $('div.filters');
	}

	get appleToggle(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('label=Apple')
	}

	get appleInput(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('input[type="checkbox"][value="Apple"]');
	}

	get samsungToggle(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('label=Samsung')
	}

	get samsungInput(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('input[type="checkbox"][value="Samsung"]');
	}

	get googleToggle(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('label=Google')
	}

	get googleInput(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('input[type="checkbox"][value="Google"]');
	}

	get onePlusToggle(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('label=OnePlus')
	}

	get onePlusInput(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('input[type="checkbox"][value="OnePlus"]');
	}
}

const filtersWidget = new FiltersWidget();

export {
	FiltersWidget,
	filtersWidget
};