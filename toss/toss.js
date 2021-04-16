/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 200:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;


__webpack_unused_export__ = ({ value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var UrlParser = _interopDefault(__webpack_require__(564));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var getHostname = function (origin) { return (new UrlParser(origin)).hostname; };
var getDomainAndPath = function (origin) {
    var urlParts = new UrlParser(origin);
    return "" + urlParts.host;
};

/**
 * Here we create the listening functions that will receive data-type specific
 * requests within the iframe, retrieve the data via the user-defined DataConfig
 * handler, cache said data in localStorage, then return it to the requesting
 * application.
 */
var responseTypeName = 'response';
var appListenerFactory = function (_a) {
    var dataKey = _a.dataKey, iframeUrl = _a.iframeUrl;
    return new Promise(function (resolve, reject) {
        // // Cache the iframe's base domain for use in IDing requests from
        // // it later on.
        var iframeLocation = getDomainAndPath(iframeUrl);
        // Create a listener, which will await iframe responses
        var listener = function (_a) {
            var origin = _a.origin, maybeIframePayload = _a.data;
            // Attempt to parse payload:
            var response;
            var responseType;
            var responseDataKey;
            try {
                response = JSON.parse(maybeIframePayload);
                responseType = response.type;
                responseDataKey = response.dataKey;
            }
            catch (e) {
                // Guess it wasn't one of ours.
                // Logging here might not be a bad idea, but also might get noisy
                // if ads and whatnot started emitting to this iframe.
                return;
            }
            if (
            // Ensure the caller is the main site's iframe
            iframeLocation === getDomainAndPath(origin) &&
                // and that this is a response from the iframe:
                responseType === responseTypeName &&
                // and that the response is intended for this data type
                responseDataKey === dataKey) {
                // Clean up:
                window.removeEventListener('message', listener);
                if ('data' in response) {
                    // Success! Relay the data to the caller:
                    resolve(response.data);
                }
                else if ('error' in response) {
                    // Uh-oh! Something went wrong! Relay error to caller:
                    reject(new Error("Error received from " + dataKey + " data request! " + response.error));
                }
                else {
                    reject(new Error("No data or errors received in request for " + dataKey + ".  Please submit a ticket to the project maintainers including the custom handler for " + dataKey + ", should one exist. This should not be possible."));
                }
            }
        };
        // Set the listener a-listenin':
        window.addEventListener('message', listener, false);
    });
};

var cache = {};
/**
 * Create and cache the iframe.
 *
 * We're caching by domain, in case multiple hub sites are referenced
 * from a single satellite domain.
 *
 * We're returning a promise to avoid a race condition.  If two calls
 * go out for the same iframe, and the second happens before the iframe
 * has loaded, we want the second to also be beholden to the iframe's
 * loading.  The promise is what ensures the iframe has loaded, so we'll
 * need to return that for all subsequent calls.
 */
var getIframe = function (iframeUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var domain;
    return __generator(this, function (_a) {
        domain = getDomainAndPath(iframeUrl);
        cache[domain] = cache[domain] || createIframe(iframeUrl);
        return [2 /*return*/, cache[domain]];
    });
}); };
/**
 * Create an promise that resolves to a fully-loaded iframe:
 */
var createIframe = function (iframeUrl) { return new Promise(function (resolve) {
    var iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.display = 'none';
    iframe.onload = function () { return resolve(iframe); };
    window.document.body.appendChild(iframe);
}); };

/**
 * Here we inject or gather the cached iframe, then post the request to it.
 */
var sendRequest = function (type, config) { return __awaiter(void 0, void 0, void 0, function () {
    var iframeUrl, iframe, request;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                iframeUrl = config.iframeUrl;
                return [4 /*yield*/, getIframe(iframeUrl)
                    // Form the request object to send to the iframe:
                ];
            case 1:
                iframe = _a.sent();
                request = { type: type, config: config };
                // Send the iframe the request upon load into the DOM:
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage(JSON.stringify(request), iframeUrl);
                }
                else {
                    throw new Error('iframe contentWindow not present on window. Something has apparently removed it.');
                }
                return [2 /*return*/];
        }
    });
}); };

var REQUEST_TYPE_GET = 'get';
var REQUEST_TYPE_SET = 'set';
var REQUEST_TYPE_RESPONSE = 'response';
var INFINITY_TOKEN = 'INFINITY_TOKEN';

/**
 * In this file we set up the listener for the application,
 * then send out the request for the data to the iframe.
 *
 * The iframe will receive the request and check for a pre-existing
 * value.  If that value does not exist, the iframe will
 * execute the user-defined data-getter, caching the response in
 * localStorage.
 *
 * Finally, the iframe will relay to recovered value back to the
 * application.
 */
var get = function (config) {
    var type = REQUEST_TYPE_GET;
    return makeRequest(config, type);
};
var set = function (config) {
    var type = REQUEST_TYPE_SET;
    return makeRequest(config, type);
};
var makeRequest = function (config, type) { return __awaiter(void 0, void 0, void 0, function () {
    var resultPromise;
    return __generator(this, function (_a) {
        resultPromise = appListenerFactory(config);
        // Create the request for data, and send it into the iframe:
        sendRequest(type, config);
        return [2 /*return*/, resultPromise];
    });
}); };

/**
 * In this file we create the single listener for the iframe.
 * Once a message is posted to the iframe, this file receives
 * it, ensures the sender is on the list of dependent sites,
 * then routes the request to the proper data getter.
 */
var setIframeListener = function (routes, dependentDomains) {
    var iframeListener = function (_a) {
        var origin = _a.origin, appRequestPayload = _a.data;
        return __awaiter(void 0, void 0, void 0, function () {
            var requesterBaseDomain, type, config, requestSpecs, handler, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        requesterBaseDomain = getHostname(origin);
                        if (!dependentDomains.includes(requesterBaseDomain)) return [3 /*break*/, 2];
                        type = void 0;
                        config = void 0;
                        try {
                            requestSpecs = JSON.parse(appRequestPayload);
                            config = requestSpecs.config;
                            type = requestSpecs.type;
                        }
                        catch (e) {
                            // Guess it wasn't one of ours.
                            // Logging here might not be a bad idea, but also might get noisy
                            // if ads and whatnot started emitting to this iframe.
                            return [2 /*return*/];
                        }
                        handler = getEndpoint(type, config.dataKey, routes);
                        if (!handler) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, executeRoute(handler, config)
                            // Emit the result back to the host application:
                        ];
                    case 1:
                        response = _b.sent();
                        // Emit the result back to the host application:
                        window.parent.postMessage(JSON.stringify(response), origin);
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    // Add the event listener to start tracking the calls:
    window.addEventListener('message', iframeListener, false);
};
// Determine the handler the request is destined for:
var getEndpoint = function (requestType, dataKey, routes) {
    var handler;
    if (requestType === REQUEST_TYPE_SET) {
        // The app has requested to set a data value:
        handler = routes[REQUEST_TYPE_SET];
    }
    else if (routes[dataKey]) {
        // There is a custom handler set up for this `dataKey`.
        handler = routes[dataKey];
    }
    else if (requestType === REQUEST_TYPE_GET) {
        // This is a generic get request, without a custom handler.
        handler = routes[REQUEST_TYPE_GET];
    }
    else {
        // The `requestType` of this request wasn't valid.  The request wasn't
        // intended for us.
        handler = null;
    }
    return handler;
};
// Attempt to execute the handler for this request, and record the error
// for it if anything goes awry:
var executeRoute = function (handler, config) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, handler(config)];
            case 1:
                response = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                response = composeErrorResponse(config.dataKey, e_1.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, response];
        }
    });
}); };
// Structure an error response:
var composeErrorResponse = function (dataKey, errorMessage) { return ({
    type: REQUEST_TYPE_RESPONSE,
    dataKey: dataKey,
    error: errorMessage
}); };

var msInADay = 1000 * 60 * 60 * 24;
var thirtyYears = msInADay * 365.25 * 30;
var setWithExpiry = function (key, data, expires) {
    if (expires === void 0) { expires = thirtyYears; }
    // Get milliseconds till expiration:
    var expiry = getMsToLive(expires);
    if (data === undefined) {
        throw new Error("Request to set " + key + " contained no data.");
    }
    // Package data to save with expiry:
    var item = {
        data: data,
        expiry: expiry
    };
    localStorage.setItem(key, JSON.stringify({ item: item }));
    return getWithExpiry(key);
};
var getMsToLive = function (daysToLive) {
    // LS can't cache 'infinity', so we'll use a placeholder:
    if (daysToLive === Infinity) {
        return INFINITY_TOKEN;
    }
    // Return the unix epoch at which point the data expires:
    return Date.now() + (daysToLive * msInADay);
};
var getWithExpiry = function (key) {
    // Retrieve item:
    var itemStr = localStorage.getItem(key);
    // If the item doesn't exist, return null
    if (!itemStr) {
        return null;
    }
    // Unpack and deal with Infinity:
    var _a = JSON.parse(itemStr).item, data = _a.data, expiry = _a.expiry;
    if (expiry === INFINITY_TOKEN) {
        expiry = Infinity;
    }
    // Compare the expiry time of the item with the current time:
    if (Date.now() > expiry) {
        // If the item is expired, delete the item from storage
        // and return null:
        localStorage.removeItem(key);
        return null;
    }
    return data;
};

/**
 * This factory wraps the user-defined data getter.  This wrapper
 * takes care of the data localStorage management for each user-defined
 * `DataConfig` object passed into `createIframe`.
 *
 * One of these endpoints will be created per user-defined localStorage
 * value.  Each is added to the routes of the iframe, and await calls
 * from the application.
 */
var iframeEndpointFactory = function (_a) {
    var handler = _a.handler, dataKey = _a.dataKey, expires = _a.expires;
    // Create the logic that sits at a particular endpoint within
    // the iframe:
    var endpoint = function (config) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, handlerPayload, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ('resetData' in config && config.resetData) {
                        // Remove value if dictated by app request:
                        localStorage.removeItem(dataKey);
                    }
                    else {
                        // Attempt to get cached data:
                        data = getWithExpiry(dataKey);
                    }
                    if (!!data) return [3 /*break*/, 5];
                    handlerPayload = void 0;
                    if ('handlerPayload' in config) {
                        handlerPayload = config.handlerPayload;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handler(handlerPayload)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    throw new Error("Something went wrong in the custom handler for " + dataKey + " data request: " + e_1.message);
                case 4:
                    if (data) {
                        setWithExpiry(dataKey, data, expires);
                    }
                    _a.label = 5;
                case 5:
                    if (data) {
                        // If we successfully retrieved the data, relay
                        // it back to the requesting application:
                        response = { type: REQUEST_TYPE_RESPONSE, dataKey: dataKey, data: data };
                    }
                    else {
                        // Uh-oh.  No data.  Report this to the
                        // requesting application:
                        throw new Error("Failed to retrieve the " + dataKey + " data from the iframe. Please confirm the DataConfig handler returns a value in every case.");
                    }
                    return [2 /*return*/, response];
            }
        });
    }); };
    return endpoint;
};

var getData = function (_a) {
    var dataKey = _a.dataKey;
    return {
        type: REQUEST_TYPE_RESPONSE,
        dataKey: dataKey,
        data: getWithExpiry(dataKey)
    };
};

var setData = function (config) {
    if (!('data' in config)) {
        throw new Error("Must include a data payload in calls to setData with " + config.dataKey + " dataKey");
    }
    var dataKey = config.dataKey, data = config.data;
    var expires;
    if ('expires' in config) {
        expires = config.expires;
    }
    var savedDate = setWithExpiry(dataKey, data, expires);
    return {
        type: REQUEST_TYPE_RESPONSE,
        dataKey: config.dataKey,
        data: savedDate
    };
};

var _a;
/**
 * In this file, add the getter and setter routes for requests
 * incoming to the iframe.
 *
 * We also create a map of the custom endpoints the user has defined.
 *
 * When the iframe receives a request, this route map will allow
 * the iframe to direct the request to the appropriate user-defined
 * or default handler for the data type.
 */
var routes = (_a = {},
    _a[REQUEST_TYPE_GET] = getData,
    _a[REQUEST_TYPE_SET] = setData,
    _a);
var createIframeRoutes = function (dataConfigs) { return dataConfigs
    .reduce(function (routes, dataConfigs) {
    var dataKey = dataConfigs.dataKey;
    if (routes[dataKey]) {
        throw new Error("Multiple modules are attempting to define the " + dataKey + " DataConfig.  Please ensure the configuration for this dataKey is set once per implementation.");
    }
    routes[dataKey] = iframeEndpointFactory(dataConfigs);
    return routes;
}, routes); };

var createIframe$1 = function (_a) {
    var dependentDomains = _a.dependentDomains, _b = _a.dataConfigs, dataConfigs = _b === void 0 ? [] : _b;
    // Create routes for default and custom data getters.
    var routes = createIframeRoutes(dataConfigs);
    // Add the local domain to the whitelisted domains by default:
    dependentDomains.push(getHostname(origin));
    // Create the listener, which picks up requests, filters
    // out non-whitelisted domains, and receives data based on
    // the dataKey of the response:
    setIframeListener(routes, dependentDomains);
};

exports.Vz = createIframe$1;
exports.U2 = get;
__webpack_unused_export__ = set;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 129:
/***/ ((__unused_webpack_module, exports) => {



var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),

/***/ 418:
/***/ ((module) => {



/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),

/***/ 564:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var required = __webpack_require__(418)
  , qs = __webpack_require__(129)
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:[\\/]+/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?([\\/]{1,})?([\S\s]*)/i
  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
  , left = new RegExp('^'+ whitespace +'+');

/**
 * Trim a given string.
 *
 * @param {String} str String to trim.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(left, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof __webpack_require__.g !== 'undefined') globalVar = __webpack_require__.g;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  address = trimLeft(address);

  var match = protocolre.exec(address)
    , protocol = match[1] ? match[1].toLowerCase() : ''
    , slashes = !!(match[2] && match[2].length >= 2)
    , rest =  match[2] && match[2].length === 1 ? '/' + match[3] : match[3];

  return {
    protocol: protocol,
    slashes: slashes,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && url.hostname) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/* harmony import */ var cookie_toss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(200);

window.toss = {
    createIframe: cookie_toss__WEBPACK_IMPORTED_MODULE_0__/* .createIframe */ .Vz,
    get: cookie_toss__WEBPACK_IMPORTED_MODULE_0__/* .get */ .U2
};

})();

/******/ })()
;