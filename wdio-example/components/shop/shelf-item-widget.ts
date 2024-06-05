import {ChainablePromiseElement} from "webdriverio";

class ShelfItemWidget {
	get component(): ChainablePromiseElement<WebdriverIO.Element> {
		return $('.shelf-item');
	}

	get heartButton(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('button');
	}

	get titleLabel(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('p[class$="title"]');
	}

	get priceLabel(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('.shelf-item__price .val b');
	}

	get addToCartButton(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.component.$('.shelf-item__buy-btn');
	}
}

const shelfItemWidget = new ShelfItemWidget();

export {
	shelfItemWidget,
	ShelfItemWidget
};