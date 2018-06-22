# pkgsrv

[![Build Status](https://travis-ci.org/kitsonk/pkgsrv.svg?branch=master)](https://travis-ci.org/kitsonk/pkgsrv)
[![codecov](https://codecov.io/gh/kitsonk/pkgsrv/branch/master/graph/badge.svg)](https://codecov.io/gh/kitsonk/pkgsrv)

A server providing source packages based on semantic versioning.

## Installation

```
$ npm install pkgsrv
```

## Command line options

|Option|Default|Description|
|------|-------|-----------|
|`-b` or `--base`|CWD + `/packages`|Set the base path of where packages are to be served up.|
|`-d` or `--debug`|`false`|Enable a higher level of logging at a _debug_ level and other diagnostic information.|
|`-l` or `--logs`|`false`|Log events to a file.|
|`-p` or `--port`|3000|The port that the server should listen on.|
|`-s` or `--subdomain`| |Send logs to Loggly on the provided subdomain.|
|`-t` or `--token`| |Authorisation token to utilise when sending log events to Loggly.|

## How it works

The server is intended to stream modules of code to a client based on resolving a URL that can include a [semver](https://semver.org/), a specific version, or a tag.

### Semantic versions

For example, there is the following file structure:

```
packages
└─── pkgA
    ├─── 1.0.0
    │   │   index.ts
    ├─── 1.0.1
    │   │   index.ts
    ├─── 1.0.2
    │   │   index.ts
    ├─── 2.0.0
    │   │   index.ts
    └─── 2.0.1
        │   index.ts
```

And the request was made for `http://localhost:3000/pkgA@^1.0.0/index.ts` the client would be redirected to `/pkgA@1.0.2/index.ts` and the `packages/pkgA/1.0.2/index.ts` would be streamed to the client.

### Tags

Packages support a configuration JSON file which can express items like tags, which resolve to specific versions of the package.  For example if there was a `packages/pkgA/config.json` that contained:

```json
{
  "tags": {
    "latest": "2.0.0",
    "beta": "2.0.1"
  }
}
```

Then request was made for `http://localhost:3000/pkgA@beta/index.ts` the client would be redirected to `/pkgA@2.0.0/index.ts` and the `packages/pkgA/2.0.0/index.ts` would be streamed to the client.

### Specific versions

If the request was made for `http://localhost:3000/pkgA@1.0.1/index.ts` the client would not be redirected and `packages/pkgA/1.0.1/index.ts` would be returned to the client.

### Omitted semver or tag

If a request is made without any version or tag as part of the URL, if a `config.json` exists for the package, the `latest` tag version would be returned.  If there is no `config.json`, the maximum version will be returned.

### Namespace packages

The server supports named packages and namespaced packages.  Namespaces will start with and `@` symbol, which indicates the second part of the path is the package name.

For example `http://localhost:3000/@ns/pkgA/index.ts` would attempt to resolve the latest version of the package located in `packages/@ns/pkgA`.

## License

`pkgsrv` is licensed under the MIT License and Copyright 2018 by Kitson P. Kelly.
