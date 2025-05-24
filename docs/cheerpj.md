Directory Structure:

└── ./
    └── docs
        ├── 10-getting-started
        │   ├── 00-Java-app.md
        │   ├── 01-Java-applet.mdx
        │   ├── 02-Java-library.md
        │   └── 03-JNLP.mdx
        ├── 11-guides
        │   ├── basic-server-setup.md
        │   ├── cheerpj-debug.mdx
        │   ├── File-System-support.md
        │   ├── implementing-native-libraries.md
        │   ├── implementing-native-methods.md
        │   ├── Intercept-external-commands.md
        │   ├── library-mode.md
        │   ├── Networking.md
        │   └── Startup-time-optimization.md
        ├── 12-reference
        │   ├── 00-cheerpjInit.md
        │   ├── 01-cheerpjRunMain.md
        │   ├── 02-cheerpjRunJar.md
        │   ├── 03-cheerpjRunLibrary.md
        │   ├── 10-cheerpjCreateDisplay.md
        │   ├── 20-cjFileBlob.md
        │   ├── 21-cheerpOSAddStringFile.md
        │   ├── 30-cjGetRuntimeResources.md
        │   ├── 31-cjGetProguardConfiguration.md
        │   └── 40-CJ3Library.md
        ├── 13-tutorials
        │   ├── 00-swingset3.mdx
        │   ├── 01-applet.mdx
        │   ├── 02-jnlp.mdx
        │   ├── 04-java-browser.mdx
        │   ├── 04-serverclient.mdx
        │   └── 05-interoperability-tutorial.mdx
        ├── 14-explanation
        │   └── architecture.mdx
        ├── 00-overview.mdx
        ├── 20-faq.md
        ├── 21-migrating-from-cheerpj2.md
        └── 22-changelog.md



---
File: /docs/10-getting-started/00-Java-app.md
---

---
title: Run a Java application
description: Convert a desktop app to a webapp
---

CheerpJ can run a Java application in the browser with little to no modifications. This page will help you getting started with CheerpJ and running your first Java application in the browser.

Java source code is not needed to use CheerpJ. If you are building your own application you should already have its `.jar` file(s).

**To get started you will need:**

- Your Java application file(s). You can also use this [TextDemo.jar](https://docs.oracle.com/javase/tutorialJWS/samples/uiswing/TextDemoProject/TextDemo.jar) sample.
- An HTML file where your Java app will be wrapped
- A simple HTTP server to test your webpage locally

## 1. Create a project directory

Let's start by creating a project folder where all your files will be. Please copy your java and future HTML files here.

```shell

mkdir directory_name

```

## 2. Create a basic HTML file

Let's create a basic HTML file like the following example. Please notice the CheerpJ runtime environment has been integrated and initialized. In this example we are assuming your HTML file and your `.jar` files are under the project directory you just created.

```html title="index.html" {6, 9-15}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ test</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<script>
			(async function () {
				await cheerpjInit();
				cheerpjCreateDisplay(800, 600);
				await cheerpjRunJar("/app/my_application_archive.jar");
			})();
		</script>
	</body>
</html>
```

Alternatively, if your application is not designed to be executed with the command `java -jar` you can replace `cheerpjRunJar()` for `cheerpjRunMain()` and pass your qualified class name as an argument. For example:

```js
cheerpjRunMain(
	"com.application.MyClassName",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar"
);
```

> [!help] Don't forget to use the /app/ prefix
> It is common for first-time users to forget to add the prefix “/app/” when passing the application location to cheerpJRunJar() or cheerpjRunMain().

## 3. Host your page

You can now serve this web page on a simple HTTP server, such as the http-server utility.

```shell
npx http-server -p 8080
```

> [!tip]
> Opening the page directly from the disk (for example, by double-clicking on it) is not supported.

## What's going on?

- The `<head>` script loads CheerpJ.
- [`cheerpjInit`] initialises the CheerpJ runtime environment.
- [`cheerpjCreateDisplay`] creates a graphical environment to contain all Java windows.
- [`cheerpjRunJar`] executes your application!
- `/app/` is a [virtual filesystem] mount point that references the root of the web server this page is loaded from.

## The result

You will see the CheerpJ display on your browser with some loading messages before showing your application running. Depending on your application and the optimizations applied, this could take just a few seconds.

### Is your application not working?

Please try these checks:

- The location of your JARs is correct and the prefix `/app/` is added when passing it to [`cheerpjRunJar`] or [`cheerpjRunMain`]. For more information visit the [virtual filesystem] guide.
- Your Java application works normally on your machine without CheerpJ.
- You are not opening the page by double clicking on it and you are using an http-server instead.

## Further reading

- [Runtime API reference](/docs/reference)

[`cheerpjInit`]: /docs/reference/cheerpjInit
[`cheerpjCreateDisplay`]: /docs/reference/cheerpjCreateDisplay
[`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
[`cheerpjRunMain`]: /docs/reference/cheerpjRunMain
[virtual filesystem]: /docs/guides/File-System-support



---
File: /docs/10-getting-started/01-Java-applet.mdx
---

---
title: Run a Java applet
description: Run a java applet in modern browsers
---

import LinkButton from "@leaningtech/astro-theme/components/LinkButton.astro";
import AppletRunnerButton from "@leaningtech/astro-theme/components/AppletRunnerButton.astro";

CheerpJ can run Java applets in the browser seamlessly. This page will help you getting started with CheerpJ for Java applets using the CheerpJ runtime environment on your own webpage.

{/* <p class="m-0 text-md font-semibold text-gray-900 dark:text-white"> */}

<div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
	<div class="-mb-2 flex-grow text-left">
		<div class="-my-1 font-sans text-lg font-semibold">Not a Developer?</div>
		<p class="-my-3 text-base text-gray-600 dark:text-gray-400">
			Check out our browser extension for running Java Applets while you browse
			in modern browsers.
		</p>
	</div>
	<AppletRunnerButton />
</div>

## Running your own applet

**You will need:**

- Your applet file(s)
- The HTML file where your applet is meant to be displayed.
- A basic HTTP server to test locally

### 1. Integrating CheerpJ in your HTML file

This tutorial assumes you already have an HTML file with an `<applet>`, `<object>` or `<embed>` tag.

In order to integrate CheerpJ, you just need to add:

1.  A simple `<script>` within the `<head>` of your page with the CheerpJ runtime loader.

```html
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

2.  A second script calling [`cheerpjInit()`] to initialize CheerpJ's runtime environment.

```html
<script>
	cheerpjInit();
</script>
```

For example:

```html title="index.html" {6, 15-17}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ applet test</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<applet
			archive="Example.jar"
			code="ExamplePath.ExampleApplet"
			height="900"
			width="900"
		></applet>
		<script>
			cheerpjInit();
		</script>
	</body>
</html>
```

> [!info] Java Applets and Java 8
> The method ´cheerpJInit´ runs Java 8 by default if the Java version is not specified. Please notice that if you change the version to Java 11 applets won't work.

### 2. Host your page locally

You can now serve this web page on a simple HTTP server, such as the http-server utility.

```shell
npm install http-server
http-server -p 8080
```

> In case your users have a native Java plugin installed, you can replace the original HTML tag with a `cheerpj-` prefixed version. `<cheerpj-applet>`, `<cheerpj-object>`, and `<cheerpj-embed>` are all supported.

## The result

You will see the CheerpJ display on your browser with some loading messages before showing your applet running. Depending on your application and the optimizations applied, this could take just a few seconds.

## Further reading

- [Runtime API reference](/docs/reference)

[`cheerpjInit()`]: /docs/reference/cheerpjInit



---
File: /docs/10-getting-started/02-Java-library.md
---

---
title: Run a Java library
description: Use Java classes in JavaScript
---

## 1. Include CheerpJ on your page

```html
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

## 2. Initialize CheerpJ and load your Java library

```js
await cheerpjInit();
const cj = await cheerpjRunLibrary("/app/library.jar");
```

> [!help] Don't forget to use the /app/ prefix
> It is common for first-time users to forget to add the prefix “/app/” when passing the JAR location to cheerpJRunLibrary().

This will load `library.jar` from the root of your web server.

## 3. Call Java from JavaScript

```js
const MyClass = await cj.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## Further reading

- [`cheerpjRunLibrary` reference](/docs/reference/cheerpjRunLibrary)



---
File: /docs/10-getting-started/03-JNLP.mdx
---

---
title: Run a JNLP
description: Run a JWS/JNLP application in the browser
---

import JNLPRunnerButton from "@leaningtech/astro-theme/components/JNLPRunnerButton.astro";

This quickstart tutorial will take you step by step on how to run your JNLP app (also known as Java Web Start application) in the browser with CheerpJ.

<div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
	<div class="flex-grow text-left ">
		<div class="-my-1 font-sans text-lg font-semibold">Not a Developer?</div>
		<p class="-my-3 text-base text-gray-600 dark:text-gray-400">
			Check out our browser extension for running Java Web Start applications
			while you browse in modern browsers.
		</p>
	</div>
	<JNLPRunnerButton />
</div>

You will need:

- The application `.jnlp` file.
- An HTML file where your Java app will be wrapped.
- A simple HTTP server to test your webpage locally.

## 1. The `.jnlp` file

The `.jnlp` file contains the specifics of how to launch your Java application. The usual pipeline starts when this file is triggered from a website so it is passed to the user's local JNLP client which downloads the application `.jar` files and further resources. Finally, the app is executed with the local JRE installation. **With CheerpJ it is possible to run this application in the browser sandbox, no Java installation required.**

Your `.jnlp` file might look something like the example below. There are three essential elements you need to find:

1. The `.jar` files specified under the `<resources>` element, usually indicated with a `<jar>` or `<nativelib>` tags.
2. Your application type. Look for an `<application-desc>` or `<applet-desc>` tag.
3. You may need the `codebase` URL given by `<jnlp>`.

```xml title="example.jnlp" {5, 22-23, 26}
<?xml version="1.0" encoding="utf-8"?>
<!-- JNLP Example -->
<jnlp
  spec="1.0+"
  codebase="code-base-url"
  href="example.jnlp">
  <information>
    <title>Your application name</title>
    <vendor>Vendor name</vendor>
    <homepage href="home-page-url"/>
    <description>Description of your Java application</description>
    <description kind="short">Another description of your Java application</description>
    <icon href="image-url"/>
    <icon kind="icon-name" href="image-url"/>
    <offline-allowed/>
  </information>
  <security>
      <all-permissions/>
  </security>
  <resources>
    <j2se version="1.4+" initial-heap-size="64m" max-heap-size="640m"/>
    <jar href="my_application_archive.jar"/>
    <jar href="lib/my_dependency.jar"/>
    <property name="key" value="overwritten"/>
  </resources>
  <application-desc main-class="com.application.MyClassName"/>
</jnlp>
```

## 2. Create a project directory

Once you have identified where the `<jar>` or `<nativelib>` tags are in your JNLP, you can simply download these JARs by copying and pasting their URLs in the browser's navigation bar. If these URLs are relative then build the full URL by appending the `codebase` URL and the `jar` URL:

For example:

```
code-base-url/my_application_archive.jar
code-base-url/lib/my_dependency.jar
```

Please create a directory for your project and place the JARs you just downloaded inside this folder, remember to keep the same directory structure as shown in your `.jnlp`.

For example:

```shell
mkdir -p directory_name/lib
```

Once you moved the JARs it should look like this:

```
└── directory_name
    ├── my_application_archive.jar
    └── lib
        └── my_dependency.jar
```

## 3. Create a basic HTML file

### 3.1 Identify your application type

A JNLP app can be a **standalone application** or an **applet**. This is easy to spot on your `.jnlp` file with the tags **`<application-desc>`** or **`<applet-desc>`** correspondingly.

We will create a basic HTML file where the CheerpJ runtime will be integrated and the java application displayed. Create this file in the root of the project folder. The way the app is loaded might differ if the application is a standalone app or an applet. The following steps will specify how the HTML will look like for each case.

### 3.2 If your application is a standalone app

Take a close look at content of `<application-desc>` and keep the following at hand:

- **The application class name:** You can find it at the `main-class` attribute. This attribute may not be there if the class name is included in the manifest.
- **The application arguments:** If any arguments are required, you will find these with the `<argument>` tag.

> [!note] Note
> If you do not find any of the elements listed above, this means you do not need them to run your application.

Example of an HTML file for an app where the class name is included in the manifest:

```html title = "index.html" {6, 9-15}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ test</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<script>
			(async function () {
				await cheerpjInit();
				cheerpjCreateDisplay(800, 600);
				await cheerpjRunJar("/app/my_application_archive.jar");
			})();
		</script>
	</body>
</html>
```

Alternatively, if the class name is in the `.jnlp` file but not in the manifest, then replace [`cheerpjRunJar()`] for [`cheerpjRunMain()`]:

```js
cheerpjRunMain(
	"com.application.MyClassName",
	"/app/my_application_archive.jar:/app/lib/my_dependency_archive.jar"
);
```

Any application arguments must be passed to [`cheerpjRunJar()`] or [`cheerpjRunMain()`].
The `/app/`prefix is a virtual filesystem mount point that references the root of the web server this page is loaded from.

### 3.2 If your application is an applet

Take a close look to the `<applet-desc>` tag on your `.jnlp` and keep the following at hand:

- **Any applet tag parameters:**

  - **The applet class name:** You can find it at the main-class attribute.
  - **The applet ideal size:** defined at `width` and `height` attributes.
  - **Applet parameters:** found as `<param>` within `<applet-desc>` if your applet requires it.

- **documentBase:** If you retrieve this URL, you will obtain an HTML file where the applet is wrapped. You can use it, or create your own HTML like the example below. If you use the `documentBase` HTML file, remember to add the scripts where the CheerpJ runtime is integrated and called.

The HTML for an applet would look like this:

```html title="index.html" {6, 9-17}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ applet test</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<applet
			archive="my_applet_archive.jar"
			code="com.applet.MyClassName"
			height="900"
			width="900"
		></applet>
		<script>
			cheerpjInit();
		</script>
	</body>
</html>
```

Any applet parameters should be passed as `<param>` in the `<applet>` tag as usual:

```html {7}
<applet
	archive="my_applet_archive.jar"
	code="com.applet.MyClassName"
	height="900"
	width="900"
>
	<param name="paramName" value="paramValue" />
</applet>
```

> In case your users have a native Java plugin installed, you can replace the original HTML tag with a cheerpj- prefixed version. `<cheerpj-applet>`, `<cheerpj-object>`, and `<cheerpj-embed>` are all supported.

> [!info] Java Applets and Java 8
> The method ´cheerpJInit´ runs Java 8 by default if the Java version is not specified. Please notice that if you change the version to Java 11, applets won't work.

## 4. Host your page

Your final project directory tree should look similar to:

```
└── directory_name
    ├── index.html
    ├── my_application_archive.jar
    └── lib
        └── my_dependency.jar
```

You can now go to the project directory and serve this web page on a simple HTTP server, such as the http-server utility.

```sh
cd directory_name
npm install http-server
http-server -p 8080
```

## The end

This is the end of the tutorial. To learn more about running standalone applications and applets with CheerpJ, you can visit the dedicated tutorials:

<div class="not-prose grid grid-cols-2 font-medium gap-2 text-stone-100">
	<a
		href="/docs/getting-started/Java-app"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Application
	</a>
	<a
		href="/docs/getting-started/Java-applet"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Applet
	</a>
</div>

[run a Java application]: /docs/getting-started/Java-app
[run a Java applet]: /docs/getting-started/Java-applet
[`cheerpjRunJar()`]: /docs/reference/cheerpjRunJar
[`cheerpjRunMain()`]: /docs/reference/cheerpjRunMain



---
File: /docs/11-guides/basic-server-setup.md
---

---
title: Basic Server Setup
description: How do serve your own Java application with CheerpJ
---

## Overview

To run your Java applications in the browser, you will need to host the application files. This guide will cover some simple HTTP servers that can be used for basic testing. We will also discuss NGINX which is useful in more advanced scenarios, for example when self hosting CheerpJ.

> [!note] Important
> The content of this guide is specifically made for testing setups and should not be used for production environments. In production environments it is essential to utilize HTTPS, both to improve security and to gain access to advanced Web APIs.

## Static _One-Line_ servers

_One-Line_ HTTP servers are simple tools that can be run directly from the terminal with a short command. They are simple to set up and useful for quickly serving static files or testing web applications locally.

_One-Line_ servers that have been tested and work with CheerpJ:

- `npx serve`
- `npx http-server`

## CheerpJ HTTP server requirements

### Range requests

CheerpJ makes use of [Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests) to download resources in chunks, for example JAR files.
Thus, the HTTP server hosting the Java application files must support "Range" headers. Some HTTP servers may need additional configuration to enable this feature, while others are not compatible at all. For instance, Python's `http-server` module, commonly used for quick testing, lacks support for range headers and therefore won't work with CheerpJ.

If your HTTP server does not support "Range" headers, you will see an error message like this in the browser console:

> [!warning] Network error for http://127.0.0.1:8084/exampleApp.jar: HTTP server does not support the 'Range' header. CheerpJ cannot run.

NPM server tools such as `npx serve` and `npx http-server` typically have built-in support for range requests, making them suitable for basic testing without the need for additional configurations. The same applies to NGINX, which will be discussed in more detail later in this guide.

### JavaScript library files

CheerpJ allows you to implement native libraries in JavaScript, more details on this can be found in our [Native Libraries Guide](/docs/guides/implementing-native-librariest).

Depending on the size of the JavaScript library file, you may encounter an error with certain browsers, like Firefox:

> [!warning] Network error for http://localhost:8080/library.js: HTTP server returned compressed partial data. That should not happen. CheerpJ cannot run

This error occurs because plain JavaScript files are compressed automatically in Firefox, since it provides the `Accept-Encoding: gzip` header for range requests. This is not well defined, since it is unclear whether the response contains partial compressed data, or compressed partial data.

To resolve this issue, you need to disable compression for range requests or disable compression entirely. To disable compression in `npx serve`, use `npx serve -u`.

By default, `npx http-server` should correctly serve JavaScript library files without compression.

## NGINX Guide

We won't go into detail on how to install and setup NGINX, but will focus on the configuration necessary to integrate NGINX seamlessly with CheerpJ.

### Nginx configuration file

This NGINX configuration template will work with most Java applications and CheerpJ for testing purposes.

```nginx title=nginx.conf
worker_processes  1;
error_log   nginx_main_error.log info;
pid nginx_user.pid;
daemon off;

events {
	worker_connections  1024;
}

http {
	access_log  nginx_access.log;
	error_log   nginx_error.log info;

	default_type  application/octet-stream;

	sendfile        on;

	types {
		text/html html;
		text/css css;
		application/javascript js;
		application/wasm wasm;
	}

	server {
		listen       8080;
		server_name  localhost;

		gzip on;
		gzip_types      application/javascript application/wasm;

		charset utf-8;

		location / {
			# this should point to your root application folder
			root /home/path/to/java/app;

			autoindex on;
			absolute_redirect off;
			index  index.html index.htm;
		}
	}
}
```

Let's take a closer look at some important settings required for CheerpJ and to also ensure proper file serving.

We specify the default MIME type for unspecified files as `application/octet-stream`. We do this to indicate that a file is binary data, instructing the server and client to treat the file as raw bytes instead of interpreting it as text or any other format.

```nginx
default_type  application/octet-stream;
```

Additionally we add a `types` block and define certain MIME types. Like this NGINX identifies the file type for each response and sets the corresponding `Content-Type` header in HTTP responses. This enables browsers and clients to interpret content accurately,

```nginx
types {
	text/html html;
	text/css css;
	application/javascript js;
	application/wasm wasm;
}
```

We also enable compression for `.wasm` and `.js` files, primarily used for the runtime chunks, within our server block.

```nginx
	gzip on;
	gzip_types      application/javascript application/wasm;
```

To ensure NGINX generates relative redirects, we disable the absolute redirect option within our location block.

```nginx
absolute_redirect off;
```

### Get rid of 404 not found messages

To get rid of `404 not found` browser console messages when self hosting a runtime build of CheerpJ, you can use the `try_files` option with NGINX.

```nginx {4}
	location / {
		root /home/path/to/cheerpj;
		autoindex on;
		try_files $uri $uri/ =204;
	}
```

With the `try_files` directive, NGINX will return a `204` status code for any files that are not found. This indicates that the request was processed successfully but no content is returned.



---
File: /docs/11-guides/cheerpj-debug.mdx
---

---
title: Debugging CheerpJ
description: How to properly debug CheerpJ in the browser
---

import { DISCORD_URL } from "@/consts.ts";

Sometimes, you might encounter issues or experience unexpected behavior when using CheerpJ. Don’t worry if that happens — this guide will help you troubleshoot the problem and gather essential resources, in case you need further assistance with debugging.

## What to do if my application does not work with CheerpJ?

The reason your application isn't working could be quite simple. Try these checks to ensure you've deployed and integrated CheerpJ correctly:

- You integrated CheerpJ into your web page by adding a `<script>` tag like this:

```html
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

- The location of your JARs is correct and the prefix `/app/` is added when passing it to [`cheerpjRunJar`] or [`cheerpjRunMain`]. For more information visit the [virtual filesystem] guide.
- Your Java application functions normally on your local machine without CheerpJ.
- You are not opening the page by double-clicking on it; instead, you are using an HTTP server.
- Your application files are hosted using an HTTP server and are accessible through the browser.

If your application passes all these checks but still isn't working correctly, you may need additional assistance from us. You can request help through our <a href={DISCORD_URL} target="_blank">Discord</a> server.

If you do so, make sure to provide additional context, such as a HAR file and the browser's console output. This will make it easier for us to assist you. Instructions on how to generate these are provided in the following steps.

## Enable advanced debug logs in CheerpJ

Before saving the browser console output, it might be helpful to enable advanced debug logs in CheerpJ using the [`enableDebug`] CheerpJ [`initOption`].

```js
cheerpjInit({ enableDebug: true });
```

This option enables advanced debug logging, which is helpful for troubleshooting certain issues with CheerpJ. It provides a lot of extra information in case an actual error occurs and will speed up the process of solving the problem you are encountering.

Adding this option is not always necessary, but in some cases, these advanced logs are helpful if the normal console log does not provide any useful information.

## Saving the browser console output

You can follow these steps to save the browser console output:

- Open your browser and navigate to the application that you are testing with CheerpJ.
- Open the developer tools in your browser. You can do that by pressing **F12** on your keyboard. Alternatively you can click on the three dots on the top right corner of your browser, select **More tools** and then click **Developer Tools**.
  ![Open the developer tools](/docs/cheerpj3/assets/open-dev-tools.png)
- Once the developer tools are open, navigate to the **Console** tab. If you can't see the **Console** tab, you might need to clik on the **+** symbol in Edge, or the **>>** symbol in Chrome, and then select **Console**.
- If needed, trigger the error in your application.
- To save the console output, right click on any message in the console tab and select **Save as…**
  ![Open the developer tools](/docs/cheerpj3/assets/save-console.png)
- You can now save the console log to a file and forward it to us.

## Extracting a HAR file

A HAR file (HTTP Archive file) is a log of a web browser's interaction with a website. They are very useful for debugging web applications, as they help us diagnose issues related to loading times, network errors, or incorrect responses from a server.

You can save a HAR following these steps:

- Open the developer tools in your browser. You can do that by pressing **F12** on your keyboard. Alternatively you can click on the three dots on the top right corner of your browser, select **More tools** and then click **Developer Tools**.
  ![Open the developer tools](/docs/cheerpj3/assets/open-dev-tools.png)
- Now navigate to the application that you are testing with CheerpJ. Or if you already visited the page, reload it. This is to make sure the HAR file will be complete and no entries are missing.
- Navigate to the **Network** tab in the developer tools. If you can't see the **Network** tab, you might need to clik on the **+** symbol in Edge, or the **>>** symbol in Chrome, and then select **Network**.
- If needed, trigger the error in your application.
- To download the HAR file you need to click the download icon **↓** at the top right of the networking tab.
  ![Open the developer tools](/docs/cheerpj3/assets/network-tab.png)
- You can now save the HAR file and forward it to us to us in Discord or via Github.

[`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
[`cheerpjRunMain`]: /docs/reference/cheerpjRunMain
[virtual filesystem]: /docs/guides/File-System-support
[`enableDebug`]: /docs/reference/cheerpjInit#enableDebug
[`initOption`]: /docs/reference/cheerpjInit



---
File: /docs/11-guides/File-System-support.md
---

---
title: Files and filesystems
description: Virtual filesystems and how to use them
---

CheerpJ filesystems are implemented as UNIX-style virtual filesystems with multiple mount points:

| Mount     | Description                                                        | Write     | Read |
| --------- | ------------------------------------------------------------------ | --------- | ---- |
| `/app/`   | An HTTP-based filesystem for loading files from the web server     | No        | Yes  |
| `/files/` | A persistent read-write file system                                | Java only | Yes  |
| `/str/`   | A filesystem for passing JavaScript strings or binary data to Java | JS only   | Yes  |

![](/docs/cheerpj3/assets/filesystem.png)

> [!info] Local files
> CheerpJ provides access to a virtualized filesystem, which does not correspond to the local user's computer. Accessing local files directly is forbidden for browser security reasons.

## `/app/` mount point

The `/app/` mount point corresponds to a virtual read-only, HTTP-based filesystem. `/app/` can be used for multiple purposes including accessing JAR files and data from your local server.

The `/app/` mount point refers to the root of your web server. When a file is read from `/app/`, CheerpJ will make an HTTP(S) request to fetch the file.

To have a clearer concept of the `/app/` mount point, let's assume that HTML file with the CheerpJ application is served from the `http://127.0.0.1:8080/` origin:

- `/app/example.jar` would be the same as `http://127.0.0.1:8080/example.jar`

- `/app/subdirectory/example.txt` would be the same as `http://127.0.0.1:8080/subdirectory/example.txt`

Considering the examples above, to run a JAR with [`cheerpjRunJar`] and assuming it is stored in the root of the web server, it should be done as follows:

```js
cheerpjRunJar("/app/my_application_archive.jar");
```

> [!tip] JAR file locations
> The `/app/` mount point is the most common location to store the application's JARs but this is not mandatory. For example, you could write a JAR file into `/str/` with JS and then run that.

## `/files/` mount point

The `/files/` mount point corresponds to a virtual read-write, IndexedDB-based filesystem and it is used to store persistent data in the browser client.

Use this for storing data that should persist between sessions, such as user preferences.

Writing files into the `/files/` mount point is only possible from inside the Java application. For example:

```java
File file = new File("/files/myfile.ext");
OutputStream out = new FileOutputStream(file);
out.close();
```

> [!tip] About data persistency
> The data in this mount-point would persist even when closing the application and re-launching it. In the scenario of wiping out the browser's data or using the browser as "incognito" data will be evicted. This behaviour may vary depending in the browser used among other scenarios.

For more information about browser's data eviction and persistency please visit [this page](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria#when_is_data_evicted).

## `/str/` mount point

The `/str/` mount point is a simple filesystem that can be populated from JavaScript to share data with Java code. This filesystem is read-only from Java.

### Writing files with JavaScript

From JavaScript, it is possible to add files into the filesystem using the [`cheerpOSAddStringFile`] API. Example:

```js
cheerpOSAddStringFile("/str/fileName.txt", "Some text in a JS String");
```

Then, you can access this data from Java, for example:

```java

import java.io.FileReader;

...
FileReader f = new FileReader("/str/fileName.txt")
...

```

The `cheerpOSAddStringFile` API can be used with JavaScript `String`s or `Uint8Array`s. `Uint8Array`s may be useful to provide binary data to the Java application. For example, a selected file coming from an HTML5 `<input type="file">` tag.

## Reading files with JavaScript

To read files from any of the mount-points using JavaScript, you must use the [`cjFileBlob`] API as follows:

```js
const blob = await cjFileBlob("/files/myfile.ext");
const text = await blob.text();
console.log(text);
```

[`cjFileBlob`]: /docs/reference/cjFileBlob
[`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
[`cheerpOSAddStringFile`]: /docs/reference/cheerpOSAddStringFile



---
File: /docs/11-guides/implementing-native-libraries.md
---

---
title: Implementing Native Libraries
description: Java Native Interface (JNI) with CheerpJ
---

In this guide, we’ll explore how to use **native libraries** in CheerpJ to implement Java native methods in JavaScript.

Native libraries in Java are typically loaded with the `System.loadLibrary` method allowing a Java program to call functions implemented in another language. This function is part of the **Java Native Interface (JNI)**, the same interface used to work with Java native methods, which we covered in the [`Implementing Native Methods guide`].

Unlike [`native methods`], native libraries are not restricted to a single Java class. They can be accessed by multiple classes and even be shared across an entire application.

## Using `System.loadLibrary` for shared libraries

[`System.loadLibrary(String libname)`] is a Java method that loads a shared library into the application, making the native methods within the library accessible to Java code. The Java runtime searches each path in `java.library.path` for the library file with the correct format for the operating system (`.so`, `.dll`, or `.dylib` on Linux, Windows, and macOS, respectively).

CheerpJ adapts this concept to load JavaScript modules, using the same `System.loadLibrary` call to load `.js` files. These files are JavaScript modules that define implementations for the native methods associated with the library.

## Steps to implement native libraries in CheerpJ

In general, we can implement native libraries in CheerpJ by following these steps:

1. Create a Java class that loads the JavaScript library and declares the native methods.
2. Create a JavaScript module that implements the native methods.
3. Load the native library in the Java class with CheerpJ.

### Loading native nibraries and declaring native methods in Java

To declare a native method in Java, use the `native` keyword in the method declaration. The method is defined in the Java class but is not implemented in Java. Instead, the implementation will be provided in the native library JavaScript module which is loaded with `System.loadLibrary`.

```java
public class ClassName {
  // Load the library file
  static {
    System.loadLibrary("<library-name>");
  }

  // Native method declaration
  private native void methodName(param1, param2, ...);
}
```

### Creating a JavaScript module

A JavaScript module is a file that contains code which can be exported and imported by other files for better organization and reuse. You create modules using the `export` keyword to expose classes, methods, or other resources, and you can use `export default` to make a primary, easy-to-import item from the module. For more information on JavaScript modules, check out the official [`documentation`].

```js title="module.js"
export default {
	// JavaScript code
};
```

JavaScript functions that implement native methods should follow a specific naming convention - `Java_<fully-qualified-class-name>_<method-name>`. For instance, if `com.foo.Bar` has a native method called `baz`, the function will be called `Java_com_foo_Bar_baz`

The JavaScript function should accept the following parameters:

- A [`CJ3Library`] object `lib` as the first parameter, which provides access to other classes and methods within the library.
- `self` as the second parameter, the instance of the Java class calling the native method. This parameter can be omitted for static native methods.
- The native method’s parameters as subsequent parameters.

The function can return a value or a Promise that resolves to a value. The function syntax is as follows:

```js
async function Java_<fully-qualified-class-name>_<method-name>(lib, self, param1, param2, ...) {
  // Implementation
}
```

> [!info] Handling Static Native Methods
> If the native method is static, the `self` parameter can be omitted.

### Initializing CheerpJ with the `javaProperties` option

To use a native library in CheerpJ, you need to set the `java.library.path` property to the directory containing the JavaScript module file that implements the native methods. This is done by passing the `javaProperties` option to the `cheerpjInit` function:

```js
await cheerpjInit({ javaProperties: ["java.library.path=/app/<path>"] });
```

`/app/` is a [`virtual directory`] in CheerpJ that corresponds to the root directory of the application.

## Example walkthrough

In the following example, we’ll see how to create a native library in JavaScript, load it into Java with `System.loadLibrary`, and call a native method through this library from a Java class.

1. Let's start with a Java class that loads a native library and declares a native method, `alert`, that displays an alert message in the browser.

```java title="Example.java"
public class Example {
  // Load the native.js library file
  static {
    System.loadLibrary("native");
  }

  public static void main(String[] args) {
    new Example().alert("Hello, world!");
  }

  // Native method declaration
  private native void alert(String message);
}
```

2. Next, we create a JavaScript module, `native.js`, that implements the `alert` method to display an alert dialog in the browser.

```js title="native.js"
export default {
	async Java_Example_alert(lib, message) {
		window.alert(message);
	},
};
```

3. Finally, we initialize CheerpJ with the [`javaProperties`] option to set the `java.library.path` to the directory containing the `native.js` file. Then, we run the Java `Example` class.

```html title="index.html" {9,10}
<!doctype html>
<html>
	<head>
		<title>Native Method Example</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<script>
			await cheerpjInit({ javaProperties: ["java.library.path=/app/"] });
			await cheerpjRunMain("Example", "/app/");
		</script>
	</body>
</html>
```

In this example, we set the `java.library.path` to `/app/`, which is the directory where the JavaScript file implementing the native methods is located. The folder structure should look like this:

```
root/
  ├── Example.class
  ├── native.js
  ├── index.html
```

When the Java `Example` class is run, the `alert` method is called, which triggers the `Java_Example_alert` function in `native.js`, displaying an alert dialog with the message "Hello, world!".

[`CJ3Library`]: /docs/reference/CJ3Library
[`conversion rules`]: /docs/reference/cheerpjRunLibrary#conversion-rules
[`System.loadLibrary(String libname)`]: https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#loadLibrary-java.lang.String-
[`native methods`]: /docs/guides/implementing-native-methods
[`Implementing Native Methods guide`]: /docs/guides/implementing-native-methods
[`virtual directory`]: /docs/guides/File-System-support
[`javaProperties`]: /docs/reference/cheerpjInit#javaproperties
[`documentation`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules



---
File: /docs/11-guides/implementing-native-methods.md
---

---
title: Implementing Native Methods
description: Java Native Interface (JNI) with CheerpJ
---

CheerpJ allows one to implement Java native methods (typically written in C/C++ or another AOT-compiled language) directly in JavaScript, similar to the Java Native Interface (JNI) in standard Java.

In Java, native methods are identified by the `native` keyword in their declaration. These methods are not implemented in Java but are instead defined in an external language, which in the case of CheerpJ, is JavaScript.

## Overview

In general, we can implement native methods in CheerpJ by following these steps:

1. Declare a native method in Java using the `native` keyword.
2. Implement the native method in JavaScript.
3. Pass the native function to CheerpJ.

## Declaring Native Methods in Java

To declare a native method in Java, use the `native` keyword in the method declaration. Here’s an example of a Java class with a native method:

```java title="Example.java"
public class Example {
  public static void main(String[] args) {
    nativeAlert("Hello, world!");
  }

  public static native void nativeAlert(String message);
}
```

The method is defined in the Java class but is not implemented in Java. Instead, the implementation will be provided in JavaScript.

## Implementing Native Methods in JavaScript

To implement a native method in JavaScript, create an `async` function that follows the naming convention `Java_<fully-qualified-class-name>_<method-name>`. For instance, if `com.foo.Bar` has a native method called `baz`, its object key is `Java_com_foo_Bar_baz`. The function takes:

- A [`CJ3Library`] object `lib` as the first parameter, which provides access to other classes and methods within the library. The `lib` parameter can be used to call back into the Java class that calls the native method.
- `self` as the second parameter, the instance of the Java class calling the native method. This parameter can be omitted for static native methods.
- The native method’s parameters as subsequent parameters.

And returns a value or a Promise that resolves to a value. The function syntax is as follows:

```js
async function Java_<fully-qualified-class-name>_<method-name>(lib, self, param1, param2, ...) {
  // Implementation
}
```

> [!info] Handling Static Native Methods
> If the native method is static, the `self` parameter can be omitted.

## Calling back into Java from JavaScript

It is possible to call back into Java using the `lib` parameter received in the JavaScript implementation of the native Java method.

Let’s take this simple Java class as an example:

```java title="Example.java"
public class Example {
  public static native void nativeFunction();

  public static void printJava() {
    System.out.println("Hello from Java!");
  }

  public static void main(String[] args) {
    nativeFunction();
  }
}
```

The `Example` class includes a `native` function that will be implemented in JavaScript, and a public print function that outputs `Hello from Java!`.
In the JavaScript implementation of `nativeFunction`, we can use the `lib` parameter to call back into the `Example` Java class and invoke the `printJava()` function from JavaScript.

```js
async function Java_Example_nativeFunction(lib) {
	const Example = await lib.Example;
	await Example.printJava();
}
```

This functionality is useful when you need to call back into the Java class in response to a native function call. If you need to call back into Java outside the context of a native function, you can use a long-running Java thread. You can learn more about how to achieve this in our [`Java and JavaScript Interoperability`] tutorial.

## Passing Native Functions to CheerpJ

To use the native method in CheerpJ, pass the function to the [`cheerpjInit`] function as a property of the [`natives`] option. You can pass:

1. **The function definition directly**:

```js
await cheerpjInit({
	natives: {
		async Java_Example_nativeAlert(lib, str) {
			window.alert(str);
		},
	},
});
```

2. **Or just the function name if it was defined earlier**:

```js
async function Java_Example_nativeAlert(lib, str) {
	window.alert(str);
}

await cheerpjInit({ natives: { Java_Example_nativeAlert } });
```

## Converting Parameters and Return Values

Parameters and return values of JNI calls are automatically converted between JavaScript and Java types based on [`conversion rules`].

## Example Walkthrough

Here’s a full example that demonstrates the native method setup in Java and its JavaScript implementation.

1. Declare a native method in Java using the `native` keyword:

```java title="Example.java"
public class Example {
  public static void main(String[] args) {
    nativeAlert("Hello, world!");
  }

  public static native void nativeAlert(String message);
}
```

2. Implement the native method by creating an `async` function in JavaScript that follows the naming convention `Java_<fully-qualified-class-name>_<method-name>`.

```js title="index.html"
async function Java_Example_nativeAlert(lib, str) {
	window.alert(str);
}
```

Here, we provide an implementation for the `nativeAlert` method in the `Example` class, by creating a function named `Java_Example_nativeAlert`. The function displays an alert dialog with the message using `window.alert`.

3. Initialize CheerpJ with the `natives` option and pass the native method implementation to [`cheerpjInit`]:

```html title="index.html" {13}
<!doctype html>
<html>
	<head>
		<title>Native Method Example</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<script>
			async function Java_Example_nativeAlert(lib, str) {
			  window.alert(str);
			}

			await cheerpjInit({ natives: { Java_Example_nativeAlert } });
			await cheerpjRunMain("Example", "/app/");
		</script>
	</body>
</html>
```

In this setup, [`cheerpjInit`] loads `Java_Example_nativeAlert` as the native method implementation. When `Example.nativeAlert` is called in Java, it triggers the JavaScript `Java_Example_nativeAlert` function, displaying an alert dialog with the message.

[`natives`]: /docs/reference/cheerpjInit#natives
[`CJ3Library`]: /docs/reference/CJ3Library
[`conversion rules`]: /docs/reference/CJ3Library#conversion-rules
[`cheerpjInit`]: /docs/reference/cheerpjInit
[`Java and JavaScript Interoperability`]: /docs/tutorials/interoperability-tutorial



---
File: /docs/11-guides/Intercept-external-commands.md
---

---
title: Intercept external commands
description: How to intercept external system commands that are executed in a Java application
---

When a Java program needs to execute an external system command, it often uses methods like `Runtime.getRuntime().exec(command)` or `ProcessBuilder(command)`. For example, a Java application might run a command to open a new browser window, launch a script, or execute a platform-specific utility. By default, these commands would execute directly on the system where the Java application runs.

With the [`execCallback`] [`cheerpjInit`] option, you can redirect those external commands to a JavaScript callback function. This allows you to control how commands are handled, enabling you to implement equivalent functionality in JavaScript.

> [!note] Important
> The `execCallback` option is supported in CheerpJ 3.1 and later versions.

## execCallback option

The [`execCallback`] option takes a function as a parameter, which will be called by CheerpJ whenever an external command is intercepted. CheerpJ automatically forwards all the necessary information about the intercepted command to this callback, allowing you to implement its behavior in JavaScript.

The JavaScript callback function accepts two parameters:

- `cmdPath`: The command that would have been executed in Java.
- `argsArray`: An array containing any additional arguments that were passed to the command.

These parameters provide all the context you need to handle the intercepted command.

## Example walkthrough

Let's walk through a simple example in Java:

```java title="Example.java"
import java.io.IOException;

public class Example
{
	public static void main(String[] a) throws IOException, InterruptedException
	{
		String url = "http://www.example.com";
		// The xdg-open command opens a URL in the default browser on Linux
		String command = "xdg-open " + url;
		Runtime.getRuntime().exec(command);
	}
}
```

In this example, the Java program uses `Runtime.getRuntime().exec(command)` to open a URL in the default web browser on a Linux system. The command `xdg-open` is typically used to launch a URL in the browser. On Windows, a similar behavior is achieved with the command `cmd /c start`.

We can now implement the same behavior in JavaScript, here’s how:

```ts title="Index.html"
function execCb(cmdPath, argsArray) {
	// Check for the xdg-open command
	if (cmdPath == "xdg-open") {
		// Open a new browser window
		// argsArray will be "http://www.example.com" in our case
		window.open(argsArray, "_blank");
	}
}
```

In this JavaScript function, we check if the incoming command is `xdg-open`. If it matches, we use `window.open()` to open a new browser tab with the specified URL.

We can now pass this function to [`cheerpjInit`] using the [`execCallback`] option. This ensures that the function is invoked whenever an external command is executed in Java.

```ts title="index.html"
function execCb(cmdPath, argsArray) {
	if (cmdPath == "xdg-open") {
		window.open(argsArray, "_blank");
	}
}

(async function () {
	await cheerpjInit({ execCallback: execCb });
	await cheerpjRunMain("/app/Example");
})();
```

By doing this, we successfully intercept the `Runtime.getRuntime().exec(command)` call from the Java application and implemented the same functionality using JavaScript to open a new browser window.

[`execCallback`]: /docs/reference/cheerpjInit#execcallback
[`cheerpjInit`]: /docs/reference/cheerpjInit



---
File: /docs/11-guides/library-mode.md
---

---
title: Library mode
description: Use Java libraries in JavaScript
---

Library mode allows you to directly use Java methods, objects, and arrays from JavaScript. This API has been designed to take advantage of async/await to feel more natural to use, without sacrificing any flexibility.

Loading a library is as simple as calling [`cheerpjRunLibrary`].

```js
async function libraryModeTour() {
	await cheerpjInit();

	// Create a library mode object
	const lib = await cheerpjRunLibrary(""); // "" means standard library only

	// Resolve the Java classes we are going to use
	const ArrayList = await lib.java.util.ArrayList;
	const Point = await lib.java.awt.Point;
	const System = await lib.java.lang.System;

	// Create a new list object
	const points = await new ArrayList();

	// Create 4 point objects
	for (let i = 0; i < 4; i++) {
		// Allocate the point
		const p = await new Point(i, 0);

		// Add the point to the list
		await points.add(p);
	}

	// Convert to list to an Object[] array
	const a = await points.toArray();

	// Iterate on the array and set y = x
	for (let i = 0; i < a.length; i++) {
		// Fields can be read and written directly
		a[i].y = a[i].x;
	}

	// Convert all the elements to Strings
	for (let i = 0; i < a.length; i++) {
		// Java arrays can be read and written directly
		a[i] = await a[i].toString();
	}

	// Print them out
	for (let i = 0; i < a.length; i++) {
		// Static fields can be accessed too
		await System.out.println(a[i]);
	}
}
```

Library mode can be used to integrate powerful Java libraries into your Web application. As a practical example, these few lines of code make it possible to generate a PDF from JavaScript using the popular iText library:

```js
async function iTextExample() {
	await cheerpjInit();

	const lib = await cheerpjRunLibrary("/app/itextpdf-5.5.13.3.jar");

	try {
		const Document = await lib.com.itextpdf.text.Document;
		const Paragraph = await lib.com.itextpdf.text.Paragraph;
		const PdfWriter = await lib.com.itextpdf.text.pdf.PdfWriter;
		const FileOutputStream = await lib.java.io.FileOutputStream;

		const document = await new Document();
		const writer = await PdfWriter.getInstance(
			document,
			await new FileOutputStream("/files/HelloIText.pdf")
		);

		await document.open();
		await document.add(await new Paragraph("Hello World!"));
		await document.close();
		await writer.close();

		const blob = await cjFileBlob("/files/HelloIText.pdf");
		const url = URL.createObjectURL(blob);
		pdfDisplay.data = url;
	} catch (e) {
		const IOException = await lib.java.io.IOException;

		if (e instanceof IOException) console.log("I/O error");
		else console.log("Unknown error: " + (await e.getMessage()));
	}
}
```

## See also

Library mode is also used for [native methods implemented in JavaScript][JNI]. A `native` is effectively just a shorter library mode session.

[JNI]: /docs/guides/implementing-native-methods
[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary



---
File: /docs/11-guides/Networking.md
---

---
title: Networking
description: Networking with CheerpJ
---

CheerpJ supports different networking scenarios that are divided into two categories:

- Same-origin HTTP/HTTPS requests using fetch seamlessly.
- Generalized networking via Tailscale (anything else that is not HTTP(S) such as opening TCP/UDP sockets).

## Same origin HTTP/HTTPS requests

A Java application running in the browser with CheerpJ can request resources to the local server (same origin) via fetch through the HTTP/HTTPS protocols. As expected, these requests are asynchronous. Remember that for a request to be considered same-origin, it needs to match the scheme, host name and port between the requester and the receiver.

With CheerpJ you can perform `fetch()` requests with the [browser fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) as usual.

## Generalized networking

CheerpJ supports wider networking scenarios via Tailscale, which is a VPN technology using WebSockets and a transport layer. Tailscale enables the Java application to access private network services, peer-to-peer connections or connect to the wider internet.

[Tailscale](https://tailscale.com/) is based on the [WireGuard](https://www.wireguard.com/) protocol. It includes a control plane that manages the WireGuard keys of all the machines in the network and takes care of authenticating users. Using this service provides more control over the network, user connections, authentication, security etc.

![CheerpJ 3.0 general networking](/docs/cheerpj3/assets/general_networking.png)

### Why Tailscale?

To support networking beyond same origin requests, it is necessary to host a proxy server. CheerpJ cannot become responsible for the user's traffic as every application is different and its networking traffic should be managed internally and according to their needs.

When it comes to generalised networking scenarios, there are some browser-enforced limitations to enhance users' security. These limitations are bound to the browser not exposing access to lower-level protocols such as UDP and TCP. The browser only allows one to perform HTTP(S) requests ruled by CORS policies.

A good example of this scenario is when an application uses WebSockets, where there is a two-way interaction between two end-points in an event-driven manner. A WebSocket connection starts with a request from the browser via HTTP that when accepted, this connection is upgraded and does not conform to the HTTP protocol anymore. This way the user and the server (or any other end-point) can keep a connection and send bidirectional messages until this connection is closed from one of the end-points. Upgrading the WebSocket connection protocol and unwrapping packets before sending them to the destinations requires a proxy server.

These limitations have been overcome by supporting networking via Tailscale, which allows one to use its VPN via its WebSocket proxy, meaning the perfect solution for the limitations described above.

### Installing Tailscale

The easiest way to enable generalized networking on your Java application without modifying the source code is to [install Tailscale](https://tailscale.com/kb/1017/install) on your local server. This way the client can connect to your private Tailscale network via an auth key, and then talk to your server via the VPN.

### Connecting your application to a Tailscale network

Connecting the Java application client to your Tailscale network is as simple as providing client authentication via `cheerpjInit()`:

Example for pre-authenticated users/devices:

```js
cheerpjInit({
	tailscaleControlUrl: "https://my.url.com/",
	tailscaleAuthKey: "AuthKeyStringGoesHere",
});
```

> [!info] Info
> A combination of a user and a device connected to a Tailscale network is called a _"node"_ in Tailscale terminology.

What is happening here?

- `tailscaleControlUrl` is a string URL of the Tailscale control plane which verifies the user's identity. Only pass this option if you are [self-hosting Tailscale](/docs/guides/Networking#self-hosting-headscale).
- `tailscaleAuthKey` is string with an auth key to register new users/devices that are pre-authenticated. You can create an auth key [here](https://login.tailscale.com/admin/settings/keys).

Example to prompt the user for manual login on a different tab:

```html
<a id="loginLink">Click here to login to Tailscale</a>
```

```js
const loginElem = document.getElementById("loginLink");

cheerpjInit({
	tailscaleControlUrl: "https://my.url.com/",
	tailscaleLoginUrlCb: function (url) {
		loginElem.href = url;
		loginElem.target = "_blank";
		// continue with login
	},
});
```

What is happening here?

- `tailscaleLoginUrlCb` expects the base URL of a control server that will continue and finish the login process. This callback is executed when it is time to prompt the user to log in to Tailscale via the UI.

> [!info] Info
> `tailscaleLoginUrlCb` and `tailscaleAuthKey` are mutually exclusive.

To learn more about CheerpJ's Tailscale APIs please visit [the reference](/docs/reference/cheerpjInit#tailscalecontrolurl).

### Self-hosting Headscale

Headscale is an open-source and self-hosted implementation of the Tailscale control server. To work with Headscale and CheerpJ we suggest using [this fork](https://github.com/leaningtech/headscale).



---
File: /docs/11-guides/Startup-time-optimization.md
---

---
title: Resource preloading
description: Improves application startup time
---

Traditionally, users had to have Java preinstalled on their computer in order to run Java applications and applets. CheerpJ compiles Java to HTML5/JavaScript, allowing to run applications and applets on browser without users having to install any additional dependency on their computer. Similarly to their JVM counterparts, applications compiled to JavaScript with CheerpJ require runtime components to be loaded during execution. In CheerpJ, runtime components are JavaScript modules that are loaded on demand, only if required.

The CheerpJ runtime is highly optimised to minimise the total download size of an 'average' application, totalling 10-20MB of data for a typical download (as a point of comparison, the approximate size of the Java runtime installer is over 60MB). All downloaded components of CheerpJ are cached by the browser, which reduces the download time in subsequent executions of a same application.

CheerpJ cannot predict which runtime resources will be required by an arbitrary application. CheerpJ runtime resources are therefore loaded on demand, one after the other, depending on the requirements of the application at run time.

To take advantage of parallel downloads, and reduce download and startup time of a specific application in production, CheerpJ allows one to pre-specify a list of resources (CheerpJ runtime modules) to be loaded at startup.

This list of resources is to be specified manually when starting the CheerpJ environment in an HTML page. We also provide a simple profiling tool to automatically record and output a list of used resources during the execution of an application.

By combining the use of this profiler together with the preloader, one can highly optimise the initial download and startup time of an application. Taking advantage of this is a simple 2-step process:

1. Run the application normally using CheerpJ. After the application is loaded, open the JavaScript console of the browser (e.g. Ctrl+Shift+I on many browsers), and type:

```js
cjGetRuntimeResources();
```

The result will look like this:

```js
{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}
```

If the output is not visible fully, you can use:

```js
document.write(cjGetRuntimeResources());
```

The JavaScript console may enclose the string between quotes (`"`), which you should ignore. See [here](/docs/reference/cjGetRuntimeResources) for more information.

2. Modify the CheerpJ integration to enable preloading. You will only need to change the `cheerpjInit` call, to pass the `preloadResources` option. For example:

```js
cheerpjInit({ preloadResources: {"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]} });
```

> [!note] Important
> Please note that this has to be done in two steps, so the resources are loaded in a separate session from the full workflow.

See [here](/docs/reference/cheerpjInit#preloadresources) for more information.

When preloading is enabled CheerpJ will be able to download multiple resources in parallel with the execution of the program. This will greatly improve loading time.



---
File: /docs/12-reference/00-cheerpjInit.md
---

---
title: cheerpjInit
description: Set up and initialize the CheerpJ runtime environment
---

`cheerpjInit` must be called once in the page to setup and initialise the CheerpJ runtime environment.

```ts
async function cheerpjInit(options?: {
	version?: number;
	status?: "splash" | "none" | "default";
	logCanvasUpdates?: boolean;
	preloadResources?: { [key: string]: number[] };
	preloadProgress?: (preloadDone: number, preloadTotal: number) => void;
	clipboardMode?: "permission" | "system" | "java";
	beepCallback?: () => void;
	enableInputMethods?: boolean;
	overrideShortcuts?: (evt: KeyboardEvent) => boolean;
	appletParamFilter?: (originalName: string, paramValue: string) => string;
	natives?: { [method: string]: Function };
	overrideDocumentBase?: string;
	javaProperties?: string[];
	tailscaleControlUrl?: string;
	tailscaleDnsIp?: string;
	tailscaleAuthKey?: string;
	tailscaleLoginUrlCb?: (url: string) => void;
	tailscaleIpCb?: (ip: string) => void;
	licenseKey?: string;
	execCallback?: (cmdPath: string, argsArray: string[]) => void;
	enableDebug?: boolean;
}): Promise<void>;
```

## Parameters

- **options (`object`, _optional_)** - Used to configure different settings of the CheerpJ runtime environment in the form `{ option: "value" }`.

## Returns

`cheerpjInit` returns a [Promise] which is resolved when the CheerpJ runtime environment is ready to be used.

## Options

A description of each `cheerpjInit()` option with brief examples are given below.

### `version`

```ts
version?: number;
```

The Java runtime version to use. Java `8` and Java `11` are currently supported. Default version is Java `8` if not specified.

> [!info] Java Applets and Java 8
> Please notice that Applets are supported on Java 8 only.

### `status`

```ts
status?: "splash" | "none" | "default";

```

This option determines the level of verbosity of CheerpJ in reporting status updates.

- `"default"`: Enables status reporting during initialization and short-lived "Loading..." messages every time new runtime code is being downloaded.
- `"splash"`: Enabled status reporting only during initialization. There will be no feedback after the first window is shown on screen.
- `"none"`: Disable all status reporting.

Example:

```js
cheerpjInit({ status: "splash" });
```

### `logCanvasUpdates`

```ts
logCanvasUpdates?: boolean;
```

When set to `true`, it enables logs on the console about the display areas which are being updated. Useful to debug overdrawing.

Example:

```js
cheerpjInit({ logCanvasUpdates: true });
```

### `preloadResources`<a name="preloadResources"></a>

```ts
preloadResources?: { [key: string]: number[] };
```

By using `preloadResources`, you can provide CheerpJ with a list of runtime files which you know in advance will be required for the specific application. The list should be given as a JavaScript array of strings.

Example:

```js
cheerpjInit({ preloadResources: {"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]} });
```

See also [cjGetRuntimeResources].

### `preloadProgress`<a name="preloadProgress"></a>

```ts
preloadProgress?: (preloadDone: number, preloadTotal: number) => void;
```

This callback may be used in combination with [`preloadResources`](#preloadresources) to monitor the loading of an application. The information provided is useful, for example, to display a loading/progress bar.

Example:

```js
function showPreloadProgress(preloadDone, preloadTotal) {
	console.log("Percentage loaded " + (preloadDone * 100) / preloadTotal);
}

await cheerpjInit({ preloadProgress: showPreloadProgress });
```

### `clipboardMode`

```ts
clipboardMode?: "permission" | "system" | "java";
```

This option allows you to configure how the clipboard will behave. Supported clipboard modes are [`java`], [`system`] and [`permission`].

Example:

```js
cheerpjInit({ clipboardMode: "system" });
```

#### `java` mode

This is the default setting. CheerpJ supports an internal clipboard which is local to the Java application and is not integrated with the system clipboard.

#### `system` mode

In `system` mode CheerpJ will share the clipboard with the system. Browsers enforce serious limitations on how the system clipboard can be accessed. In practice it is generally accessible when the `Ctrl+C` and `Ctrl+V` shortcuts are used (`Cmd+C` and `Cmd+V` on MacOSX). Due to these limitations the UX when using `clipboardMode:"system"` is:

- `Ctrl+C`/`Cmd+C`: the user has to press the shortcut twice to give CheerpJ access to the system clipboard. CheerpJ will block the execution while waiting for the second `Ctrl+C`.
- `Ctrl+V`/`Cmd+V`: this shortcut behaves normally, there is no difference with native execution.
- Menu based Copy/Paste: `Ctrl+C`/`Ctrl+V` are needed to access the clipboard. CheerpJ will block the execution while waiting the appropriate shortcut.

#### `permission` mode

With `permission` mode enabled, CheerpJ offers a more seamless integration than `system` mode. This includes support for images and HTML on top of plain text. Another important feature is that pressing extra `Ctrl+C`/`Ctrl+V` to perform copying and pasting operations is not required.

The first time an operation is requested, the user will be asked for permission to use the clipboard. If this permission is refused, a message will be prompted explaining this permission is necessary to continue.

> This mode is experimental and might show a few inconsistencies in some browsers. [`See more`](https://caniuse.com/mdn-api_permissions_permission_clipboard-read).

### `beepCallback`

```ts
beepCallback?: () => void;
```

This callback runs when `java.awt.Toolkit.getDefaultToolkit().beep()` is called in Java. It corresponds to the system's _beep_ sound.

Example of usage:

```js
cheerpjInit({
	beepCallback: function () {
		alert("Beep!");
	},
});
```

### `enableInputMethods`

```ts
enableInputMethods?: boolean;
```

When this option is set to `true` CheerpJ will be able to receive text input from the input method framework of the platform. This is useful to support text input for languages such as Chinese, Japanese and Korean.

```js
cheerpjInit({ enableInputMethods: true });
```

> [!note] Important
> This option is enabled by default in CheerpJ 4.0 and newer, to disable it set it to `false`.

### `overrideShortcuts`

```ts
overrideShortcuts?: (evt: KeyboardEvent) => boolean;
```

Some applications needs to internally handle keyboard shortcuts which are also used by the browser, for example Ctrl+F. Most users expect the standard browser behavior for these shortcuts and CheerpJ does not, by default, override them in any way.

A CheerpJ-compiled application can take control of additional shortcuts by providing a callback function as the `overrideShortcuts` options of `cheerpjInit`. This callback receives the `KeyboardEvent` coming from the browser and should return `true` if the default browser behaviour should be prevented.

Whenever possible we recommend _not_ to use browser reserved shortcuts, to maintain a consistent user experience. In any case, the following limitations apply:

- Some shortcuts (Ctrl+T, Ctrl+N, Ctrl+W) are reserved by the browser and never received by the page itself. These _cannot_ be overridden
- Overriding (Ctrl+C/Ctrl+V) will prevent `clipboardMode:"system"` from working correctly.

Example:

```js
cheerpjInit({
	overrideShortcuts: function (e) {
		// Let Java handle Ctrl+F
		if (e.ctrlKey && e.keyCode == 70) return true;
		return false;
	},
});
```

### `appletParamFilter`

```ts
appletParamFilter?: (originalName: string, paramValue: string) => string;
```

Some applications may need to have some parameter modified before getting those inside the applet.

Example:

```js
cheerpjInit({
	appletParamFilter: function (name, value) {
		if (name === "httpServer") return value.replace("http", "https");
		return value;
	},
});
```

### `natives`

```ts
natives?: { [method: string]: Function };
```

This option is used to implement native methods from an AOT-compiled language in JavaScript.

Example usage:

```js
cheerpjInit({
	natives: {
		async Java_MyClass_myMethod(lib, str) {
			window.alert(str);
		},
	},
});
```

Read more about implementing native methods [here](/docs/guides/implementing-native-methods).

### `overrideDocumentBase`

```ts
overrideDocumentBase?: string;
```

Replaces the current `<base>` URL of the document with the URL passed as a `string`.

Example usage:

```js
cheerpjInit({ overrideDocumentBase: "YourNewURLHere" });
```

### `javaProperties`

```ts
javaProperties?: string[];
```

An array of Java properties in the form `"key=value"`. They will be defined on the System object (System properties). This option should be used if command line arguments in the form `-Dkey=value` are required when using native Java.

Example usage:

```js
cheerpjInit({ javaProperties: ["prop1=value1", "prop2=value2"] });
```

### `tailscaleControlUrl`

```ts
tailscaleControlUrl?: string;
```

This option expects a string URL of the Tailscale control plane. The control plane verifies the user's identity and validates various keys among the connected peers in the network. Only pass this option if you are [self-hosting Tailscale](https://github.com/leaningtech/headscale), if omitted, it will point to the Tailscale control plane.

Example usage:

```js
cheerpjInit({ tailscaleControlUrl: "https://my.url.com/" });
```

### `tailscaleDnsUrl`

```ts
 tailscaleDnsUrl?: string;
```

Expects a string with the IPv4 or IPv6 address to use for DNS queries. If omitted, the default IP address is "8.8.8.8".

Example usage:

```js
cheerpjInit({ tailscaleDnsUrl: "1.1.1.1" });
```

### `tailscaleAuthKey`

```ts
tailscaleAuthKey?: string;
```

This option expects a string that contains a Tailscale auth key. Using auth keys allows one to register new users/devices that are pre-authenticated. You can create an auth key [here](https://login.tailscale.com/admin/settings/keys). This option is mutually exclusive with [`tailscaleLoginUrlCb`](#tailscaleloginurlcb)

> [!info] Info
> A combination of a user and a device connected to a Tailscale network is called a _"node"_ in Tailscale terminology.

For more information about auth keys visit the [Tailscale auth keys documentation](https://tailscale.com/kb/1085/auth-keys/).

Example of usage:

```js
cheerpjInit({ tailscaleAuthKey: "AuthKeyStringGoesHere" });
```

### `tailscaleLoginUrlCb`

```ts
tailscaleLoginUrlCb?: (url: string) => void;
```

This option is used to login into a Tailscale network and it is mutually exclusive with [`tailscaleAuthKey`](#tailscaleauthkey). It expects the base URL of a control server that will continue and finish the login process. This callback is executed when it is time to prompt the user to login to Tailscale via the UI.

For more information visit the [Tailscale documentation](https://tailscale.com/kb/1080/cli/#login).

```js
cheerpjInit({
	tailscaleLoginUrlCb(url) {
		// your function code here to continue with login
	},
});
```

### `tailscaleIpCb`

```ts
tailscaleIpCb?: (ip: string) => void;
```

This callback is used to retrieve the IP address of the client once the connection with the Tailscale network is established.

Example of usage:

```js
cheerpjInit({
	tailscaleIpCb: function (ip) {
		console.log("IP address " + ip);
	},
});
```

### `licenseKey`

```ts
licenseKey?: string;
```

This option expects a license key. The non-commercial license message will be removed from the CheerpJ display if a valid license key is used. Please visit our [licensing guide](/docs/licensing) for more information.

Example of usage:

```js
cheerpjInit({ licenseKey: "YourLicenseKey" });
```

### `execCallback`

```ts
execCallback?: (cmdPath: string, argsArray: string [])  => void;
```

> [!note] Important
> The `execCallback` option is supported in CheerpJ 3.1 and later versions.

This option allows you to intercept and handle external system commands or program executions that initiated from a Java application. Such commands are typically executed using methods like `Runtime.getRuntime().exec(command)` or `new ProcessBuilder(command)` in Java.

The callback function accepts two parameters:

- `cmdPath`: The command that would have been executed in Java.
- `argsArray`: An array of additional arguments passed to that command.

Example of usage:

```js
cheerpjInit({
	execCallback: function (cmdPath, argsArray) {
		debugger;
	},
});
```

Learn more about the `execCallback` option in our [intercept external commands guide](/docs/guides/Intercept-external-commands).

### `enableDebug`

```ts
enableDebug?: boolean;
```

> [!note] Important
> The `enableDebug` option is supported in CheerpJ 3.1 and later versions.

This option enables advanced debug logging, which is helpful for troubleshooting issues with CheerpJ.

Example of usage:

```js
cheerpjInit({ enableDebug: true });
```

Learn more about how to debug CheerpJ in our [Debugging CheerpJ guide](/docs/guides/cheerpj-debug).

[cjGetRuntimeResources]: /docs/reference/cjGetRuntimeResources
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[`java`]: /docs/reference/cheerpjInit#java-mode
[`system`]: /docs/reference/cheerpjInit#system-mode
[`permission`]: /docs/reference/cheerpjInit#permission-mode



---
File: /docs/12-reference/01-cheerpjRunMain.md
---

---
title: cheerpjRunMain
description: Starts an application by executing the static main method of a Java class
---

```ts
async function cheerpjRunMain(
	className: string,
	classPath: string,
	...args: string[]
): Promise<number>;
```

## Parameters

- **className (`string`)** - The fully-qualified name of the class with a static main method to execute. For example, `com.application.MyClassName`.
- **classPath (`string`)** - The location of the class's jar in the [virtual filesystem], with its dependencies separated by `:`.
- **..args (`string[]`, _optional_)** - Arguments to pass to the main method.

## Returns

`cheerpjRunMain` returns a [Promise] which resolves with the [exit code] of the program. `0` indicates success, any other value indicates failure.

## Example

```js
const exitCode = await cheerpjRunMain(
	"fully.qualified.ClassName",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
	arg1,
	arg2
);
console.log(`Program exited with code ${exitCode}`);
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[exit code]: https://en.wikipedia.org/wiki/Exit_status#Java
[virtual filesystem]: /docs/guides/File-System-support



---
File: /docs/12-reference/02-cheerpjRunJar.md
---

---
title: cheerpjRunJar
description: Execute the main class of a JAR
---

```ts
async function cheerpjRunJar(
	jarName: string,
	...args: string[]
): Promise<number>;
```

## Parameters

- **jarName (`string`)** - The location of the jar in the [virtual filesystem].
- **..args (`string[]`, _optional_)** - Arguments to pass to the main method.

## Returns

`cheerpjRunJar` returns a [Promise] which resolves with the [exit code] of the program. `0` indicates success, any other value indicates failure.

## Examples

### Basic usage

```js
const exitCode = await cheerpjRunJar("/app/application.jar");
console.log(`Program exited with code ${exitCode}`);
```

### Command line arguments

```js
await cheerpjRunJar("/app/application.jar", --version");
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[exit code]: https://en.wikipedia.org/wiki/Exit_status#Java
[virtual filesystem]: /docs/guides/File-System-support



---
File: /docs/12-reference/03-cheerpjRunLibrary.md
---

---
title: cheerpjRunLibrary
description: Load a Java Library
---

Loads a Java library for use in JavaScript. See [library mode](/docs/guides/library-mode) for more information.

```ts
async function cheerpjRunLibrary(classPath: string): Promise<CJ3Library>;
```

## Parameters

- **classPath (`string`)** - The path to the library's jar file in the [virtual filesystem]. Pass an empty string to load the standard library only.

## Returns

`cheerpjRunLibrary` returns a [Promise] which resolves to a [CJ3Library] object.

## Examples

### Using the standard library

```js
await cheerpjInit();
const lib = await cheerpjRunLibrary("");

const System = await lib.java.lang.System;
await System.out.println("Hello from Java");
```

### Using a custom library

Let's say we had a library called `example.jar` compiled from the following class:

```java
package com.example;

public class Example {
  public String[] greetings = {"Hello", "Bye"};
  public void hello() {
    System.out.println("Example says hello!");
  }
}
```

With `example.jar` being available on the web server at `/example.jar`, we could use it like so:

```js
await cheerpjInit();
const lib = await cheerpjRunLibrary("/app/example.jar");

const Example = await lib.com.example.Example;
const example = await new Example();
await example.hello(); // Example says hello!
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[virtual filesystem]: /docs/guides/File-System-support
[CJ3Library]: /docs/reference/CJ3Library



---
File: /docs/12-reference/10-cheerpjCreateDisplay.md
---

---
title: cheerpjCreateDisplay
description: Display GUI elements
---

`cheerpjCreateDisplay` adds an element to the DOM which will be used for graphical rendering.

```ts
function cheerpjCreateDisplay(
	width: number,
	height: number,
	parent?: HTMLElement
): HTMLElement;
```

## Parameters

- **width (`number`)** - The width of the display area in CSS pixels, or `-1` to match parent width.
- **height (`number`)** - The height of the display area in CSS pixels, or `-1` to match parent height.
- **parent (`HTMLElement`, _optional_)** - Element to add display as a child of.

## Returns

`cheerpjCreateDisplay` returns an [`HTMLElement`] representing the created display.

## Examples

### Create a display

```js
cheerpjCreateDisplay(800, 600);
```

This creates a 800x600 display for rendering, and appends it to the document body.

### Take up the whole page

```js
cheerpjCreateDisplay(-1, -1, document.body);
```

This creates a display that takes up the whole page, and responds to changes in the page size.

### Usage with React

```jsx
import { useRef, useEffect } from "react";

function Display({ width, height }) {
	const parent = useRef();
	useEffect(() => {
		cheerpjCreateDisplay(width, height, parent);
	});
	return <div ref={parent} />;
}
```

[`HTMLElement`]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement



---
File: /docs/12-reference/20-cjFileBlob.md
---

---
title: cjFileBlob
description: Read a file from the virtual filesystem
---

Used to read files from the CheerpJ virtual filesystem.

```ts
async function cjFileBlob(path: string): Promise<Blob>;
```

## Parameters

- **path (`string`)** - The path to the file to be read. Must begin with `/files/`, `/app/` or `/str/`.

## Returns

`cjFileBlob` returns a [Promise] which resolves to a [Blob] of the file contents.

## Examples

### Read a text file

```js
const blob = await cjFileBlob("/files/file1.txt");
const text = await blob.text();
console.log(text);
```

### Read a binary file

```js
const blob = await cjFileBlob("/files/file2.bin");
const data = new Uint8Array(await blob.arrayBuffer());
console.log(data);
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Blob]: https://developer.mozilla.org/en-US/docs/Web/API/Blob



---
File: /docs/12-reference/21-cheerpOSAddStringFile.md
---

---
title: cheerpOSAddStringFile
description: Write a file into the virtual filesystem
---

Used to write files into the `/str/` filesystem. If the file already exists, it will be overwritten.

```ts
function cheerpOSAddStringFile(path: string, data: string | Uint8Array): void;
```

## Parameters

- **path (`string`)** - The path to the file to overwrite. Must begin with `/str/`.
- **data (`string` or `Uint8Array`)** - File contents, as text or binary data.

## Returns

`cheerpOSAddStringFile` does not return a value.

## Example

```js
cheerpOSAddStringFile("/str/fileName.txt", "Some text in a JS String");
```



---
File: /docs/12-reference/30-cjGetRuntimeResources.md
---

---
title: cjGetRuntimeResources
description: List resources that were loaded
---

Returns a JavaScript string representing the data that should be passed to [preloadResources]. Once parsed, it is an object containing the filenames that have been loaded from the runtime up to the time this function is called.

See [startup time optimization](/docs/guides/Startup-time-optimization) for more information.

```ts
function cjGetRuntimeResources(): string;
```

> [!note] Note
> This function is intended for use in the browser console. It is not intended to be called from within your application.

## Parameters

`cjGetRuntimeResources` does not take any parameters.

## Returns

`cjGetRuntimeResources` returns a string representing the files that have been loaded from the runtime.

Parse this string with [JSON.parse] and pass it as [preloadResources] in future page loads.

## Example

In the browser console, type:

```shell
cjGetRuntimeResources();
```

The output would look like this:

```js
'{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}';
```

[preloadResources]: /docs/reference/cheerpjInit#preloadresources
[JSON.parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse



---
File: /docs/12-reference/31-cjGetProguardConfiguration.md
---

---
title: cjGetProguardConfiguration
description: Download a ProGuard configuration file
---

Triggers download of a configuration file which can be used to tree-shake JARs using [ProGuard].

```ts
function cjGetProguardConfiguration(): void;
```

> [!note] Note
> This function is intended for use in the browser console. It is not intended to be called from within your application.

## Parameters

`cjGetProguardConfiguration` does not take any parameters.

## Returns

`cjGetProguardConfiguration` does not return a value. It triggers a download of a `cheerpj.pro` file.

## Example

On the browser console type:

```shell
cjGetProguardConfiguration();
```

This will trigger the download of `cheerpj.pro` file.

[ProGuard]: https://github.com/Guardsquare/proguard



---
File: /docs/12-reference/40-CJ3Library.md
---

---
title: CJ3Library
description: A library mode session
---

This class represents a [library mode](/docs/guides/library-mode) session. It can be used to access the classes and methods of the loaded library.

You can get a CJ3Library instance by:

- Calling [`cheerpjRunLibrary`] to load a library from a JAR.
- Implementing a [native method](/docs/guides/Implementing-Java-native-methods-in-JavaScript) - the first parameter is a CJ3Library instance.

## Usage

- To load a class, access it and await it.
- To call a static method, call it as a method on a loaded class and await it.
- To construct a class into an instance, use `await new`.
- To call an instance method, call it as a method on an instance of a loaded class and await it.
- To read/write a public field, do so normally.
- `instanceof` is supported.

## Conversion rules

Type conversions adhere to the [LiveConnect specification](https://web.archive.org/web/20110204185537/http://jdk6.java.net/plugin2/liveconnect/#JS_JAVA_CONVERSIONS). There are some extensions:

| JavaScript type | Java type                      | Note             |
| --------------- | ------------------------------ | ---------------- |
| `Uint8Array`    | `boolean[]`                    | By reference     |
| `Int8Array`     | `byte[]`                       | By reference     |
| `Uint16Array`   | `char[]`                       | By reference     |
| `Int16Array`    | `short[]`                      | By reference     |
| `Int32Array`    | `int[]`                        | By reference     |
| `BigInt64Array` | `long[]`                       | By reference     |
| `Float32Array`  | `float[]`                      | By reference     |
| `Float64Array`  | `double[]`                     | By reference     |
| `any`           | `netscape.javascript.JSObject` | Opaque reference |

For other types, refer to the LiveConnect specification.

## `CJ3Library#getJNIDataView`

```ts
class CJ3Library {
	getJNIDataView(): DataView;
}
```

Returns a `DataView` of the library's raw JNI memory.

[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary



---
File: /docs/13-tutorials/00-swingset3.mdx
---

---
title: SwingSet3
description: Porting a Swing application to the web
---

import LinkButton from "@leaningtech/astro-theme/components/LinkButton.astro";

In this tutorial, we'll run the SwingSet3 application in the browser.

<LinkButton label="View demo" href="#the-result" />

## Prerequisites

- [Download the template project](/docs/cheerpj3/tutorials/swingset3-template.zip) and unzip it
- [Node.js](https://nodejs.org/en/) (>= 18)

The starting point of this example is an empty HTML page, the SwingSet3 jar, and its dependencies:

```
.
├── index.html
├── SwingSet3.jar
└── lib
    ├── AnimatedTransitions.jar
    ├── AppFramework.jar
    ├── Filters.jar
    ├── MultipleGradientPaint.jar
    ├── TimingFramework.jar
    ├── javaws.jar
    ├── swing-layout-1.0.jar
    ├── swing-worker.jar
    └── swingx.jar
```

## 1. Run a web server

To view the example, we need to host the files on a web server. [Vite](https://vitejs.dev/) is a convenient tool for this, as it automatically reloads the page when the files change.

```sh
npx vite
```

Visit the URL shown in the terminal and you should see a blank page. Leave Vite running in the background for the remainder of this tutorial.

## 2. Add CheerpJ to the document

Let's add CheerpJ to the page by adding this script tag to the `<head>`:

```html title="index.html"
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

## 3. Initialise CheerpJ and run the jar

Add the following script tag to the `<body>`:

```html title="index.html"
<script type="module">
	await cheerpjInit();
	cheerpjCreateDisplay(800, 600);
	await cheerpjRunJar("/app/SwingSet3.jar");
</script>
```

This will initialise CheerpJ, create a 800x600 display, and run the SwingSet3 jar. We use `type="module"` so that we can use [top-level await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#top_level_await).

> [!question] What is `/app/SwingSet3.jar`?
> This is a [virtual filesystem](/docs/guides/File-System-support) which represents the root of the web server.

Save the file and you should see SwingSet3 load and run in the browser. 🥳

## 4. Make the application take up the whole page

The application takes up a small portion of the page, but for many applications we want to take up the whole page.

To do this, we'll add a new element to the `<body>`:

```html title="index.html"
<div id="container"></div>
```

> [!note] Note
> Make sure you add the container element **before** the script which calls `cheerpjCreateDisplay`.

And then add some CSS:

```html title="index.html"
<style>
	html,
	body {
		margin: 0;
	}

	#container {
		width: 100vw;
		height: 100svh;
	}
</style>
```

Finally, update the script to use the container element:

```html title="index.html" {3}
<script type="module">
	await cheerpjInit();
	cheerpjCreateDisplay(-1, -1, document.getElementById("container"));
	await cheerpjRunJar("/app/SwingSet3.jar");
</script>
```

Passing `-1` as the width and height tells CheerpJ to use the full size of the container element, and listen for resize events.

View the page again, and you should see the application take up the entire window. Also notice that resizing the window resizes the application.

---

## The result

<iframe
	src="https://cheerpj-example-swingset3.leaningtech.com/"
	class="w-full aspect-square"
></iframe>

## Source code

[View full source code on GitHub](https://github.com/leaningtech/cheerpj-meta/tree/main/examples/SwingSet3)



---
File: /docs/13-tutorials/01-applet.mdx
---

---
title: FoilSim applet
description: Running an applet with CheerpJ
---

import LinkButton from "@leaningtech/astro-theme/components/LinkButton.astro";

In this tutorial you will learn how to run a Java applet in a modern browser by integrating CheerpJ within your page.

<LinkButton label="View demo" href="#the-result" />

For this tutorial we will use the FoilSim applet from NASA's [Beginner's Guide to Aeronautics](https://www.grc.nasa.gov/WWW/K-12/airplane/). This applet shows an interactive simulation of the aerodynamic forces of an aircraft's wings. [See more](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/foilsimu/).

## Prerequisites

- [Download the template project](/docs/cheerpj3/tutorials/FoilSim-Applet.zip) and unzip it
- [Node.js](https://nodejs.org/en/) (>= 18)

The template project has the following structure:

```
.
├── index.html
└──  FoilSim.jar
```

## 1. Run a web server

To view the example, we need to host the files on a web server. [Vite](https://vitejs.dev/) is a convenient tool for this, as it automatically reloads the page when the files change.

```sh
npx vite
```

Alternatively you can also use the http-server utility.

```sh
npm install http-server
http-server -p 8080
```

Open a browser tab pointing to your localhost such as `http://127.0.0.1:8080/`.

## 2. Creating a classic HTML document

The provided template contains the final `index.html` file. You can delete its content and start it from scratch to follow the next steps.

A basic HTML file would look like this:

```html title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>

	<body></body>
</html>
```

## 3. Add your applet content

The next step is to add the applet tag with its parameters, just like they used to be integrated on web pages. We will also add some titles, descriptions and styles.

```html {25-32} title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>FoilSim applet (CheerpJ)</title>
	</head>
	<style>
		div {
			max-width: 1000px;
			margin: auto;
			text-align: center;
		}
		h1 {
			margin-bottom: 50px;
		}
		h5 {
			margin-top: 20px;
		}
	</style>

	<body>
		<div>
			<h1>Applet example with CheerpJ</h1>
			<div>
				<cheerpj-applet
					archive="FoilSim.jar"
					code="Foil.class"
					height="450"
					width="950"
				>
					Your browser cannot handle the applet tag!
				</cheerpj-applet>
			</div>
			<h5>
				The applet shown in this example belongs to the NASA's
				<a href="https://www.grc.nasa.gov/WWW/K-12/airplane/"
					>Beginner's Guide to Aeronautics</a
				>
				and it is available at their
				<a href="https://github.com/nasa/BGA/tree/main">GitHub repository</a>.
			</h5>
			<h5>
				Applet is running with
				<a href="https://labs.leaningtech.com/cheerpj3">CheerpJ</a> by
				<a href="https://leaningtech.com/">©Leaning Technologies</a>
			</h5>
		</div>
	</body>
</html>
```

Go to your browser and refresh the page. You will see the titles and text you just added. As expected, the applet will not be on display, instead there is the message _**Your browser cannot handle the applet tag!**_

## 4. Integrating CheerpJ

Integrating CheerpJ in your page is as simple as adding a `<script>` with the CheerpJ loader url. This will be placed within the document's `<head>` tag. Next, we need to call `cheerpjInit()` in another script block.

Your document will look like this:

```html {6, 49-51} title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>FoilSim applet (CheerpJ)</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<style>
		div {
			max-width: 1000px;
			margin: auto;
			text-align: center;
		}
		h1 {
			margin-bottom: 50px;
		}
		h5 {
			margin-top: 20px;
		}
	</style>

	<body>
		<div>
			<h1>Applet example with CheerpJ</h1>
			<div>
				<cheerpj-applet
					archive="FoilSim.jar"
					code="Foil.class"
					height="450"
					width="950"
				>
					Your browser cannot handle the applet tag!
				</cheerpj-applet>
			</div>
			<h5>
				The applet shown in this example belongs to the NASA's
				<a href="https://www.grc.nasa.gov/WWW/K-12/airplane/"
					>Beginner's Guide to Aeronautics</a
				>
				and it is available at their
				<a href="https://github.com/nasa/BGA/tree/main">GitHub repository</a>.
			</h5>
			<h5>
				Applet is running with
				<a href="https://labs.leaningtech.com/cheerpj3">CheerpJ</a> by
				<a href="https://leaningtech.com/">©Leaning Technologies</a>
			</h5>
		</div>
		<script type="module">
			await cheerpjInit();
		</script>
	</body>
</html>
```

Refresh your page and now you will be able to see your applet running!

> You can also replace the `applet` tag with `<cheerpj-applet>` to avoid potential conflicts with native Java

> [!info] Java Applets and Java 8
> The method ´cheerpJInit´ runs Java 8 by default if the Java version is not specified. Please notice that if you change the version to Java 11, applets won't work.

## The result

Your final page will look like this:

<iframe
	src="https://leaningtech.github.io/cheerpj-meta/examples/FoilSim-Applet/"
	style="-webkit-transform: scale(0.5); -webkit-transform-origin:0 0; height: 100vh; width: 100vw;"
></iframe>

## Source code

[Find the full source code in GitHub](https://github.com/leaningtech/cheerpj-meta/tree/main/examples/FoilSim-Applet)

## Credits

The applet used for this tutorial belongs to the NASA's [Beginner's Guide to Aeronautics](https://www.grc.nasa.gov/WWW/K-12/airplane/) and it is available at their [GitHub repository](https://github.com/nasa/BGA/tree/main).

## Further reading

To continue learning about CheerpJ, visit the [reference](/docs/reference).



---
File: /docs/13-tutorials/02-jnlp.mdx
---

---
title: JNLP apps
description: Run a working example of a JNLP application or applet
---

This tutorial will take you step by step on how to run a working example of a JNLP (also known as JWS app) in the browser using CheerpJ.

If you are interested in a ready-to-use tool for running Java Web Start applications, we recommend taking a look at our [CheerpJ JNLP Runner](/cheerpj-jnlp-runner) browser extension.

This tutorial is divided in two parts:

- [Application example (SwingSet3)](#jnlp-application-swingset3)
- [Applet example (Pitch)](#jnlp-applet-pitch)

## Prerequisites

For either application or applet, you will need:

- The application `.jnlp` file (given below)
- Node.js (>= 18)
- A simple http-server to host your page locally
- A text editor to create and edit an HTML file
- A modern browser like Chrome, Firefox or Safari.

If you already have a JNLP app and you want to go straight to run it in the browser with CheerpJ, we recommend taking a look at our [JNLP quickstart] tutorial.

[JNLP quickstart]: /docs/getting-started/JNLP

## JNLP application: SwingSet3

### 1. The `.jnlp` file

We are going to start by looking at the JNLP file. Below, there is an example of an JNLP file for the known demo application SwingSet3. There are three essential elements highlighted:

- **The code base:** Found as `<jnlp codebase="">` Indicates where the application files will be downloaded from.
- **The JAR files:** Given by the `<jar>` tag in the `<resources>` section.
- **The class name:** Given by `main-class` under the `<application-desc>` tag. This tag also indicates that the app is a standalone application.

```xml {3, 15-19, 21 } title="SwingSet3.jnlp"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE jnlp PUBLIC "-//Sun Microsystems, Inc.//DTD JNLP 1.5//EN">
<jnlp codebase="https://raw.githubusercontent.com/leaningtech/cheerpj-meta/main/examples/SwingSet3/" href="SwingSet3.jnlp" spec="6.0+">
  <information>
    <title>SwingSet3</title>
    <vendor>Oracle America, Inc.</vendor>
    <homepage href="https://swingset3.dev.java.net"/>
    <description>Demo to showcase features of the Swing UI toolkit in Java 6</description>
    <icon href="swingset3/resources/images/splash.png" kind="splash"/>
    <offline-allowed/>
    <shortcut online="true"/>
  </information>
  <resources>
    <j2se version="1.6+"/>
    <jar href="SwingSet3.jar" main="false"/>
    <jar href="lib/AppFramework.jar"/>
    <jar href="lib/TimingFramework.jar"/>
    <jar href="lib/swing-worker.jar"/>
    <jar href="lib/swingx.jar"/>
  </resources>
  <application-desc main-class="com.sun.swingset3.SwingSet3"/>
</jnlp>
```

### 2. Download the application files

Download the application JAR files by manually building their full URL and pasting it in the browser navigation bar. This is done by concatenating the `codebase` URL and the `jar` URL.
For example:

```
https://raw.githubusercontent.com/leaningtech/cheerpj-meta/main/examples/SwingSet3/SwingSet3.jar

```

Do this for all the JARs in the JNLP.

### 3. Create a project directory

Create a directory where all the files will live. You can choose any name, such as `cheerpj-example-swingset3`:

```bash
mkdir cheerpj-example-swingset3
```

Now create the application structure as shown in the JNLP file. For this example there is a subdirectory called `lib`.

```sh
cd cheerpj-example-swingset3
mkdir lib
```

Now allocate the application JARs inside this directory following the JNLP directory structure.
For this app it will be something like this:

```
└──cheerpj-example-swingset3
    ├── SwingSet3.jar
    └── lib
        ├── AnimatedTransitions.jar
        ├── AppFramework.jar
        ├── Filters.jar
        ├── MultipleGradientPaint.jar
        ├── TimingFramework.jar
        ├── javaws.jar
        ├── swing-layout-1.0.jar
        ├── swing-worker.jar
        └── swingx.jar
```

### 4. Create an HTML file

Inside our project directory `cheerpj-example-swingset3` we will create a basic HTML file called `index.html` like the following:

```html {7, 22-26} title="index.html"
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1" />
		<title>SwingSet3 (CheerpJ)</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
		<style>
			html,
			body {
				margin: 0;
			}

			#container {
				width: 100vw;
				height: 100svh;
			}
		</style>
	</head>
	<body>
		<div id="container"></div>
		<script type="module">
			await cheerpjInit();
			cheerpjCreateDisplay(-1, -1, document.getElementById("container"));
			await cheerpjRunJar("/app/SwingSet3.jar");
		</script>
	</body>
</html>
```

#### What is going on?

- The CheerpJ runtime environment is being integrated at:

```html
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

- [`cheerpjInit()`] initializes the CheerpJ runtime environment
- [`cheerpjCreateDisplay()`] creates a graphical environment to contain all Java windows.
- [`cheerpjRunJar()`] executes the application.
- `/app/` is a virtual filesystem mount point that references the root of the web server this page is loaded from.

> For this example we are using [`cheerpjRunJar()`] as the class name is included in the manifest. When this is not the case you can use [`cheerpjRunMain()`] with the main-class name indicated in the JNLP.

### 5. Host your page locally

To view the example, we need to host the files on a web server. [Vite](https://vitejs.dev/) is a convenient tool for this, as it automatically reloads the page when the files change.

```sh
npx vite
```

Alternatively you can also use the http-server utility:

```sh
npm install http-server
http-server -p 8080
```

Visit the address indicated by your http-server in the browser. For example, `http://localhost:8080`.

### The result

You should be able to see the application running in the browser:

<iframe
	src="https://cheerpj-example-swingset3.leaningtech.com/"
	class="w-full aspect-square"
></iframe>

### Source code and credits

- [View full source code fort this example on GitHub](https://github.com/leaningtech/cheerpj-meta/tree/main/examples/SwingSet3)
- SwingSet3 is a demo application by Oracle America, Inc.

## JNLP applet: Pitch

We will use the Pitch applet from NASA's [Beginner's Guide to Aeronautics](https://www.grc.nasa.gov/WWW/K-12/airplane/). This applet shows an interactive animation of an aircraft's pitch motion. [See more](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aircraft-rotations/).

### 1. The `.jnlp` file

We are going to start by looking at the JNLP file. Below, there is an JNLP example for Pitch applet. There are three essential elements highlighted:

- **The code base:** Found as `<jnlp codebase="">` Indicates where the application files will be downloaded from.
- **The JAR files:** Given by the `<jar>` tag in the `<resources>` section.
- **The class name:** Given by `main-class` under the `<applet-desc>` tag. This tag also indicates that the app is an applet.

```xml title= "PitchApplet.jnlp" {5, 21, 23}
<?xml version="1.0" encoding="utf-8"?>
<!-- JNLP File for Pitch applet -->
<jnlp
  spec="1.0+"
  codebase="https://raw.githubusercontent.com/leaningtech/cheerpj-meta/main/examples/Pitch-Applet/"

  href="PitchApplet.jnlp">
  <information>
    <title>Pitch</title>
    <vendor>NASA Glenn Research Center</vendor>
    <homepage href="https://www.grc.nasa.gov/WWW/K-12/airplane/"/>
    <description>Pitch motion simulator</description>
    <description kind="short">Beginner's Guide to Aeronautics - Pitch motion simulator written in Java</description>
    <offline-allowed/>
  </information>
  <security>
      <all-permissions/>
  </security>
  <resources>
    <j2se version="1.4+" initial-heap-size="30m" max-heap-size="300m" />
    <jar href="Pitch.jar"/>
  </resources>
  <applet-desc main-class="Pitchview" width="300" height="500"/>
</jnlp>
```

### 2. Download the applet file

Download the applet JAR files by manually building the full URL and pasting it in the browser navigation bar. This is done by concatenating the `codebase` URL and the `jar` URL.
For example:

```
https://raw.githubusercontent.com/leaningtech/cheerpj-meta/main/examples/Pitch-Applet/Pitch.jar

```

### 3. Create a project directory

Create a directory where all the files will live. You can choose any name, such as `cheerpj-example-applet`:

```bash
mkdir cheerpj-example-applet
```

Now allocate the application JAR inside this directory following the JNLP directory structure.
For this app it will be something like this:

```
└──cheerpj-example-applet
    ├── Pitch.jar
```

### 4. Create an HTML file

Inside the project directory, create an HTML file called `index.html` like the following:

```html {6, 26-33, 49-51} title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Pitch applet (CheerpJ)</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<style>
		div {
			max-width: 500px;
			margin: auto;
			text-align: center;
		}
		h1 {
			margin-bottom: 50px;
		}
		h5 {
			margin-top: 20px;
		}
	</style>

	<body>
		<div>
			<h1>Applet example with CheerpJ</h1>
			<div>
				<cheerpj-applet
					archive="Pitch.jar"
					code="Pitchview"
					height="300"
					width="500"
				>
					Your browser cannot handle the applet tag!
				</cheerpj-applet>
			</div>
			<h5>
				The applet shown in this example belongs to the NASA's
				<a href="https://www.grc.nasa.gov/WWW/K-12/airplane/"
					>Beginner's Guide to Aeronautics</a
				>
				and it is available at their
				<a href="https://github.com/nasa/BGA/tree/main">GitHub repository</a>.
			</h5>
			<h5>
				Applet is running with
				<a href="https://labs.leaningtech.com/cheerpj3">CheerpJ</a> by
				<a href="https://leaningtech.com/">©Leaning Technologies</a>
			</h5>
		</div>
		<script type="module">
			await cheerpjInit();
		</script>
	</body>
</html>
```

> [!info] Java Applets and Java 8
> The method ´cheerpJInit´ runs Java 8 by default if the Java version is not specified. Please notice that if you change the version to Java 11, applets won't work.

### What is happening?

- The CheerpJ runtime environment is being integrated at:

```html
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

- The `<cheerpj-applet>` tag contains the applet `.jar` location, size and class name. This tag prevents conflicts with native java, the classic `<applet>` tag can also be used.
- [`cheerpjInit()`] initializes the CheerpJ runtime environment.

### 5. Host your page locally

To view the example, we need to host the files on a web server. [Vite](https://vitejs.dev/) is a convenient tool for this, as it automatically reloads the page when the files change.

```sh
npx vite
```

Alternatively you can also use the http-server utility:

```sh
npm install http-server
http-server -p 8080
```

Visit the address indicated by your http-server in the browser. For example, `http://localhost:8080`.

### The result

You should be able to see the applet running in the browser:

<iframe
	src="https://leaningtech.github.io/cheerpj-meta/examples/Pitch-Applet/"
	class="w-full aspect-square"
></iframe>

### Source code and credits

- [Find the full source code for this example in GitHub](https://github.com/leaningtech/cheerpj-meta/tree/main/examples/Pitch-Applet)

- The applet used for this tutorial belongs to the NASA's [Beginner's Guide to Aeronautics](https://www.grc.nasa.gov/WWW/K-12/airplane/) and it is available at their [GitHub repository](https://github.com/nasa/BGA/tree/main).

## Further reading

To continue learning about CheerpJ, visit the [reference](/docs/reference). If you are interested in a ready-to-use tool for running Java Web Start applications, we recommend taking a look at our [CheerpJ JNLP Runner](/cheerpj-jnlp-runner) browser extension.

[`cheerpjRunJar()`]: /docs/reference/cheerpjRunJar
[`cheerpjRunMain()`]: /docs/reference/cheerpjRunMain
[`cheerpjInit()`]: /docs/reference/cheerpjInit
[`cheerpjCreateDisplay()`]: /docs/reference/cheerpjCreateDisplay



---
File: /docs/13-tutorials/04-java-browser.mdx
---

---
title: Swing Browser (Networking)
description: Run a Java application with Internet connection
---

This tutorial will show you how to use CheerpJ and Tailscale to run a web browser application written in Java. The same approach can be used to give any application running in CheerpJ wider internet access.

If you're not familiar with how CheerpJ and Tailscale work together, [read the networking guide][Networking guide].

## Pre-requisites

- [Download `SwingHTMLBrowser.jar`](/docs/cheerpj3/tutorials/SwingHTMLBrowser.jar)
- A simple HTTP server to host your page locally.
- A text editor to create and edit an HTML file.
- A modern browser like Chrome, Firefox or Safari.
- A Tailscale account (explanation later in this tutorial)

## 1. The Java application

Let's start by reviewing the Java application we will be testing. This is a simple Swing HTML browser written in Java. You can run this JAR locally if you have Java installed on your machine, but feel free to skip this step.

You can type the full URL of a website in the input field and press enter to load the page. Note that the Swing web browser is fairly old, so sites may not display the same as in modern browsers.

<div class="w-1/2">
	![Tiny Browser Loaded](/docs/cheerpj3/assets/tinybrowserloaded.png)
</div>

In this scenario, the page is loading because the machine you are running this application on has an active connection to the internet and Java is installed.

## 2. Run the application in the browser with CheerpJ

Now we want to run this Java application in the browser with CheerpJ with no Java installation on your machine! To do so, we will follow similar steps as in the [Run a Java app] tutorial.

### 2.1 The project files

Let's create a project directory, place the application JAR in this folder and create an HTML file. Your project directory should look something like this:

```
└──browserTutorial
    ├── SwingHTMLBrowser.jar
    └── browser.html
```

Copy and paste this code in your `browser.html` file:

```html title="browser.html" {6, 9-15}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Browser</title>
		<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
	</head>
	<body>
		<script>
			(async function () {
				await cheerpjInit();
				cheerpjCreateDisplay(800, 600);
				await cheerpjRunJar("/app/SwingHTMLBrowser.jar");
			})();
		</script>
	</body>
</html>
```

#### What's going on?

- The script tag in the `<head>` loads CheerpJ.
- [`cheerpjInit`] initialises the CheerpJ runtime environment.
- [`cheerpjCreateDisplay`] creates a graphical environment to contain all Java windows.
- [`cheerpjRunJar`] executes the application.
- `/app/` is a [virtual filesystem] mount point that references the root of the web server this page is loaded from.

### 2.2 Serving the application

You can now serve this page from an HTTP server, such as [http-server](https://npm.im/http-server).

```shell
npx http-server -p 8080
```

You will be able to see the page in a modern browser running with CheerpJ. Let's type `https://github.com` in the Java browser client and press enter. Nothing will load and you will find this error in the console log:

![Error in the Console Log](/docs/cheerpj3/assets/errorconsolelog.png)

Now try loading a page that is hosted on the local server. Let's add the following file to the project directory:

```html title="hello.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Hello world</title>
	</head>
	<body>
		<h1>Hello from the same origin!</h1>
	</body>
</html>
```

In the Java browser application type the following address: `http://127.0.0.1:8080/hello.html` (or any address that corresponds to your local host).

![Hello From Same Origin](/docs/cheerpj3/assets/hello_sameorigin.png)

**CheerpJ can only do same-origin requests when is not connected to a Tailscale Network.** The convenience of this scenario is that, even when the app is running in the browser, it is completely isolated from the wider internet.

...but we want the application to be able to load web pages that aren't on localhost.

## 3. Connect the application to the internet

The easiest way to grant your application access to the internet is via a Tailscale network (_Tailnet_ in Tailscale terminology). A Tailscale network is a VPN made of machines/users (_Nodes_ in Tailscale terminology) connected to this network.
A Tailscale network by default is isolated from the internet, so it is necessary to configure an _exit node_ that routes all the internet traffic in and out of your VPN.

### 3.1 Set up Tailscale

Creating a network with an _exit node_ is very simple:

1.  Create an account and log in to the [Tailscale portal](https://login.tailscale.com/).
2.  [Install Tailscale](https://tailscale.com/kb/installation) in your machine, you will be configuring this machine as an _exit node_ later.
3.  Set up your machine as an _exit node_ following the instructions [here](https://tailscale.com/kb/1103/exit-nodes).

### 3.2 Authenticate your Java application

Connecting to a Tailscale network requires an authorization key.

1. Generate an auth key [here](https://login.tailscale.com/admin/settings/keys) We recommend creating an _ephemeral_ one-time use auth key for this tutorial.
2. Copy your key and pass it to CheerpJ via [`cheerpjInit`] and [`tailscaleAuthKey`] by modifying your `browser.html` as follows:

```js
await cheerpjInit({
	tailscaleAuthKey: "PasteYourKeyHere",
});
```

## 4. Final test

Now reload your page and try loading `https://www.google.com/` or `https://www.github.com/` in the Java browser application. This time you should be able to open the website with no problems.

You can also verify and supervise the connections in the [Tailscale dashboard](https://login.tailscale.com/admin/machines).

Download the project template [here](/docs/cheerpj3/tutorials/browserTutorial.zip) or visit the [GitHub repository](https://github.com/leaningtech/cheerpj-meta/tree/main/examples/Swing-Browser) for this tutorial.

> [!tip] Disclaimer
> Remember that granting your application access to the internet involves several risks. The methodology shown in this tutorial aims to give a general understanding of a very simple networking scenario for learning purposes only. We recommend being careful about how you manage your authentication methods, exit nodes and overall administration of your network. CheerpJ is not responsible for this.

## Further reading

- [Networking guide]

  [Networking guide]: /docs/guides/Networking
  [Run a Java app]: /docs/getting-started/Java-app
  [`cheerpjInit`]: /docs/reference/cheerpjInit
  [`cheerpjCreateDisplay`]: /docs/reference/cheerpjCreateDisplay
  [`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
  [virtual filesystem]: /docs/guides/File-System-support
  [`tailscaleAuthKey`]: /docs/reference/cheerpjInit#tailscaleauthkey



---
File: /docs/13-tutorials/04-serverclient.mdx
---

---
title: Server-Client (Networking)
description: Communication between two Java apps using CheerpJ and Tailscale.
---

This tutorial will take you step by step over a networking scenario of communication between two Java applications running in the browser with CheerpJ. You will learn how to set up CheerpJ and Tailscale to run a Java Client application in the browser that requires communication via `java.net.Socket` and `java.net.ServerSocket` with a Server application.

If you are not familiar with how CheerpJ and Tailscale work together, we invite you to take a look at our [Networking guide]. You can download the full template of this tutorial [here](/docs/cheerpj3/tutorials/ServerClientTutorial.zip).

<img src="/docs/cheerpj3/assets/Tailscale_P2P.png"></img>

## Pre-requisites:

- A text editor to create and edit an HTML file
- A simple HTTP server to host your page locally.
- A modern browser like Chrome, Firefox or Safari.
- A Tailscale account (explanation later in this tutorial)

## 1. The Java applications

The applications we will be running in this tutorial consist of a Java Server app and a Java Client app that communicate with each other via Sockets simulating a chat room. This application example has been based on [TechVidvan] tutorial and you can find the source code extensively explained [here](https://techvidvan.com/tutorials/java-chat-application/).

The idea is to run both applications in the browser with the help of CheerpJ and no Java installations on your machine!

![Client Server](/docs/cheerpj3/assets/client-server.png)

## 2. Tailscale

If you have read our [Networking Guide], you learned that enabling non-HTTP (s) networking when using CheerpJ requires a third-party VPN service. This is very easy to do using Tailscale, which is extensively supported by CheerpJ.

### 2.1 Setting up Tailscale

You will be creating a Tailscale network and connecting both Java apps to this network as _nodes_. A Tailscale _node_ is a term that refers to a combination of a user/machine connected to Tailscale network.

1.  Create a Tailscale account and [log in](https://login.tailscale.com/). By creating an account you will be creating a Network.
2.  Create the appropriate auth keys [here](https://login.tailscale.com/admin/settings/keys) and reserve, you will be using these keys to authenticate the Java applications into your Tailscale network later.

> [!tip] Tailscale auth keys
> You can create the type of auth key that works best for you by mixing and matching the options in the Tailscale keys menu. If you care about the Tailscale quota keep in mind to remove the unused devices manually or by using ephemeral keys.

## 3. Setting up the project

Let's create a project directory with two subdirectories inside, one for the Client and one for the Server and place the corresponding files:

1. Create the project directory tree:

```bash
mkdir -p ServerClientTutorial/{Server, Client}
```

2. Paste the application's JARs inside the corresponding folder.
   - [Download the Server JAR](/docs/cheerpj3/tutorials/Server.jar)
   - [Download the Client JAR](/docs/cheerpj3/tutorials/Client.jar)
1. Create an HTML file inside each subdirectory, let's name it `client.html` and `server.html`
   Your project tree should look like this:

```
└──ServerClientTutorial
		└──Server
		    ├── Server.jar
		    └── server.html
		└──Client
		    ├── Client.jar
		    └── client.html
```

### 3.1 The Server application

1. Open the `server.html` file and paste the following:

```html title="server.html" {6, 12-20}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Server</title>
    <script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
  </head>
  <body>
    <input type="text" id="ip"></input>
    <script>
      (async function () {
        await cheerpjInit({
          tailscaleAuthKey: "PasteYourKeyHere",
          tailscaleIpCb: (ip) => {
            let el = document.querySelector("#ip");
            el.value = ip;
          },
        });
        cheerpjCreateDisplay(800, 600);
        await cheerpjRunJar("/app/Server.jar");
      })();
    </script>
  </body>
</html>
```

**What is happening here?**

- The `<head>` script loads CheerpJ.
- [`cheerpjInit`] initialises the CheerpJ runtime environment. The Tailscale auth key is passed for authentication.
- [`cheerpjCreateDisplay`] creates a graphical environment to contain all Java windows.
- [`cheerpjRunJar`] executes your application!
- [`tailscaleIpCb`] is used to retrieve the IP address once the application is connected to the Tailscale network. We are using it to clearly display the IP address on the document.
- `/app/` is a [virtual filesystem] mount point that references the root of the web server this page is loaded from.

2. Copy the first auth key you generated in the previous step and paste it as a string replacing _"PasteYourKeyHere"_.
3. Now you are ready to serve this page and run the Server application in the browser. Simply run a http-server **inside** the `Server` directory. For example:

```bash
cd ServerClientTutorial/Server
http-server -p 8080
```

4. Now open a browser tab and visit the address you are serving. It should be something similar to `http://127.0.0.1:8080/server.html`.
5. Above the application display you will see the assigned IP address for the Server app. Please reserve it as you will need it later to connect the client with the server. You can also consult the IP address by visiting the [Tailscale Dashboard](https://login.tailscale.com/admin/machines).
6. You will see the CheerpJ loading animation for a brief moment and your application should show.

### 3.2 The Client application

1. Open the `client.html` file and paste the following code:

```html title="client.html" {16}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Client</title>
    <script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
  </head>
  <body>
    <input type="text" id="ip"></input>
    <script>
      async function start(ip) {
        await cheerpjInit({
          tailscaleAuthKey: "PasteYourKeyHere",
        });
        cheerpjCreateDisplay(800, 600);
        await cheerpjRunJar("/app/Client.jar", ip);
      };
      let el = document.querySelector("#ip");
      el.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          start(el.value);
        }
      });
    </script>
  </body>
</html>
```

**What is happening here?**

- [`cheerpjRunJar`] The second parameter corresponds to the _args_ object which is an argument for the Java Main method. we are passing the API address of the Server application so the Client can communicate with it.

2. Copy the second auth key you generated previously and paste it as a string replacing _"PasteYourKeyHere"_.
3. Now you are ready to serve this page and run the Client application in the browser. Simply run a HTTP server **inside** the `Client` directory with a different port than the one used for the Server app. For example:

```bash
cd ServerClientTutorial/Client
http-server -p 8081
```

4. Now open a browser tab and visit the address you are serving. It should be something similar to `http://127.0.0.1:8081/client.html`.
5. Copy the Server's IP address and paste it in the input field and hit enter. The Client app will try to connect to the Server app this way.
6. Once provided the IP address, you will see the CheerpJ loading animation for a brief moment and your application should show.

## 4. Final test

Now that you have both Client and Server applications running with CheerpJ, you should be able to input an username and connect in both apps to establish the connection. Test by sending messages from one application to the other one.

<div class="flex flex-row">
	<div class="w-1/2 mr-1 md:mr-2">
		![Server Browser](/docs/cheerpj3/assets/server-browser.png)
	</div>

  <div class="w-1/2 ml-1 md:ml-2">
  	![Client Browser](/docs/cheerpj3/assets/client-browser.png)
  </div>
</div>

You can download the full template of this tutorial [here](/docs/cheerpj3/tutorials/ServerClientTutorial.zip) or visit the [GitHub repository](https://github.com/leaningtech/cheerpj-meta/tree/main/examples/Server-Client).

## Credits

The Java applications used in this networking tutorial belong to [TechVidvan]. You can find their tutorial with the source code [here](https://techvidvan.com/tutorials/java-chat-application/). Some minor edits have been made to adapt to this tutorial.

## Further reading

- [Networking guide]
- [Visit the reference](/docs/reference)

[Networking guide]: /docs/guides/Networking
[TechVidvan]: https://techvidvan.com/tutorials/
[Run a Java app]: /docs/getting-started/Java-app
[`cheerpjInit`]: /docs/reference/cheerpjInit
[`cheerpjCreateDisplay`]: /docs/reference/cheerpjCreateDisplay
[`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
[virtual filesystem]: /docs/guides/File-System-support
[`tailscaleAuthKey`]: /docs/reference/cheerpjInit#tailscaleauthkey
[`tailscaleIpCb`]: /docs/reference/cheerpjInit#tailscaleipcb



---
File: /docs/13-tutorials/05-interoperability-tutorial.mdx
---

---
title: Java and JavaScript Interoperability
description: Learn how to enable Java and JavaScript communication using CheerpJ
---

import Callout from "@leaningtech/astro-theme/components/Callout.astro";

With CheerpJ, a Java application can interact with JavaScript in a browser environment, enabling seamless interaction between Java and JavaScript code.

In this tutorial, we’ll teach you how to create a two-way communication channel between Java and JavaScript using CheerpJ. This setup will allow a Java class to access JavaScript functions and vice versa, enabling data exchange between the two environments.

We will use a long-running Java thread to enable callbacks into our Java application at any time. It is also possible to call back into Java using native methods, which we explain further in our [`native methods guide`].

## Prerequisites

- [Download the template project](/docs/cheerpj3/tutorials/CheerpJInteroperabilityTutorial.zip) and unzip it.
- [Node.js](https://nodejs.org/en/) (>= 18)

## Project structure

The project consists of the following files and directories:

```plaintext
CheerpJInteroperabilityTutorial/
├── com/example
│   └── Example.java
│   └── manifest.txt
│   └── Example.class (and other compiled .class files)
├── index.html
└── example.jar
└── Makefile

```

In this tutorial, we will implement the native methods in JavaScript in the `index.html` file to enable communication between Java and JavaScript.

You can see the fully implemented example on [GitHub](https://github.com/leaningtech/cheerpj-meta/tree/main/examples/Interoperability).

## Java source code: `Example.java`

Let's start by examining the source code of the Java class that will interact with JavaScript. This class will receive input from JavaScript, process it, and send a response back to JavaScript.

```java title="Example.java"
package com.example;

public class Example {
    public static native void sendToHTML(String s);

    public String processInput(String input) {
        sendToHTML(input);
        return "Java received: " + input;
    }

    public static native void nativeSetApplication(Example myApplication);

    public static void main(String[] args) {
        Example app = new Example();
        new Thread(() -> {
            nativeSetApplication(app);
            System.out.println("Starting Thread");
        }).start();
    }
}
```

This Java class contains the following methods:

- `sendToHTML`: A native method implemented in JavaScript, called to send data to the JavaScript environment.
- `processInput`: Receives data from JavaScript, passes it to `sendToHTML`, and returns a response.
- `nativeSetApplication`: Captures the running Java thread for persistent communication with JavaScript.

<Callout title="Note" variant="important">
	There is **no need to recompile the Java code** for this tutorial, as a
	precompiled file is provided in the template project. However, if you want to
	modify the Java code, you will need to recompile it. To do so, follow the
	instructions in the [Running the example](#running-the-example) section.
</Callout>

## JavaScript native method implementation

To enable Java and JavaScript communication, we need to implement the [`native`] methods in JavaScript. These methods will handle the data exchange between the two environments.

We will do this in the `index.html` file, which is part of the template project `.zip` file. In this file, you will find useful comments to guide you through the implementation process described below.

### 1. Define JavaScript native methods

In the `<script>` tag, implement the native methods for interacting with Java.

To implement the native methods in JavaScript, we create an `async` function for each Java method following the naming convention `Java_<fully-qualified-class-name>_<method-name>`. The function should accept `lib` as the first parameter and the Java instance as the second parameter (if applicable). See the [`native method`] implementation guide for more details.

You can move these methods to a separate `.js` file for better organization and include them using the `<script>` tag in the HTML.

```js title="index.html"
async function Java_com_example_Example_sendToHTML(lib, str) {
	document.getElementById("javaOutput").innerText =
		"JavaScript received: " + str;
	console.log("Received input from Java: " + str);
}

async function Java_com_example_Example_nativeSetApplication(
	lib,
	myApplication
) {
	window.myApplication = myApplication;
	console.log("Java application instance set on JavaScript side.");
	// Make the inputDiv visible after initialization
	document.getElementById("inputDiv").style.display = "block";
	return new Promise(() => {}); // Keeps the function from returning
}
```

The `Java_com_example_Example_nativeSetApplication` function:

- Assigns the Java application instance to `window.myApplication`.
- Ensures continuous access by preventing the function from returning.

The `Java_com_example_Example_sendToHTML` function:

- Receives input from Java.
- Displays the input in the HTML document.

### 2. Implement the `sendInputToJava` function

Write a function to send input to Java:

```js title="index.html"
async function sendInputToJava() {
	const inputText = document.getElementById("inputText").value;
	const response = await window.myApplication.processInput(inputText);
}
```

The `sendInputToJava` function:

- Retrieves input from an HTML input box.
- Sends it to the Java method and displays the response in an alert.

### 3. Initialize CheerpJ

To use CheerpJ, include the following script in the `<head>` section of `index.html`:

```js title="index.html"
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

To load CheerpJ, we initialize it in the HTML file with specific configurations for native methods.

```js title="index.html"
(async () => {
	await cheerpjInit({
		version: 8,
		natives: {
			Java_com_example_Example_sendToHTML,
			Java_com_example_Example_nativeSetApplication,
		},
	});
	cheerpjCreateDisplay(800, 600);
	await cheerpjRunJar("/app/example.jar");
})();
```

Explanation:

- `cheerpjInit`: Initializes CheerpJ with the specified configurations:
  - `version`: Specifies the Java version to use.
  - `natives`: Lists JavaScript implementations of native Java methods.
- `cheerpjCreateDisplay`: Creates a display area for any graphical output (optional in this example).
- `cheerpjRunJar`: Loads and runs the provided JAR file.

## Running the example

1. There is **no need to recompile the Java code** for this tutorial as we only changed the JavaScript code and you can use the precompiled `example.jar` file provided in the template project. However, if you want to modify the Java code, you can recompile it using the provided `Makefile` (requires Java installed):

```bash
make
```

Alternatively, compile and package manually:

```bash
javac Example.java
jar cvfm example.jar manifest.txt com/example/*.class
```

2. **Start a Local Server**: Serve the files using a simple HTTP server like [`http-server`]:

```bash
npx http-server -p 8080
```

3. **Run the Example**: Open http://localhost:8080/index.html in your browser.

## The result

<iframe
	src="https://leaningtech.github.io/cheerpj-meta/examples/Interoperability/index.html"
	style="width: 100%; height: 500px; border: 0;"
></iframe>

## Source code

[View full source code on GitHub](https://github.com/leaningtech/cheerpj-meta/tree/main/examples/Interoperability)

[`http-server`]: https://www.npmjs.com/package/http-server
[`native`]: /docs/guides/implementing-native-methods
[`native method`]: /docs/guides/implementing-native-methods
[`native methods guide`]: /docs/guides/implementing-native-methods#calling-back-into-java-from-javascript



---
File: /docs/14-explanation/architecture.mdx
---

---
title: Architecture
description: How does CheerpJ work?
---

import LinkButton from "@leaningtech/astro-theme/components/LinkButton.astro";

CheerpJ is a WebAssembly-based **Java Virtual Machine for the browser**. This means Java applications can be executed from the browser with no Java installations. Amazing, right? but... How does it work?

## Overview

CheerpJ runs in any modern browser using standard Web technologies, particularly WebAssembly, JavaScript, and HTML5. It can be integrated into a web page like any JavaScript library, by simply adding a `<script>` tag. It requires no custom executable component, plugin, or server-side backend.

CheerpJ is very simple to use as it exposes an API for executing standalone Java applications, applets, Java Web Starts, and Java libraries - entirely in the browser. One of the strengths of CheerpJ is that it works directly with Java byte code/JARs, meaning no need to modify or have access to the application's source code.

CheerpJ assets are static, which makes it easily self-hostable, and we provide a cloud version under the [CheerpJ Community Licence](/docs/licensing) (free to use for personal projects and technical evaluations).

## CheerpJ components

CheerpJ is made of the following building blocks:

- A full Java runtime environment with its implementation of the JVM and a Java-to-JavaScript JIT compiler.
- A virtualized window manager
- A virtualized file system
- A module for networking support

![CheerpJ 3.0 architecture diagram](/docs/cheerpj3/assets/cheerpj-3-arch.png)

### The CheerpJ Java Runtime Environment

The magic behind CheerpJ is [Cheerp], which was used for compiling full Java SE 8 and Java SE 11 runtimes based on OpenJDK. This runtime was originally written in C++ and compiled to WebAssembly and JavaScript, making it 100% browser compatible. The architecture is designed to support multiple versions of Java, as well as custom runtimes. Future versions of CheerpJ will support Java 11, and newer LTS Java versions.

The most important component of the CheerpJ Java runtime environment is its JVM implementation. CheerpJ's implementation of the JVM is made of an _interpreter_ and a _Just In Time compiler_ (JIT) that work in conjunction in a 2-tier manner:

1. The Java byte code runs within an interpreter.
2. Then this byte code is Just-In-Time compiled to optimized JavaScript.

The interpreter does not only deal with initialization and rarely-used code, but also gathers necessary information for JIT-ting. The generated code is very efficient, and the internal optimizer can, among other things, inline and devirtualize calls, which is extremely important for a language such as Java.

![CheerpJ 3.0 JRE diagram](/docs/cheerpj3/assets/JRE.png)

Alongside being able to run Java applications in the browser, CheerpJ runtime also provides advanced, bidirectional Java-JavaScript interoperability. Meaning you can access DOM from Java by [implementing `native` methods directly in JavaScript](/docs/guides/Implementing-Java-native-methods-in-JavaScript). You can also interact with Java methods, objects and arrays directly from JavaScript by using the new [`cheerpjRunLibrary` API](/docs/reference/cheerpjRunLibrary).

### The virtualized window manager

What would be of an application without its graphical UI? CheerpJ's window manager supports Java AWT/Swing by converting windows to a hierarchy of HTML elements and HTML5 canvases.

Swing applications, will render exactly as they do in native. Swing Look&Feel is also supported, including 3rd party ones. Multi-window applications are supported, with keyboard focus being managed as expected. Integration with the system clipboard can be enabled via an initialization option.

### The virtualized file system

CheepJ provides multiple filesystem backends to accommodate different application needs, including access to server-hosted files and persistent local storage.

![](/docs/cheerpj3/assets/filesystem.png)

<LinkButton
	type="secondary"
	href="/docs/guides/File-System-support"
	iconRight="ep:arrow-right-bold"
	label="File System guide"
/>

### Networking support

For same-origin HTTP/HTTPS requests, CheerpJ will be able to transparently use `fetch`. More generalized networking is supported via Tailscale, a VPN technology using WebSockets as a transport layer. It can support many different networking scenarios, including access to private network services, peer-to-peer connections between users and access to the wider internet via a user/application provided *exit node*.
![CheerpJ 3.0 general networking](/docs/cheerpj3/assets/general_networking.png)

<LinkButton
	type="secondary"
	href="/docs/guides/Networking"
	iconRight="ep:arrow-right-bold"
	label="Networking guide"
/>

[cheerp]: /cheerp
[files and filesystems guide]: /docs/guides/File-System-support
[Networking guide]: /docs/guides/Networking
[licensing]: /docs/licensing



---
File: /docs/00-overview.mdx
---

---
title: CheerpJ
shortTitle: Overview
description: Java Virtual Machine for modern web browsers
---

import LinkButton from "@leaningtech/astro-theme/components/LinkButton.astro";
import ShowcaseList from "@leaningtech/astro-theme/components/ShowcaseList.astro";
import { DISCORD_URL } from "@/consts.ts";
import JNLPRunnerButton from "@leaningtech/astro-theme/components/JNLPRunnerButton.astro";
import AppletRunnerButton from "@leaningtech/astro-theme/components/AppletRunnerButton.astro";

<div class="not-prose flex gap-2 mb-2">
	<img
		src="https://img.shields.io/badge/version-4.0-orange"
		alt="Version 4.0"
	/>
	<a href="https://discord.leaningtech.com/">
		<img
			src="https://img.shields.io/discord/988743885121548329?color=%237289DA&logo=discord&logoColor=ffffff"
			alt="Discord server"
		/>
	</a>
	<a href="https://github.com/leaningtech/cheerpj-meta/issues">
		<img
			src="https://img.shields.io/github/issues/leaningtech/cheerpj-meta.svg?logo=github"
			alt="GitHub issues"
		/>
	</a>
</div>

<div class="text-lg">
	CheerpJ is a WebAssembly-based **Java Virtual Machine for the browser**. It
	has extensive compatibility with Java 8 and Java 11. CheerpJ provides a full
	runtime environment[^compat] for running Java applications, applets (Java 8),
	libraries, and Java Web Start / JNLP applications in the browser without
	plugins.
</div>

<div class="m-4 flex justify-center">
	[Get started](/docs/getting-started) · [Examples](/docs/tutorials) · [API
	Reference](/docs/reference) · [GitHub
	repository](https://github.com/leaningtech/cheerpj-meta)
</div>

```html
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

<div class="mx-24">![](./explanation-diagram.png)</div>

### **Not a developer?**

Check out our browser extensions for running Java Applets and Web Start applications. Designed for individual users and organizations, they require no technical knowledge or setup.
{/* Check out our browser extensions for **running Java Applets and Web Start applications directly in modern browsers**, without the need for a Java plugin or a Java installation. */}

<div class="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
	<AppletRunnerButton />
	<JNLPRunnerButton />
</div>

## Features

With CheerpJ, you can:

- Run existing **[Java applications]** in the browser with no changes
- Include **[Java applets]** in pages without legacy plugins (Java 8)
- Migrate **[Java Web Start / JNLP]** applications to work on modern systems
- Use **[Java libraries]** in JavaScript/TypeScript seamlessly
- Interoperate between Java and JavaScript libraries

**No installation required:** CheerpJ runs entirely in the browser, so there’s no need to download or install additional software.

CheerpJ is based on a full OpenJDK runtime environment and supports:

- [Networking]
- [Virtualized filesystem]
- [Clipboard]
- Audio
- Printing

<LinkButton label="Get started" type="primary" href="/docs/getting-started" />

## Getting started

{/* TODO: move to getting-started */}

Know what you're building? Jump straight to the relevant tutorial:

<div class="not-prose grid grid-cols-2 font-medium gap-2 text-stone-100">
	<a
		href="/docs/getting-started/Java-app"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Application
	</a>
	<a
		href="/docs/getting-started/Java-applet"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Applet
	</a>
	<a
		href="/docs/getting-started/Java-library"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Library
	</a>
	<a
		href="/docs/getting-started/JNLP"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		JWS/JNLP
	</a>
</div>

## How does CheerpJ work?

CheerpJ is a combination of two components:

1. An optimising Java-to-JavaScript JIT compiler.
2. A full Java SE 8 and Java SE 11 runtime based on OpenJDK.

Both are written in C++ and are compiled to WebAssembly & JavaScript using [Cheerp](https://cheerp.io/).

## What's unique about CheerpJ?

1. Extensive support for Java 8 and Java 11, including Swing, reflection and dynamic class loading with no manual intervention on the code.
2. CheerpJ works directly on Java bytecode, and does not require access to the Java source code.
3. CheerpJ comes with a full Java SE runtime, inclusive of Swing/AWT. It supports audio, printing, and any other Java SE features. The runtime supports WebAssembly for optimal performance and size.
4. The JavaScript code generated by the CheerpJ JIT is highly optimised and garbage-collectible.
5. CheerpJ enables bidirectional Java-JavaScript interoperability. JavaScript libraries, as well as the DOM, can be called and manipulated from Java. Also, Java modules can be invoked from JavaScript.
6. CheerpJ supports Java multi-threading. In addition, you can create concurrent applications by using Web Workers.

## Licensing

CheerpJ is free for personal use and technical evaluation. See [licensing](/docs/licensing) for details.

## Demos

Several demos of CheerpJ can be found [here](https://leaningtech.com/demo/).

You can also see CheerpJ in action in [JavaFiddle](https://javafiddle.leaningtech.com/):

<iframe
	src="https://javafiddle.leaningtech.com/N4IgLglmA2CmIC4QAlbWgewAQHcMCdoATXKACywGUcIA7AcxABoQBXAByIEMxYjEQAJgAMggMwBaAIzCJwgKwAVKQBYEqhPOEA6MVMEAtZiABmEOAGdEAbVDseZAQFkudbQCsuANy7GAxhi0vEECEAC27ARgWJ4+2lw4YNoAYoFgANwAOrThkfjRsVwAHtoWNAzaAFLJ+FxhsFk5EVEx3sWl5fRVADJcAEZojbkthSVldF2VAApctIPZw-mtPmOd2tQTAKqQ0FAQsBZDzUujHRPafQREsPjaAKIRYACeAEJXN43ZftBcFhZYLjoWFycHqQX+ACVWLRaP04FhgNksMisOxWH1dn4sBYwDwIFivBgICQwq5aAAKShgfATawAXSwXHw9AsAEoEUiUVyNgxtuY9gdtHRCQBrWC9Xj4clzHAAsnk1msxpcgC+2U5yLRGPxWEJxKw+GhCo5tC5XOmszQqKwAF4sDKsBa5tAFcqzZrSrAwG98NcpQ6Huxnj6-eSZEwsOHI8IIzJFZ9Te7Hb0BtAsGm7Q7Kim0OTMig0JgIwBhMiwG7sSoAQnzSo1ZugnrAqSC0tgspbYDzIEoNwgJnzEc72im3QAggBJAByEZUgnj9a57HiRCI5Ogddoi5R1Vq9SwJlt9vbjpqdVg3Z59CwsCKdXYcFrbvdJhXa-Ym6TB+09j8Itd27Iq+Fhet0GB+HigQQmgeJeLAigYNKrDoJ+SbAV6ABqEAWBAGIXtSrCwKhyJqrQpEgCqdIqkAA/embed?theme=dark"
	class="border border-stone-700 rounded-md w-full h-[40rem]"
></iframe>

## Community

CheerpJ is used in production by teams at NASA, Siemens, UBS, and [many others](https://leaningtech.com/case-studies/).

There are several community projects that use CheerpJ, such as:

<ShowcaseList tag="CheerpJ" limit={2} />

<div class="flex justify-end pt-4">
	<LinkButton
		type="secondary"
		href="/docs/community"
		label="View more community projects"
		iconRight="mi:arrow-right"
	/>
</div>

We have a vibrant Discord community where you can ask questions, share your projects, and get community support.

<LinkButton
	type="discord"
	href={DISCORD_URL}
	iconLeft="fa-brands:discord"
	label="Join our Discord server"
/>

<LinkButton
	type="secondary"
	href="https://twitter.com/leaningtech"
	iconLeft="fa-brands:twitter"
	label="Follow us on Twitter"
/>

---

[^compat]: CheerpJ has been tested on Oracle Forms, EBS, Swing, AWT, and numerous frameworks and libraries. It should be able to run Java SE applications that you would otherwise need a Java Runtime Environment for.

[Java applications]: /docs/getting-started/Java-app
[Java applets]: /docs/getting-started/Java-applet
[Java Web Start / JNLP]: /docs/getting-started/JNLP
[Java libraries]: /docs/getting-started/Java-library
[Networking]: /docs/guides/Networking
[Virtualized filesystem]: /docs/guides/File-System-support
[Clipboard]: /docs/reference/cheerpjInit#clipboardmode



---
File: /docs/20-faq.md
---

---
title: Frequently Asked Questions
---

## What is CheerpJ?

CheerpJ is a solution for running unmodified Java client applications into browser-based HTML5/JavaScript web applications. CheerpJ consists of a full Java runtime environment in JavaScript, and of a on-the-fly compiler for dynamic class generation, to be deployed alongside the application.

## What parts of the Java SE runtime are supported?

The CheerpJ runtime environment is a full Java SE runtime in JavaScript. Differently from other technologies which provide a partial re-implementation written manually in JavaScript, we opted to replace the entire OpenJDK Java SE runtime to JavaScript and WebAssembly. The CheerpJ runtime is constituted of both JavaScript files and .jar archives. All CheerpJ runtime components are dynamically downloaded on demand by the application to minimise total download size. The CheerpJ runtime library is hosted by us on a dedicated CDN-backed domain, and we invite users to link to it in order to take advantage of caching and cross-application resource sharing.

## Which Java versions are supported?

The new architecture introduced in CheerpJ 3.0 is engineered to fix the gap with modern Java versions quite easily. Currently, CheerpJ 4 supports Java 8 and Java 11 ([learn more here](/docs/reference/cheerpjInit#version)), with plans on supporting newer versions in the near future.

## Can I self-host the CheerpJ runtime?

Please [contact us](https://cheerpj.com/contact/) to discuss self-hosting CheerpJ and its runtime on your infrastructure.

## Can I use CheerpJ to run my legacy Java application in the browser? I have no longer access to the source code.

Yes, you can run any Java SE application with CheerpJ without touching the source code. You only need all the .jar archives of your application.

## Can I use Java libraries and integrate them in my HTML5 application using CheerpJ?

Yes. Java methods can be exposed to JavaScript with an interface compatible with async/await for convenience.

## Can I call JavaScript libraries or web APIs from Java?

Yes, CheerpJ allows you to interoperate with any JavaScript or browser API. Java native methods implemented in JavaScript are supported.

## Does CheerpJ support reflection?

Yes.

## Does CheerpJ support dynamic class generation?

Yes.

## When I run CheerpJ I see 404/403 errors in the browser console. What's going on?

Ignore those errors. CheerpJ provides a filesystem implementation on top of HTTP. In this context it is absolutely ok for some files to be missing. CheerpJ will correctly interpret 404 errors as a file not found condition.

## My application compiled with CheerpJ does not work and I just see the "CheerpJ runtime ready" on the top of the screen. What's going on?

Many first time users get stuck at this point. The most common issues are:

- Opening the HTML page directly from disk: The URL in the browser should always start with http:// or https://, if it starts with file:// CheerpJ will not work. You need to use a local web server during testing.
- Forgetting to add "/app/" prefix to the JAR files used in Web page. CheerpJ implements a virtual filesystem with multiple mount points, the "/app/" prefix is required.
- More in general, you can use the "Network tab" of the developer tools in the browser to check if the JAR is being correctly downloaded. If the JAR is never downloaded, or a 404 error is returned, something is wrong with the JAR path. If you don't see anything in the "Network tab", please reload the page while keeping the developer tools open.

## Can I play Old School RuneScape using CheerpJ or the CheerpJ Applet Runner extension?

Not yet. The main problem is that RuneScape requires low level network connections primitives (sockets) which are not provided by browsers at this time due to security concerns. In the future we might provide a paid add-on to the CheerpJ Applet Runner extension to support this use case via tunneling.

## Do I need to install anything to use CheerpJ?

No, there is nothing to download or install on your computer. CheerpJ runs entirely within the browser, so you don’t need an executable file (e.g., `.exe`).

## What is the status of CheerpJ?

CheerpJ is actively developed by [Leaning Technologies Ltd](https://leaningtech.com), a British-Dutch company focused on compile-to-JavaScript and compile-to-WebAssembly solutions.



---
File: /docs/21-migrating-from-cheerpj2.md
---

---
title: Migration from CheerpJ 2
---

CheerpJ version 3 (and above) is a complete reimplementation of CheerpJ 2, and as such it is not fully backward compatible. This page shows how to migrate from CheerpJ 2 to CheerpJ 3 (or CheerpJ 4)

### Script tag

Include CheerpJ 4 on your page with the following snippet:

```html
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

## Breaking changes

When designing the new architecture we had the objective of making a drop-in replacement for CheerpJ 2.3 as much as we could. This objective has been _mostly_ achieved, but in some cases we had to deprecate and remove functionalities in favor of much improved alternatives.

### `cheerpjInit` is now asynchronous

The runtime API is not exposed until [`cheerpjInit`] is called and its `Promise` resolves.

Therefore, **be sure to `await` the [`cheerpjInit`] call** before using any other functions.

### `cheerpj-dom.jar` removed

Calling JavaScript functions from Java is now done using the `natives` option of `cheerpjInit`. See the [JNI guide] for more information.

If you used the `com.leaningtech.client` package extensively, check out the [CJDom library](https://github.com/reportmill/CJDom) (not maintained by Leaning Technologies).

### `cheerpjRunJarWithClasspath` removed

This feature had no real use case because when using `java -jar`, the JAR file is the source of all user classes, and any other class path settings are ignored.

### `CheerpJWorker` replaced

CheerpJ can now be imported in a Web Worker without any special setup. Simply call [`importScripts`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts) from a worker to load CheerpJ, then use CheerpJ as usual. The `CheerpJWorker` class has been removed.

```js
importScripts("https://cjrtnc.leaningtech.com/4.0/loader.js");

// Use CheerpJ as usual
(async () => {
  await cheerpjInit();
  const lib = await cheerpjRunLibrary("/app/example.jar");
  // ...
)();
```

### `cjNew` and `cjCall` replaced with library mode API

`cjNew` and `cjCall` have been removed in favour of [`cheerpjRunLibrary`].

```js
// CheerpJ 2
cheerpjInit();
cheerpjRunJar("/app/library.jar");
let obj = await cjNew("com.library.MyClass");
await cjCall(obj, "myMethod");
```

```js
// CheerpJ 3 (and above)
await cheerpjInit();
const lib = await cheerpjRunLibrary("/app/library.jar");
const MyClass = await lib.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## Other major changes

<!-- TODO: copy from cheerpj-3-deep-dive blog post -->

### No Ahead-Of-Time compilation (`cheerpjify.py`)

**No Ahead-Of-Time compilation:** To achieve good performance, CheerpJ required you to post-process JAR files with a custom binary compiler. The compiler would generate a `.jar.js` files for each input JAR. CheerpJ 3 (and above) features an advanced JIT engine that can generate better-performing code than CheerpJ 2.3 ever could. Removal of `.jar.js` files also significantly decreases how much data needs to be downloaded during application startup.

No downloads are provided with CheerpJ 3 (and above).

- AOT optimization: CheerpJ 3 (and above) use a JIT compiler only, and as such it does not require any pre-processing of the JAR files, like conversion to `.jar.js`.
- `--natives`: JNI function implementations should be passed to `cheerpjInit` using the `natives` option. See the [JNI guide] for more information.

### Actual support for ClassLoaders

CheerpJ 2.3 had very limited support for ClassLoaders. As a consequence of requiring AOT compilation of `.jar.js` files, it could only support the standard one provided by OpenJDK. CheerpJ 3 (and above) radically improves the status-quo by properly using ClassLoaders as expected by Java.

### `com.leaningtech.handlers` HTTP handler no longer needed

Previously, CheerpJ 2 required a special Java property to be set in order for HTTP(S) requests to work. This is no longer needed.

### `cheerpjAddStringFile` deprecated and renamed to `cheerpOSAddStringFile`

The `cheerpjAddStringFile` function has been renamed to `cheerpOSAddStringFile` to better reflect its behaviour and provide parity with CheerpX. The old name is still available for backwards compatibility.

[`cheerpjInit`]: /docs/reference/cheerpjInit
[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
[`cheerpjRunMain`]: /docs/reference/cheerpjRunMain
[JNI guide]: /docs/guides/Implementing-Java-native-methods-in-JavaScript



---
File: /docs/22-changelog.md
---

---
title: Changelog
---

## [4.0](https://labs.leaningtech.com/blog/cheerpj-4.0) - April 22, 2025

```html
<script src="https://cjrtnc.leaningtech.com/4.0/loader.js"></script>
```

- Support for Java 11
- Support WebAssembly JNI modules
- Improved mobile usability
- Improved performance
- Various bug fixes
- [`enableInputMethods`](/docs/reference/cheerpjInit#enableinputmethods) is set to `True` by default.

## [3.1](https://labs.leaningtech.com/blog/cheerpj-3.1) - February 5, 2025

```html
<script src="https://cjrtnc.leaningtech.com/3.1/cj3loader.js"></script>
```

- Maximise window support
- Brand new "execCallback" option
- Restore audio support
- Various bug fixes
- Improved font behavior
- Improved debugging options
- Improved performance

## [3.0](https://cheerpj.com/cheerpj-3-now-generally-available/) - February 1, 2024

```html
<script src="https://cjrtnc.leaningtech.com/3.0/cj3loader.js"></script>
```

- Support all Java opcodes in the JIT
- Better support for missing JNI symbols
- Improved support for socket syscalls
- Support for loading native libraries as JavaScript modules
- Support zero-copy passing of primitive arrays in library mode
- Restore support for image filtering
- Restore support for printing
- Optimized font handling
- Improved error message when server does not support content ranges

## [3.0rc2](https://labs.leaningtech.com/blog/cheerpj-3-deep-dive) - November 29, 2023

```html
<script src="https://cjrtnc.leaningtech.com/3.0/cj3loader.js"></script>
```

- Reduced verbosity of debug messages
- Support for `synchronised` methods in the JIT
- Restored support for AWT to the same level as CheerpJ 2.3
- Improved reflection support
- Support for Web Workers (just use `importScripts`)
- Improved clipboard support
- Improved library mode with support object field access, arrays, `instanceof`, quality-of-life and debugging
- Improved support for fonts
- Improved support for class loaders
- Fixed preloading support
- Support for `ClassCastException`
- `cheerpjAddStringFile` deprecated, renamed to `cheerpOSAddStringFile`

## [3.0rc1](https://cheerpj.com/announcing-cheerpj-3-0rc1-help-us-test-and-improve/) - October 18, 2023

```html
<script src="https://cjrtnc.leaningtech.com/3.0rc1/cj3loader.js"></script>
```

- Completely new JIT-based architecture
  - Removed AOT compiler
- Full classloader support
- New scalable JNI architecture (`cheerpjInit` `natives` option)
- Library mode (`cheerpjRunLibrary`)
  - Removed `cjCall` and `cjNew`
- `cheerpjInit` is now asynchronous
- `cheerpj-dom.jar` removed
- `cheerpjRunJarWithClasspath` removed
- `CheerpJWorker` removed (3.0rc2 adds support for `importScripts`)
- `com.leaningtech.handlers` HTTP handler no longer needed. HTTP(S) requests just work

## Previous versions

[CheerpJ 3.0 was a major architectural rewrite of CheerpJ](https://labs.leaningtech.com/blog/announcing-cheerpj-3).

For previous versions, see the [CheerpJ 2.x changelog](https://labs.leaningtech.com/docs/cheerpj2/changelog).

