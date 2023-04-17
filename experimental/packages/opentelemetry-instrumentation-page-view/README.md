# OpenTelemetry Page View Event Instrumentation for Web

[![NPM Published Version][npm-img]][npm-url]
[![Apache License][license-image]][license-image]

**Note: This is an experimental package under active development. New releases may include breaking changes.**

This module provides automatic instrumentation for web pages by sending a log record for a page view event.

## Installation

```bash
npm install --save @opentelemetry/instrumentation-page-view
```

## Usage

OpenTelemetry HTTP Instrumentation allows the user to automatically collect log data and export them to their backend of choice, to give observability to distributed systems.

To use this instrumentation register it in the list of instrumentations as follows

```js
const { PageViewEventInstrumentation } = require('@opentelemetry/instrumentation-page-view');

const { registerInstrumentations } = require('@opentelemetry/instrumentation');


registerInstrumentations({
  instrumentations: [new PageViewEventInstrumentation()],
});

```

## Example

### Page view instrumentation Options

## Useful links

- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more about OpenTelemetry JavaScript: <https://github.com/open-telemetry/opentelemetry-js>
- For help or feedback on this project, join us in [GitHub Discussions][discussions-url]

## License

Apache 2.0 - See [LICENSE][license-url] for more information.

[discussions-url]: https://github.com/open-telemetry/opentelemetry-js/discussions
[license-url]: https://github.com/open-telemetry/opentelemetry-js/blob/main/LICENSE
[license-image]: https://img.shields.io/badge/license-Apache_2.0-green.svg?style=flat
[npm-url]: https://www.npmjs.com/package/@opentelemetry/instrumentation-http
[npm-img]: https://badge.fury.io/js/%40opentelemetry%2Finstrumentation-http.svg
