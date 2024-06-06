# wdio-v8-spec-bug-example
A simple repo to demonstrate what I suspect is a bug with v8 and Windows.

---

## The Symptom

When running on my work machine and experimenting with the v8 update, I noticed that I stopped being able to run tests
when providing a glob pattern on the cli.

Example:

```text
wdio ./config/local-config.ts --spec /some/relative/path/*.spec.ts
```

This works fine on v7, resolving the spec path from the CWD. With v8, it started failing saying it couldn't find any specs
that matched the given pattern. I was really confused because I could see the exact path it output lined up with a folder
full of spec files.

So I spent a several hours digging. If I ran the command without using --spec or specifying a suite, that worked fine.
The config file would load and find the spec using the glob pattern inside it. (Note: I did override 'rootDir' to set
its glob pattern to be based off of CWD.)

After a little while, I'm pretty sure I figured out what was going on.

---

## The Issue

Internally, wdio-config takes CLI spec args and converts them to be based off CWD instead of the config file dir:
https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-config/src/node/ConfigParser.ts#L67

This makes sense, but introduces the issue -- makeRelativeToCWD uses path.resolve() internally if it detects a "/" in
the provided cli value:
https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-config/src/node/utils.ts#L51

Because _Windows is special_, this results in changing a blob pattern from something like `/some/relative/path/*.spec.ts`
to `C:\Github\my-repo\some\relative\path\*.spec.ts`. Note that the separator character has changed to a "\\".

But nothing is amiss yet.

Later on, the Config Parser attempts to perform a glob match to see what spec files need to be run. It does this by
calling a glob wrapper around here:
https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-config/src/node/ConfigParser.ts#L365C40-L365C51

This glob wrapper calls globSync from the [glob](https://www.npmjs.com/package/glob) package:
https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-config/src/node/FileSystemPathService.ts#L37

This is the other half of the issue -- we don't do anything before passing the converted CLI arg to `globSync()`. This
means the pattern going in is `C:\Github\my-repo\some\relative\path\*.spec.ts`. According to the glob package, patterns
should not use "\" because they represent escape characters. This means our updated pattern won't match anything as the
separators are being miss-interpreted. If you want to use "\" separators (because of Windows), you have to enable a
special flag called "windowsPathsNoEscape".

The CWD parameter doesn't matter here according to the glob package docs, because the pattern starts with a letter drive.
This results in CWD being ignored.

So, on Windows, you can't provide a glob pattern as a "--spec" cli arg because the arg is re-interpreted using `path.resolve()`.
The resolve method converts it to a Windows path, which has invalid characters for globs default behavior.

---

## An Example

I created this silly repo to house a simple example displaying the issue when run on Windows machines. There are three
different commands in the package.json:

- `wdio` which just shows the WDIO tests running.
- `windows-error` which shows an example of the bug in action (when run on Windows)
- `mocha` which stages a similar situation to what I believe is happening, but in a unit test format.

---

Do note that I'm not an expert by any means. We may be miss-using the --spec cli arg vs its intent or miss-interpreting
what's happening inside the WDIO project. But, after several hours of debugging, I was able to work my way to this diagnosis.
When I modified the contents of the wdio js files in my work repo, I was able to get this to work by providing the `windowsPathsNoEscape`
parameter to the `globSync()` call.
