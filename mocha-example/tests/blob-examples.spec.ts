import {expect} from "chai";
import {globSync} from "glob";
import path from "node:path";

/*
This demonstrates roughly what is happening internally in the Config Parser logic.

The '--spec' cli arg is interpreted here:
https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-config/src/node/ConfigParser.ts#L67

Which reworks relative paths to be based on CWD instead of the default config directory. This is where the issue
pops up on Windows... it converts the blob pattern from "/" separators to "\". Thanks, Windows!

This line calls the glob wrapper function:
https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-config/src/node/ConfigParser.ts#L365C40-L365C51

It's passing in the altered pattern, which is now a full path with "\" characters.

The actual call to the `glob` file is here:
https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-config/src/node/FileSystemPathService.ts#L37

Note that we're not handling the "\" character at all and not instructing the glob package to ignore it.

The following test cases roughly describe what I think is happening inside of the glob() function, as well as two
ways to handle the issue. I don't know if any of them are appropriate.

*/
describe('Glob Example', () => {
	it('The issue on Windows', async () => {
		// Ex: C:\Github\wdio-v8-spec-bug-example\wdio-example\tests\filters\*.spec.ts
		const pattern = path.resolve(process.cwd(), "./wdio-example/tests/filters/*.spec.ts");

		// Ex: C:\Github\wdio-v8-spec-bug-example\wdio-example\config
		const configDir = path.resolve(process.cwd(), './wdio-example/config/');

		let files = globSync(pattern, {
			cwd: configDir
		});

		// Will be 0 because glob treats "\" as an escape marker.
		expect(files.length).to.be.greaterThan(0);
	});

	it('Possible solution: Glob Flag', async () => {
		// Ex: C:\Github\wdio-v8-spec-bug-example\wdio-example\tests\filters\*.spec.ts
		const pattern = path.resolve(process.cwd(), "./wdio-example/tests/filters/*.spec.ts");

		// Ex: C:\Github\wdio-v8-spec-bug-example\wdio-example\config
		const configDir = path.resolve(process.cwd(), './wdio-example/config/');

		// Use `windowsPathsNoEscape` flag to negate use of '\'
		let files = globSync(pattern, {
			cwd: configDir,
			windowsPathsNoEscape: true
		});

		// Now passes
		expect(files.length).to.be.greaterThan(0);
	});

	it('Possible solution: Replace', async () => {
		// Ex: C:/Github/wdio-v8-spec-bug-example/wdio-example/tests/filters/*.spec.ts
		const pattern = path.resolve(process.cwd(), "./wdio-example/tests/filters/*.spec.ts").replaceAll("\\", "/");

		// Ex: C:/Github/wdio-v8-spec-bug-example/wdio-example/config
		// Note: This is ignored when given a path that starts with a drive letter, so not important for this example.
		const configDir = path.resolve(process.cwd(), './wdio-example/config/').replaceAll("\\", "/");

		// Now works because we replaced "\" with "/"
		let files = globSync(pattern, {
			cwd: configDir,
		});

		// Now passes
		expect(files.length).to.be.greaterThan(0);
	});
});