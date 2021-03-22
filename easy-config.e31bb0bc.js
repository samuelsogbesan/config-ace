// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/local-storage/stub.js":[function(require,module,exports) {
'use strict';

var ms = {};

function getItem (key) {
  return key in ms ? ms[key] : null;
}

function setItem (key, value) {
  ms[key] = value;
  return true;
}

function removeItem (key) {
  var found = key in ms;
  if (found) {
    return delete ms[key];
  }
  return false;
}

function clear () {
  ms = {};
  return true;
}

module.exports = {
  getItem: getItem,
  setItem: setItem,
  removeItem: removeItem,
  clear: clear
};

},{}],"node_modules/local-storage/parse.js":[function(require,module,exports) {
'use strict';

function parse (rawValue) {
  const parsed = parseValue(rawValue);

  if (parsed === undefined) {
    return null;
  }

  return parsed;
}

function parseValue (rawValue) {
  try {
    return JSON.parse(rawValue);
  } catch (err) {
    return rawValue;
  }
}

module.exports = parse;

},{}],"node_modules/local-storage/tracking.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var parse = require('./parse');
var listeners = {};
var listening = false;

function listen () {
  if (global.addEventListener) {
    global.addEventListener('storage', change, false);
  } else if (global.attachEvent) {
    global.attachEvent('onstorage', change);
  } else {
    global.onstorage = change;
  }
}

function change (e) {
  if (!e) {
    e = global.event;
  }
  var all = listeners[e.key];
  if (all) {
    all.forEach(fire);
  }

  function fire (listener) {
    listener(parse(e.newValue), parse(e.oldValue), e.url || e.uri);
  }
}

function on (key, fn) {
  if (listeners[key]) {
    listeners[key].push(fn);
  } else {
    listeners[key] = [fn];
  }
  if (listening === false) {
    listen();
  }
}

function off (key, fn) {
  var ns = listeners[key];
  if (ns.length > 1) {
    ns.splice(ns.indexOf(fn), 1);
  } else {
    listeners[key] = [];
  }
}

module.exports = {
  on: on,
  off: off
};

},{"./parse":"node_modules/local-storage/parse.js"}],"node_modules/local-storage/local-storage.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var stub = require('./stub');
var parse = require('./parse');
var tracking = require('./tracking');
var ls = 'localStorage' in global && global.localStorage ? global.localStorage : stub;

function accessor (key, value) {
  if (arguments.length === 1) {
    return get(key);
  }
  return set(key, value);
}

function get (key) {
  const raw = ls.getItem(key);
  const parsed = parse(raw);
  return parsed;
}

function set (key, value) {
  try {
    ls.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function remove (key) {
  return ls.removeItem(key);
}

function clear () {
  return ls.clear();
}

function backend (store) {
  store && (ls = store);

  return ls;
}

accessor.set = set;
accessor.get = get;
accessor.remove = remove;
accessor.clear = clear;
accessor.backend = backend;
accessor.on = tracking.on;
accessor.off = tracking.off;

module.exports = accessor;

},{"./stub":"node_modules/local-storage/stub.js","./parse":"node_modules/local-storage/parse.js","./tracking":"node_modules/local-storage/tracking.js"}],"state/IState.js":[function(require,module,exports) {
var required = function required() {
  throw new Error("Implement");
};

var IState = {
  // Read only getter for state.
  getState: required,
  // Converts state to string.
  export: required,
  // A function that, given the old state and a new value, makes a change to the underlying state.
  setState: required
};
module.exports = IState;
},{}],"state/query.js":[function(require,module,exports) {
var ls = require('local-storage');

var IState = require('./IState');

var state = ls.bind(this, 'query');

if (!state()) {
  state({});
}

var setState = function setState(newState) {
  return state(newState);
};
/**
 * Holds the value of the current key being pressed.
 */


var QueryState = {};
QueryState.prototype = Object.create(IState);

QueryState.getState = function () {
  return state();
};

QueryState.export = function () {
  return JSON.stringify(state());
};

QueryState.setQuery = function (newQuery) {
  return setState(newQuery);
};

module.exports = QueryState;
},{"local-storage":"node_modules/local-storage/local-storage.js","./IState":"state/IState.js"}],"constants/keyNames.js":[function(require,module,exports) {
module.exports = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "kp_5": "5",
  "kp_end": "1 / End",
  "kp_downarrow": "2 / Down Arrow",
  "kp_pgdn": "3 / Page Down",
  "kp_leftarrow": "4 / Left Arrow",
  "kp_rightarrow": "6 / Right Arrow",
  "kp_home": "7 / Home",
  "kp_uparrow": "8 / Up Arrow",
  "kp_pgup": "9 / Page Up",
  "kp_ins": "0 / Insert",
  "kp_del": ". / Delete",
  "kp_slash": "/",
  "kp_multiply": "*",
  "kp_minus": "-",
  "kp_plus": "+",
  "ins": "Insert",
  "del": "Delete",
  "home": "Home",
  "end": "End",
  "pgup": "Page Up",
  "pgdn": "Page Down",
  "uparrow": "Up Arrow",
  "leftarrow": "Left Arrow",
  "downarrow": "Down Arrow",
  "rightarrow": "Right Arrow",
  "f1": "F1",
  "f2": "F2",
  "f3": "F3",
  "f4": "F4",
  "f5": "F5",
  "f6": "F6",
  "f7": "F7",
  "f8": "F8",
  "f9": "F9",
  "f10": "F10",
  "f11": "F11",
  "f12": "F12",
  "a": "A",
  "b": "B",
  "c": "C",
  "d": "D",
  "e": "E",
  "f": "F",
  "g": "G",
  "h": "H",
  "i": "I",
  "j": "J",
  "k": "K",
  "l": "L",
  "m": "M",
  "n": "N",
  "o": "O",
  "p": "P",
  "q": "Q",
  "r": "R",
  "s": "S",
  "t": "T",
  "u": "U",
  "v": "V",
  "w": "W",
  "x": "X",
  "y": "Y",
  "z": "Z",
  "enter": "Enter",
  "space": "Space Bar",
  "[": "[",
  "]": "]",
  "\\": "\\",
  ";": ";",
  "'": "'",
  ",": ",",
  ".": ".",
  "/": "/",
  "backspace": "Backspace",
  "tab": "Tab",
  "capslock": "Caps Lock",
  "shift": "Shift Left",
  "rshift": "Shift Right",
  "ctrl": "Control Left",
  "rctrl": "Control Right",
  "alt": "Alt Left",
  "ralt": "Alt Right",
  "mouse1": "Left Mouse",
  "mouse2": "Right Mouse",
  "mouse3": "Middle Mouse",
  "mouse4": "Side Mouse 1",
  "mouse5": "Side Mouse 2",
  "mwheeldown": "Mouse Wheel Down",
  "mwheelup": "Mouse Wheel Up"
};
},{}],"state/config.js":[function(require,module,exports) {
var ls = require('local-storage');

var IState = require('./IState');

var state = ls.bind(this, 'config');

if (!state()) {
  state({});
}

var setState = function setState(newState) {
  return state(newState);
};

var ConfigState = {};
ConfigState.prototype = Object.create(IState);

ConfigState.getState = function () {
  return state();
};

ConfigState.toString = function () {
  return JSON.stringify(state());
};
/**
 * The binds returned as an array of bind strings.
 */


ConfigState.export = function () {
  var s = state();
  var binds = [];
  Object.keys(s).forEach(function (key) {
    var bindString = "bind \"".concat(key, "\" \"");
    s[key].forEach(function (_ref) {
      var command = _ref.command,
          value = _ref.value;
      bindString = bindString.concat("".concat(command, " ").concat(value, ";"));
    });
    bindString = bindString.concat("\"\n");
    binds.push(bindString);
  });
  return binds;
};

ConfigState.getBind = function (bindCode) {
  return ConfigState.getState()[bindCode];
};

ConfigState.removeBindAll = function (bindCode) {
  var s = ConfigState.getState();
  delete s[bindCode];
  setState(s);
};

ConfigState.removeBind = function (bindCode, commandToRemove) {
  var s = ConfigState.getState();

  if (s[bindCode]) {
    var index = s[bindCode].findIndex(function (value) {
      return s[bindCode].command === commandToRemove.command;
    });

    if (index >= 0) {
      s[bindCode] = s[bindCode].splice(index, 1);
      setState(s);
    }
  } else {
    throw new Error("".concat(bindCode, " is not a valid bind code."));
  }
};

ConfigState.clear = function () {
  return setState({});
};
/**
 * 
 * @param {*} bindCode
 * @param {*} command on object {commandName, commandValue}
 * TODO make it update binds
 */


ConfigState.addBind = function (bindCode, command) {
  var s = ConfigState.getState();

  if (!s[bindCode]) {
    s[bindCode] = [];
  } // doesnt account for commands that already exist


  s[bindCode].push(command);
  setState(s);
};

ConfigState.swapBind = function (bindCode, oldOrder, newOrder) {
  var s = ConfigState.getState();
  if (!s[bindCode]) throw new Error("No bind ".concat(bindCode, "."));
  var binds = s[bindCode];
  var temp = binds[oldOrder];
  binds[oldOrder] = binds[newOrder];
  binds[newOrder] = temp;
  setState(s);
};

module.exports = ConfigState;
},{"local-storage":"node_modules/local-storage/local-storage.js","./IState":"state/IState.js"}],"state/ui.js":[function(require,module,exports) {
var ConfigState = require('./config');

var QueryState = require('./query');
/**
 * Basic UI Manager
 */


var UITargets = {
  Tray: document.getElementById('search-results'),
  InstructionBox: document.getElementById('instruction-box'),
  Keyboard: document.getElementById('keyboard'),
  CommandValueInput: document.getElementById('command-value-input')
};
var UIManagementTools = {};

UIManagementTools.closeTray = function () {
  UITargets.Tray.classList.add('hidden');
  UITargets.CommandValueInput.classList.add('hidden');
  UITargets.Tray.blur();
  UITargets.CommandValueInput.blur();
};

UIManagementTools.openTray = function () {
  return UITargets.Tray.classList.remove('hidden');
};

UIManagementTools.submitSearch = function () {
  return document.getElementById('main-submit').click();
};

UIManagementTools.warnToast = function (instruction) {
  UITargets.InstructionBox.classList.remove('hint');
  UITargets.InstructionBox.classList.add('warm');
  UITargets.InstructionBox.innerHTML = instruction;
};

UIManagementTools.hintToast = function (instruction) {
  UITargets.InstructionBox.classList.remove('warn');
  UITargets.InstructionBox.classList.add('hint');
  UITargets.InstructionBox.innerHTML = instruction;
};

UIManagementTools.flashToast = function (message) {
  var oldMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : UITargets.InstructionBox.innerHTML;
  UITargets.InstructionBox.textContent = message;
  setTimeout(function () {
    UITargets.InstructionBox.textContent = oldMessage;
  }, 600);
};

UIManagementTools.refreshBindCounter = function (bind) {
  var binds = ConfigState.getBind(bind);

  if (binds) {
    var bindCount = binds.length;
    var selector = ".key[data-bindcode=\"".concat(bind, "\"]");
    var keyElement = document.querySelector(selector);
    keyElement.setAttribute('data-bindcount', bindCount);
  }
};

UIManagementTools.clearBindCounters = function () {
  var keys = UITargets.Keyboard.children;

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    key.removeAttribute('data-bindcount');
  }
};
/**
 * 
 * @param {*} results an array of results
 * @param {*} effect a side effect to call on each result on creation. Useful for modifying results against some criteria.
 */


UIManagementTools.refreshSearchResults = function (results) {
  var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (result) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement('option');
  };
  var resultsContainer = UITargets.Tray;
  resultsContainer.innerHTML = '';

  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    var option = document.createElement('option');
    option.value = result;
    option.name = result;
    option.innerHTML = result;
    effect(results[i], option); //if (BoundCommandSet.size > 0 && BoundCommandSet.has(results[i])) option.classList.add('bound');

    resultsContainer.appendChild(option);
  }

  var pageSize = results.length < 10 ? results.length : 10;
  resultsContainer.setAttribute('size', pageSize);
};

module.exports = UIManagementTools;
},{"./config":"state/config.js","./query":"state/query.js"}],"components/Key.js":[function(require,module,exports) {
var keyNames = require("../constants/keyNames");

var UIManagementTools = require("../state/ui");
/**
 * Generates a key element.
 * @param {*} keyString the key to be displayed on the key.
 */


var Key = function Key(bindCode) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var key = document.createElement('button');
  key.type = 'submit';
  var keyName = keyNames[bindCode];

  if (/!.+/.test(bindCode)) {
    key.innerHTML = bindCode.slice(1);
    key.value = bindCode;
    key.setAttribute('data-bindcode', 'unbindable');
  } else {
    var bindCodes = bindCode.split(/~/);
    key.innerHTML = keyName;
    key.value = bindCode;
    key.setAttribute('data-bindcode', bindCodes[0]);

    if (bindCodes[1]) {
      key.setAttribute('data-bindcode2', bindCodes[1]);
    }
  }

  key.classList.add('key');
  parent.appendChild(key);
  UIManagementTools.refreshBindCounter(bindCode);
  return key;
};

module.exports = Key;
},{"../constants/keyNames":"constants/keyNames.js","../state/ui":"state/ui.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"components/Keyboard.js":[function(require,module,exports) {
var QueryState = require('../state/query');

var Key = require('./Key');

var fs = require('fs');

var ConfigState = require('../state/config');

var UIManagementTools = require('../state/ui');
/**
 * Creates a DOMElement that represents a keyboard.
 * @param {*} layout QWERTY
 */


var Keyboard = function Keyboard(layout) {
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement('form');
  element.classList.add('keyboard');

  for (var i = 0; i < layout.length; i++) {
    Key(layout[i], element);
  }

  element.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var keyElement = event.submitter;

    if (keyElement.value === '!💾') {
      var blobParts = ConfigState.export();
      blobParts.unshift('// Config Courtesy of "Easy Config", a CSGO Config Generator by @sam.sog 🥳\n');
      var file = new Blob(blobParts, {
        endings: 'native'
      });
      var a = document.createElement('a');
      a.download = 'config.cfg';
      a.href = URL.createObjectURL(file);
      a.click();
      return;
    } else if (keyElement.value === '!❌') {
      UIManagementTools.clearBindCounters();
      UIManagementTools.warnToast('Config Cleared!');
      UIManagementTools.closeTray();
      ConfigState.clear();
    }

    var searchInput = document.getElementById('main-search');

    if (document.activeElement !== searchInput) {
      var bindCode = keyElement.getAttribute('data-bindcode');
      var currentKeyDisplay = document.getElementById('current-key');
      QueryState.setQuery(bindCode);

      if (bindCode !== 'unbindable') {
        searchInput.focus();
        currentKeyDisplay.innerHTML = bindCode;
        currentKeyDisplay.classList.remove('hidden');
        UIManagementTools.hintToast('Select a command from the drop down menu.');
      } else {
        currentKeyDisplay.classList.add('hidden');
      }
    }
    /**
     * Perform click animation.
     */


    keyElement.classList.add('clicked');
    setTimeout(function () {
      return keyElement.classList.remove('clicked');
    }, 300);
  });
  return element;
};

module.exports = Keyboard;
},{"../state/query":"state/query.js","./Key":"components/Key.js","fs":"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js","../state/config":"state/config.js","../state/ui":"state/ui.js"}],"utils/keyToBind.js":[function(require,module,exports) {
var keyNames = require("../constants/keyNames");
/**
 * 
 * @param {*} code event.code
 */


var keyToBind = function keyToBind(code) {
  var normalisedCode = code.toLowerCase(); // code represents event.code. these binds have to be converted before they can be used.

  if (/^altleft$/.test(normalisedCode)) return 'alt';
  if (/^altright$/.test(normalisedCode)) return 'ralt';
  if (/^bracketleft$/.test(normalisedCode)) return '[';
  if (/^bracketright$/.test(normalisedCode)) return ']';
  if (/^comma$/.test(normalisedCode)) return ',';
  if (/^controlleft$/.test(normalisedCode)) return 'ctrl';
  if (/^controlright$/.test(normalisedCode)) return 'rctrl';
  if (/^digit[0-9]{1}$/.test(normalisedCode)) return normalisedCode.substring(5);
  if (/^equal$/.test(normalisedCode)) return 'kp_plus';
  if (/^intlbackslash$/.test(normalisedCode)) return '\\\\';
  if (/^key[A-Za-z]{1}$/.test(normalisedCode)) return normalisedCode.substring(3);
  if (/^minus$/.test(normalisedCode)) return 'kp_minus';
  if (/^period$/.test(normalisedCode)) return '.';
  if (/^quote$/.test(normalisedCode)) return '\'';
  if (/^semicolon$/.test(normalisedCode)) return ';';
  if (/^shiftleft$/.test(normalisedCode)) return 'shift';
  if (/^shiftright$/.test(normalisedCode)) return 'rshift';
  if (/^slash$/.test(normalisedCode)) return '/'; // now we catch all the cases that don't need explicit conversion

  if (keyNames[normalisedCode]) return normalisedCode;else {
    throw new Error("".concat(code, " is not a bindable key"));
  }
};

module.exports = keyToBind;
},{"../constants/keyNames":"constants/keyNames.js"}],"constants/LAYOUTS.js":[function(require,module,exports) {
var layouts = {};
layouts.QWERTY = ["!❌", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "!💾", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "kp_minus", "kp_plus", "backspace", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "/", "capslock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter", "shift", "\\", "z", "x", "c", "v", "b", "n", "m", ",", ".", "rshift", "ctrl", "alt", "space", "ralt", "rctrl"];
Object.freeze(layouts);
module.exports = layouts;
},{}],"constants/commands.js":[function(require,module,exports) {
/**
 * The raw list of CSGO commands.
 */
module.exports = "[\"_autosave\",\"_autosavedangerous\",\"_bugreporter_restart\",\"_record\",\"_resetgamestats\",\"_restart\",\"addip\",\"adsp_reset_nodes\",\"ai_clear_bad_links\",\"ai_debug_node_connect\",\"ai_disable\",\"ai_drop_hint\",\"ai_dump_hints\",\"ai_hull\",\"ai_next_hull\",\"ai_nodes\",\"ai_resume\",\"ai_set_move_height_epsilon\",\"ai_setenabled\",\"ai_show_connect\",\"ai_show_connect_crawl\",\"ai_show_connect_fly\",\"ai_show_connect_jump\",\"ai_show_graph_connect\",\"ai_show_grid\",\"ai_show_hints\",\"ai_show_hull\",\"ai_show_node\",\"ai_show_visibility\",\"ai_step\",\"ai_test_los\",\"ainet_generate_report\",\"ainet_generate_report_only\",\"air_density\",\"alias\",\"'-alt1'\",\"'+alt1'\",\"'-alt2'\",\"'+alt2'\",\"apply_crosshair_code\",\"askconnect_accept\",\"asw_engine_finished_building_map\",\"async_resume\",\"async_suspend\",\"'+attack'\",\"'-attack'\",\"'-attack2'\",\"'+attack2'\",\"audit_save_in_memory\",\"autobuy\",\"autosave\",\"autosavedangerous\",\"autosavedangerousissafe\",\"'-back'\",\"'+back'\",\"banid\",\"banip\",\"bench_end\",\"bench_showstatsdialog\",\"bench_start\",\"bench_upload\",\"benchframe\",\"bind\",\"bind_osx\",\"BindToggle\",\"blackbox_record\",\"bot_add\",\"bot_add_ct\",\"bot_add_t\",\"bot_all_weapons\",\"bot_goto_mark\",\"bot_goto_selected\",\"bot_kick\",\"bot_kill\",\"bot_knives_only\",\"bot_pistols_only\",\"bot_place\",\"bot_snipers_only\",\"box\",\"'-break'\",\"'+break'\",\"buddha\",\"budget_toggle_group\",\"bug\",\"buildcubemaps\",\"buildmodelforworld\",\"buy_stamps\",\"buymenu\",\"buyrandom\",\"cache_print\",\"cache_print_lru\",\"cache_print_summary\",\"callvote\",\"cam_command\",\"'-camdistance'\",\"'+camdistance'\",\"'+camin'\",\"'-camin'\",\"'+cammousemove'\",\"'-cammousemove'\",\"'-camout'\",\"'+camout'\",\"'+campitchdown'\",\"'-campitchdown'\",\"'+campitchup'\",\"'-campitchup'\",\"'+camyawleft'\",\"'-camyawleft'\",\"'+camyawright'\",\"'-camyawright'\",\"cancelselect\",\"cast_hull\",\"cast_ray\",\"cc_emit\",\"cc_findsound\",\"cc_flush\",\"cc_random\",\"cc_showblocks\",\"centerview\",\"ch_createairboat\",\"ch_createjeep\",\"changelevel\",\"changelevel2\",\"cl_animationinfo\",\"cl_avatar_convert_png\",\"cl_avatar_convert_rgb\",\"cl_clearhinthistory\",\"cl_cs_dump_econ_item_stringtable\",\"cl_csm_server_status\",\"cl_csm_status\",\"cl_dump_particle_stats\",\"cl_dumpplayer\",\"cl_dumpsplithacks\",\"cl_ent_absbox\",\"cl_ent_bbox\",\"cl_ent_rbox\",\"cl_find_ent\",\"cl_find_ent_index\",\"cl_fullupdate\",\"cl_game_mode_convars\",\"cl_matchstats_print_own_data\",\"cl_modemanager_reload\",\"cl_panelanimation\",\"cl_particles_dump_effects\",\"cl_particles_dumplist\",\"cl_precacheinfo\",\"cl_pred_track\",\"cl_predictioncopy_describe\",\"cl_quest_events_print\",\"cl_quest_schedule_print\",\"cl_reload_hud\",\"cl_reloadpostprocessparams\",\"cl_remove_all_workshop_maps\",\"cl_removedecals\",\"cl_report_soundpatch\",\"'-cl_show_team_equipment'\",\"'+cl_show_team_equipment'\",\"cl_showents\",\"cl_sim_grenade_trajectory\",\"cl_sos_test_get_opvar\",\"cl_sos_test_set_opvar\",\"cl_soundemitter_flush\",\"cl_soundemitter_reload\",\"cl_soundscape_flush\",\"cl_soundscape_printdebuginfo\",\"cl_ss_origin\",\"cl_steamscreenshots\",\"cl_tree_sway_dir\",\"cl_updatevisibility\",\"cl_view\",\"clear\",\"clear_anim_cache\",\"clear_bombs\",\"clear_debug_overlays\",\"clutch_mode_toggle\",\"cmd\",\"cmd1\",\"cmd2\",\"cmd3\",\"cmd4\",\"collision_test\",\"colorcorrectionui\",\"'+commandermousemove'\",\"'-commandermousemove'\",\"commentary_cvarsnotchanging\",\"commentary_finishnode\",\"commentary_showmodelviewer\",\"commentary_testfirstrun\",\"con_min_severity\",\"condump\",\"connect\",\"crash\",\"create_flashlight\",\"CreatePredictionError\",\"creditsdone\",\"cs_make_vip\",\"csgo_download_match\",\"'+csm_rot_x_neg'\",\"'-csm_rot_x_neg'\",\"'+csm_rot_x_plus'\",\"'-csm_rot_x_plus'\",\"'+csm_rot_y_neg'\",\"'-csm_rot_y_neg'\",\"'+csm_rot_y_plus'\",\"'-csm_rot_y_plus'\",\"cvarlist\",\"dbghist_addline\",\"dbghist_dump\",\"debug_drawbox\",\"debug_drawdisp_boundbox\",\"debug_purchase_defidx\",\"demo_goto\",\"demo_gototick\",\"demo_info\",\"demo_listhighlights\",\"demo_listimportantticks\",\"demo_pause\",\"demo_resume\",\"demo_timescale\",\"demo_togglepause\",\"demolist\",\"demos\",\"demoui\",\"devshots_nextmap\",\"devshots_screenshot\",\"differences\",\"disconnect\",\"disp_list_all_collideable\",\"display_elapsedtime\",\"dlight_debug\",\"dm_reset_spawns\",\"dm_togglerandomweapons\",\"drawcross\",\"drawline\",\"drawoverviewmap\",\"drawradar\",\"ds_get_newest_subscribed_files\",\"dsp_reload\",\"dti_flush\",\"'+duck'\",\"'-duck'\",\"dump_entity_sizes\",\"dump_globals\",\"dump_panorama_css_properties\",\"dump_panorama_css_properties_memstats\",\"dump_panorama_events\",\"dump_panorama_js_scopes\",\"dump_panorama_render_command_stats\",\"dump_particlemanifest\",\"dumpentityfactories\",\"dumpeventqueue\",\"dumpgamestringtable\",\"dumpstringtables\",\"dz_clearteams\",\"dz_jointeam\",\"dz_shuffle_teams\",\"dz_spawnselect_choose_hex\",\"echo\",\"econ_build_pinboard_images_from_collection_name\",\"econ_clear_inventory_images\",\"econ_show_items_with_tag\",\"editdemo\",\"editor_toggle\",\"endmatch_votenextmap\",\"endmovie\",\"endround\",\"ent_absbox\",\"ent_attachments\",\"ent_autoaim\",\"ent_bbox\",\"ent_cancelpendingentfires\",\"ent_create\",\"ent_dump\",\"ent_fire\",\"ent_info\",\"ent_keyvalue\",\"ent_list_report\",\"ent_messages\",\"ent_name\",\"ent_orient\",\"ent_pause\",\"ent_pivot\",\"ent_rbox\",\"ent_remove\",\"ent_remove_all\",\"ent_rotate\",\"ent_script_dump\",\"ent_setang\",\"ent_setname\",\"ent_setpos\",\"ent_show_response_criteria\",\"ent_step\",\"ent_teleport\",\"ent_text\",\"ent_viewoffset\",\"envmap\",\"escape\",\"exec\",\"execifexists\",\"execwithwhitelist\",\"exit\",\"exojump\",\"explode\",\"explodevector\",\"fadein\",\"fadeout\",\"find\",\"find_ent\",\"find_ent_index\",\"findflags\",\"firetarget\",\"firstperson\",\"flush\",\"flush_locked\",\"fogui\",\"force_centerview\",\"forcebind\",\"'-forward'\",\"'+forward'\",\"foundry_engine_get_mouse_control\",\"foundry_engine_release_mouse_control\",\"foundry_select_entity\",\"foundry_sync_hammer_view\",\"foundry_update_entity\",\"fs_clear_open_duplicate_times\",\"fs_dump_open_duplicate_times\",\"fs_fios_cancel_prefetches\",\"fs_fios_flush_cache\",\"fs_fios_prefetch_file\",\"fs_fios_prefetch_file_in_pack\",\"fs_fios_print_prefetches\",\"fs_printopenfiles\",\"fs_syncdvddevcache\",\"fs_warning_level\",\"g15_dumpplayer\",\"g15_reload\",\"gameinstructor_dump_open_lessons\",\"gameinstructor_reload_lessons\",\"gameinstructor_reset_counts\",\"gamemenucommand\",\"gamepadslot1\",\"gamepadslot2\",\"gamepadslot3\",\"gamepadslot4\",\"gamepadslot5\",\"gamepadslot6\",\"gameui_activate\",\"gameui_allowescape\",\"gameui_allowescapetoshow\",\"gameui_hide\",\"gameui_preventescape\",\"gameui_preventescapetoshow\",\"getpos\",\"getpos_exact\",\"give\",\"givecurrentammo\",\"global_set\",\"god\",\"gods\",\"'-graph'\",\"'+graph'\",\"'-grenade1'\",\"'+grenade1'\",\"'-grenade2'\",\"'+grenade2'\",\"groundlist\",\"hammer_update_entity\",\"hammer_update_safe_entities\",\"heartbeat\",\"help\",\"hideconsole\",\"hideoverviewmap\",\"hidepanel\",\"hideradar\",\"hidescores\",\"hltv_replay_status\",\"host_filtered_time_report\",\"host_reset_config\",\"host_runofftime\",\"host_timer_report\",\"host_workshop_collection\",\"host_workshop_map\",\"host_writeconfig\",\"host_writeconfig_ss\",\"hud_reloadscheme\",\"hud_subtitles\",\"hurtme\",\"ime_hkl_info\",\"ime_info\",\"ime_supported_info\",\"impulse\",\"incrementvar\",\"invnext\",\"invnextgrenade\",\"invnextitem\",\"invnextnongrenade\",\"invprev\",\"ipc_console_disable\",\"ipc_console_disable_all\",\"ipc_console_enable\",\"ipc_console_show\",\"itemtimedata_dump_active\",\"itemtimedata_dump_total\",\"itemtimedata_print_and_reset\",\"'+jlook'\",\"'-jlook'\",\"joyadvancedupdate\",\"jpeg\",\"'-jump'\",\"'+jump'\",\"kdtree_test\",\"key_findbinding\",\"key_listboundkeys\",\"key_updatelayout\",\"kick\",\"kickid\",\"kickid_ex\",\"kill\",\"killserver\",\"killvector\",\"'-klook'\",\"'+klook'\",\"lastinv\",\"launch_warmup_map\",\"'-left'\",\"'+left'\",\"light_crosshair\",\"lightprobe\",\"linefile\",\"listdemo\",\"listid\",\"listip\",\"listissues\",\"listmodels\",\"listRecentNPCSpeech\",\"load\",\"loadcommentary\",\"loader_dump_table\",\"localization_quest_item_string_printout\",\"log\",\"log_color\",\"log_dumpchannels\",\"log_flags\",\"log_level\",\"logaddress_add\",\"logaddress_add_ex\",\"logaddress_add_http\",\"logaddress_add_http_delayed\",\"logaddress_add_ts\",\"logaddress_del\",\"logaddress_delall\",\"logaddress_delall_http\",\"logaddress_list\",\"logaddress_list_http\",\"'-lookdown'\",\"'+lookdown'\",\"'-lookspin'\",\"'+lookspin'\",\"'+lookup'\",\"'-lookup'\",\"map\",\"map_background\",\"map_commentary\",\"map_edit\",\"map_setbombradius\",\"map_showbombradius\",\"map_showspawnpoints\",\"mapgroup\",\"maps\",\"mat_configcurrent\",\"mat_crosshair\",\"mat_crosshair_edit\",\"mat_crosshair_explorer\",\"mat_crosshair_printmaterial\",\"mat_crosshair_reloadmaterial\",\"mat_custommaterialusage\",\"mat_edit\",\"mat_hdr_enabled\",\"mat_info\",\"mat_reloadallcustommaterials\",\"mat_reloadallmaterials\",\"mat_reloadmaterial\",\"mat_reloadtextures\",\"mat_rendered_faces_spew\",\"mat_reporthwmorphmemory\",\"mat_savechanges\",\"mat_setvideomode\",\"mat_shadercount\",\"mat_showmaterials\",\"mat_showmaterialsverbose\",\"mat_showtextures\",\"mat_spewvertexandpixelshaders\",\"'+mat_texture_list'\",\"'-mat_texture_list'\",\"mat_texture_list_exclude\",\"mat_texture_list_txlod\",\"mat_texture_list_txlod_sync\",\"mat_updateconvars\",\"maxplayers\",\"mdlcache_dump_dictionary_state\",\"mem_compact\",\"mem_dump\",\"mem_dumpvballocs\",\"mem_eat\",\"mem_incremental_compact\",\"mem_test\",\"mem_vcollide\",\"mem_verify\",\"memory\",\"menuselect\",\"minisave\",\"mm_datacenter_debugprint\",\"mm_debugprint\",\"mm_dlc_debugprint\",\"mm_queue_show_stats\",\"mod_combiner_info\",\"mod_DumpWeaponWiewModelCache\",\"mod_DumpWeaponWorldModelCache\",\"'+movedown'\",\"'-movedown'\",\"'+moveleft'\",\"'-moveleft'\",\"'+moveright'\",\"'-moveright'\",\"'+moveup'\",\"'-moveup'\",\"movie_fixwave\",\"mp_backup_restore_list_files\",\"mp_backup_restore_load_file\",\"mp_bot_ai_bt_clear_cache\",\"mp_debug_timeouts\",\"mp_disable_autokick\",\"mp_dump_timers\",\"mp_forcerespawnplayers\",\"mp_forcewin\",\"mp_guardian_add_bounds_pt\",\"mp_guardian_clear_all_bounds\",\"mp_guardian_emit_bounds_config\",\"mp_guardian_new_bounds\",\"mp_guardian_shoot_point\",\"mp_pause_match\",\"mp_scrambleteams\",\"mp_swapteams\",\"mp_switchteams\",\"mp_tournament_restart\",\"mp_unpause_match\",\"mp_warmup_end\",\"mp_warmup_start\",\"ms_player_dump_properties\",\"multvar\",\"nav_add_to_selected_set\",\"nav_add_to_selected_set_by_id\",\"nav_analyze\",\"nav_avoid\",\"nav_begin_area\",\"nav_begin_deselecting\",\"nav_begin_drag_deselecting\",\"nav_begin_drag_selecting\",\"nav_begin_selecting\",\"nav_begin_shift_xy\",\"nav_build_ladder\",\"nav_check_connectivity\",\"nav_check_file_consistency\",\"nav_check_floor\",\"nav_check_stairs\",\"nav_chop_selected\",\"nav_clear_attribute\",\"nav_clear_selected_set\",\"nav_clear_walkable_marks\",\"nav_compress_id\",\"nav_connect\",\"nav_corner_lower\",\"nav_corner_place_on_ground\",\"nav_corner_raise\",\"nav_corner_select\",\"nav_crouch\",\"nav_delete\",\"nav_delete_marked\",\"nav_disconnect\",\"nav_dont_hide\",\"nav_end_area\",\"nav_end_deselecting\",\"nav_end_drag_deselecting\",\"nav_end_drag_selecting\",\"nav_end_selecting\",\"nav_end_shift_xy\",\"nav_flood_select\",\"nav_gen_cliffs_approx\",\"nav_generate\",\"nav_generate_incremental\",\"nav_jump\",\"nav_ladder_flip\",\"nav_load\",\"nav_lower_drag_volume_max\",\"nav_lower_drag_volume_min\",\"nav_make_sniper_spots\",\"nav_mark\",\"nav_mark_attribute\",\"nav_mark_unnamed\",\"nav_mark_walkable\",\"nav_merge\",\"nav_merge_mesh\",\"nav_no_hostages\",\"nav_no_jump\",\"nav_place_floodfill\",\"nav_place_list\",\"nav_place_pick\",\"nav_place_replace\",\"nav_place_set\",\"nav_precise\",\"nav_raise_drag_volume_max\",\"nav_raise_drag_volume_min\",\"nav_recall_selected_set\",\"nav_remove_from_selected_set\",\"nav_remove_jump_areas\",\"nav_run\",\"nav_save\",\"nav_save_selected\",\"nav_select_blocked_areas\",\"nav_select_damaging_areas\",\"nav_select_half_space\",\"nav_select_invalid_areas\",\"nav_select_obstructed_areas\",\"nav_select_overlapping\",\"nav_select_radius\",\"nav_select_stairs\",\"nav_set_place_mode\",\"nav_shift\",\"nav_simplify_selected\",\"nav_splice\",\"nav_split\",\"nav_stand\",\"nav_stop\",\"nav_store_selected_set\",\"nav_strip\",\"nav_subdivide\",\"nav_test_stairs\",\"nav_toggle_deselecting\",\"nav_toggle_in_selected_set\",\"nav_toggle_place_mode\",\"nav_toggle_place_painting\",\"nav_toggle_selected_set\",\"nav_toggle_selecting\",\"nav_transient\",\"nav_unmark\",\"nav_update_blocked\",\"nav_update_lighting\",\"nav_use_place\",\"nav_walk\",\"nav_warp_to_mark\",\"nav_world_center\",\"net_channels\",\"net_connections_stats\",\"net_dumpeventstats\",\"net_start\",\"net_status\",\"net_steamcnx_status\",\"nextdemo\",\"noclip\",\"notarget\",\"npc_ammo_deplete\",\"npc_bipass\",\"npc_combat\",\"npc_conditions\",\"npc_create\",\"npc_create_aimed\",\"npc_destroy\",\"npc_destroy_unselected\",\"npc_enemies\",\"npc_focus\",\"npc_freeze\",\"npc_freeze_unselected\",\"npc_go\",\"npc_go_random\",\"npc_heal\",\"npc_kill\",\"npc_nearest\",\"npc_relationships\",\"npc_reset\",\"npc_route\",\"npc_select\",\"npc_set_freeze\",\"npc_set_freeze_unselected\",\"npc_squads\",\"npc_steering\",\"npc_steering_all\",\"npc_task_text\",\"npc_tasks\",\"npc_teleport\",\"npc_thinknow\",\"npc_viewcone\",\"observer_use\",\"occlusion_stats\",\"parachute\",\"particle_test_start\",\"particle_test_stop\",\"path\",\"pause\",\"perfui\",\"perfvisualbenchmark\",\"perfvisualbenchmark_abort\",\"physics_budget\",\"physics_constraints\",\"physics_debug_entity\",\"physics_highlight_active\",\"physics_report_active\",\"physics_select\",\"pick_hint\",\"picker\",\"ping\",\"pixelvis_debug\",\"play\",\"play_hrtf\",\"playcast\",\"playdemo\",\"player_ping\",\"playflush\",\"playgamesound\",\"playsoundscape\",\"playvideo\",\"playvideo_end_level_transition\",\"playvideo_exitcommand\",\"playvideo_exitcommand_nointerrupt\",\"playvideo_nointerrupt\",\"playvol\",\"plugin_load\",\"plugin_pause\",\"plugin_pause_all\",\"plugin_print\",\"plugin_unload\",\"plugin_unpause\",\"plugin_unpause_all\",\"press_x360_button\",\"print_colorcorrection\",\"print_mapgroup\",\"print_mapgroup_sv\",\"progress_enable\",\"prop_crosshair\",\"prop_debug\",\"prop_dynamic_create\",\"prop_physics_create\",\"'-quickinv'\",\"'+quickinv'\",\"quit\",\"quit_prompt\",\"r_cheapwaterend\",\"r_cheapwaterstart\",\"r_cleardecals\",\"r_flushlod\",\"r_lightcache_invalidate\",\"r_printdecalinfo\",\"r_ropes_holiday_light_color\",\"r_screenoverlay\",\"r_shadowangles\",\"r_shadowblobbycutoff\",\"r_shadowcolor\",\"r_shadowdir\",\"r_shadowdist\",\"radio\",\"radio1\",\"radio2\",\"radio3\",\"rangefinder\",\"rcon\",\"rebuy\",\"recompute_speed\",\"record\",\"reload\",\"'+reload'\",\"'-reload'\",\"reload_store_config\",\"reload_vjobs\",\"removeallids\",\"removeid\",\"removeip\",\"render_blanks\",\"replay_death\",\"replay_start\",\"replay_stop\",\"report_entities\",\"report_simthinklist\",\"report_soundpatch\",\"report_touchlinks\",\"reset_expo\",\"reset_gameconvars\",\"respawn_entities\",\"restart\",\"retry\",\"'+right'\",\"'-right'\",\"rr_forceconcept\",\"rr_reloadresponsesystems\",\"save\",\"save_finish_async\",\"say\",\"say_team\",\"scandemo\",\"scene_flush\",\"scene_playvcd\",\"'+score'\",\"'-score'\",\"screenshot\",\"script\",\"script_client\",\"script_debug\",\"script_debug_client\",\"script_dump_all\",\"script_dump_all_client\",\"script_execute\",\"script_execute_client\",\"script_help\",\"script_help_client\",\"script_reload_code\",\"script_reload_entity_code\",\"script_reload_think\",\"server_game_time\",\"setang\",\"setang_exact\",\"setinfo\",\"setmodel\",\"setpause\",\"setpos\",\"setpos_exact\",\"setpos_player\",\"shake\",\"shake_stop\",\"shake_testpunch\",\"show_loadout_toggle\",\"'+showbudget'\",\"'-showbudget'\",\"'-showbudget_texture'\",\"'+showbudget_texture'\",\"'-showbudget_texture_global'\",\"'+showbudget_texture_global'\",\"showbudget_texture_global_dumpstats\",\"showconsole\",\"showinfo\",\"showpanel\",\"'-showscores'\",\"'+showscores'\",\"showtriggers_toggle\",\"'-showvprof'\",\"'+showvprof'\",\"skip_next_map\",\"slot0\",\"slot1\",\"slot10\",\"slot11\",\"slot12\",\"slot13\",\"slot2\",\"slot3\",\"slot4\",\"slot5\",\"slot6\",\"slot7\",\"slot8\",\"slot9\",\"snapto\",\"snd_async_flush\",\"snd_async_showmem\",\"snd_async_showmem_music\",\"snd_async_showmem_summary\",\"snd_dump_filepaths\",\"snd_dumpclientsounds\",\"snd_front_headphone_position\",\"snd_front_stereo_speaker_position\",\"snd_front_surround_speaker_position\",\"snd_getmixer\",\"snd_headphone_pan_exponent\",\"snd_headphone_pan_radial_weight\",\"snd_playsounds\",\"snd_print_channel_by_guid\",\"snd_print_channel_by_index\",\"snd_print_channels\",\"snd_print_dsp_effect\",\"snd_rear_headphone_position\",\"snd_rear_stereo_speaker_position\",\"snd_rear_surround_speaker_position\",\"snd_restart\",\"snd_set_master_volume\",\"snd_setmixer\",\"snd_setmixlayer\",\"snd_setmixlayer_amount\",\"snd_sos_flush_operators\",\"snd_sos_print_operators\",\"snd_soundmixer_flush\",\"snd_soundmixer_list_mix_groups\",\"snd_soundmixer_list_mix_layers\",\"snd_soundmixer_list_mixers\",\"snd_soundmixer_set_trigger_factor\",\"snd_stereo_speaker_pan_exponent\",\"snd_stereo_speaker_pan_radial_weight\",\"snd_surround_speaker_pan_exponent\",\"snd_surround_speaker_pan_radial_weight\",\"snd_writemanifest\",\"sndplaydelay\",\"sound_device_list\",\"soundfade\",\"soundinfo\",\"soundlist\",\"soundscape_dumpclient\",\"soundscape_flush\",\"speak\",\"spec_cameraman_set_xray\",\"spec_goto\",\"spec_gui\",\"spec_lerpto\",\"spec_menu\",\"spec_mode\",\"spec_next\",\"spec_player\",\"spec_player_by_accountid\",\"spec_player_by_name\",\"spec_pos\",\"spec_prev\",\"'+speed'\",\"'-speed'\",\"spike\",\"spincycle\",\"'+spray_menu'\",\"'-spray_menu'\",\"ss_map\",\"ss_reloadletterbox\",\"star_memory\",\"startdemos\",\"startmovie\",\"startupmenu\",\"stats\",\"status\",\"steam_controller_status\",\"stop\",\"stop_transition_videos_fadeout\",\"stopdemo\",\"stopsound\",\"stopsoundscape\",\"stopvideos\",\"stopvideos_fadeout\",\"'+strafe'\",\"'-strafe'\",\"stringtabledictionary\",\"stuffcmds\",\"surfaceprop\",\"survival_check_num_possible_final_zone\",\"sv_benchmark_force_start\",\"sv_clearhinthistory\",\"sv_cs_dump_econ_item_stringtable\",\"sv_dump_class_info\",\"sv_dump_class_table\",\"sv_dump_serialized_entities_mem\",\"sv_dz_paradrop\",\"sv_dz_reset_danger_zone\",\"sv_game_mode_convars\",\"sv_getinfo\",\"sv_load_forced_client_names_file\",\"sv_load_random_client_names_file\",\"sv_precacheinfo\",\"sv_pure\",\"sv_pure_checkvpk\",\"sv_pure_finduserfiles\",\"sv_pure_listfiles\",\"sv_pure_listuserfiles\",\"sv_querycache_stats\",\"sv_rethrow_last_grenade\",\"sv_send_stats\",\"sv_setsteamaccount\",\"sv_showtags\",\"sv_shutdown\",\"sv_soundemitter_reload\",\"sv_soundscape_printdebuginfo\",\"teammenu\",\"test_dispatcheffect\",\"Test_EHandle\",\"test_entity_blocker\",\"test_freezeframe\",\"Test_InitRandomEntitySpawner\",\"test_js_proto\",\"Test_Loop\",\"Test_LoopCount\",\"Test_LoopForNumSeconds\",\"test_outtro_stats\",\"Test_ProxyToggle_EnableProxy\",\"Test_ProxyToggle_EnsureValue\",\"Test_ProxyToggle_SetValue\",\"Test_RandomChance\",\"Test_RandomizeInPVS\",\"Test_RemoveAllRandomEntities\",\"Test_RunFrame\",\"Test_SendKey\",\"Test_SpawnRandomEntities\",\"Test_StartLoop\",\"Test_StartScript\",\"Test_Wait\",\"Test_WaitForCheckPoint\",\"testhudanim\",\"thirdperson\",\"thirdperson_mayamode\",\"thread_test_tslist\",\"thread_test_tsqueue\",\"threadpool_cycle_reserve\",\"threadpool_run_tests\",\"timedemo\",\"timedemo_vprofrecord\",\"timedemoquit\",\"timeleft\",\"timeout_ct_start\",\"timeout_terrorist_start\",\"timerefresh\",\"toggle\",\"toggle_duck\",\"toggleconsole\",\"toggleLmapPath\",\"togglescores\",\"toggleShadowPath\",\"toggleUnlitPath\",\"toggleVtxLitPath\",\"toolload\",\"toolunload\",\"traceattack\",\"tv_broadcast_resend\",\"tv_broadcast_status\",\"tv_clients\",\"tv_mem\",\"tv_msg\",\"tv_record\",\"tv_relay\",\"tv_retry\",\"tv_status\",\"tv_stop\",\"tv_stoprecord\",\"tv_time_remaining\",\"tweak_ammo_impulses\",\"ui_reloadscheme\",\"unbind\",\"unbindall\",\"unbindalljoystick\",\"unbindallmousekeyboard\",\"unpause\",\"use\",\"'-use'\",\"'+use'\",\"user\",\"users\",\"vehicle_flushscript\",\"version\",\"'-vgui_drawtree'\",\"'+vgui_drawtree'\",\"vgui_drawtree_clear\",\"vgui_dump_panels\",\"vgui_spew_fonts\",\"vgui_togglepanel\",\"viewanim_addkeyframe\",\"viewanim_create\",\"viewanim_load\",\"viewanim_reset\",\"viewanim_save\",\"viewanim_test\",\"voice_enable_toggle\",\"voice_mute\",\"voice_player_volume\",\"voice_reset_mutelist\",\"voice_show_mute\",\"voice_unmute\",\"'-voicerecord'\",\"'+voicerecord'\",\"voicerecord_toggle\",\"vox_reload\",\"voxeltree_box\",\"voxeltree_playerview\",\"voxeltree_sphere\",\"voxeltree_view\",\"vphys_sleep_timeout\",\"vprof\",\"vprof_adddebuggroup1\",\"vprof_cachemiss\",\"vprof_cachemiss_off\",\"vprof_cachemiss_on\",\"vprof_child\",\"vprof_collapse_all\",\"vprof_dump_counters\",\"vprof_dump_groupnames\",\"vprof_expand_all\",\"vprof_expand_group\",\"vprof_generate_report\",\"vprof_generate_report_AI\",\"vprof_generate_report_AI_only\",\"vprof_generate_report_budget\",\"vprof_generate_report_hierarchy\",\"vprof_generate_report_hierarchy_per_frame_and_count_only\",\"vprof_generate_report_map_load\",\"vprof_nextsibling\",\"vprof_off\",\"vprof_on\",\"vprof_parent\",\"vprof_playback_average\",\"vprof_playback_start\",\"vprof_playback_step\",\"vprof_playback_stepback\",\"vprof_playback_stop\",\"vprof_prevsibling\",\"vprof_record_start\",\"vprof_record_stop\",\"vprof_remote_start\",\"vprof_remote_stop\",\"vprof_reset\",\"vprof_reset_peaks\",\"vprof_to_csv\",\"vprof_vtune_group\",\"vtune\",\"vx_model_list\",\"'+walk'\",\"'-walk'\",\"wc_air_edit_further\",\"wc_air_edit_nearer\",\"wc_air_node_edit\",\"wc_create\",\"wc_destroy\",\"wc_destroy_undo\",\"wc_link_edit\",\"whitelistcmd\",\"wipe_nav_attributes\",\"workshop_publish\",\"workshop_start_map\",\"workshop_workbench\",\"writeid\",\"writeip\",\"xload\",\"xlook\",\"xmove\",\"xsave\",\"'-zoom'\",\"'+zoom'\",\"'-zoom_in'\",\"'+zoom_in'\",\"'-zoom_out'\",\"'+zoom_out'\"]";
},{}],"utils/command-search.js":[function(require,module,exports) {
var rawCovars = require('../constants/commands');

var commands = JSON.parse(rawCovars);
/**
 * Search convars
 * @param {*} term 
 */

var search = function search(term) {
  var regex = new RegExp(term);
  return commands.filter(function (command) {
    return regex.test(command);
  });
};

module.exports = search;
},{"../constants/commands":"constants/commands.js"}],"utils/getKey.js":[function(require,module,exports) {
/**
 * Returns the DOMElement representing this bind code.
 */
var getKey = function getKey(bindCode) {
  var selector = ".key[data-bindcode=\"".concat(bindCode, "\"]");
  return document.querySelector(selector);
};

module.exports = {
  getKey: getKey
};
},{}],"index.js":[function(require,module,exports) {
var Keyboard = require('./components/Keyboard.js');

var keyToBind = require('./utils/keyToBind.js');

var layouts = require('./constants/LAYOUTS.js');

var search = require('./utils/command-search');

var QueryState = require('./state/query');

var ConfigState = require('./state/config.js');

var UIManagementTools = require('./state/ui.js');

var _require = require('./utils/getKey.js'),
    getKey = _require.getKey;

document.body.onload = function (event) {
  // Generate keyboard
  Keyboard(layouts.QWERTY, document.getElementById('keyboard')); // Listen for key inputs

  document.body.addEventListener('keydown', function (_ref) {
    var code = _ref.code;
    var focusedElement = document.activeElement;

    if (focusedElement.id !== 'command-value-input') {
      var bindCode;

      try {
        bindCode = keyToBind(code);
        var keyElement = getKey(bindCode);
        keyElement.click();
      } catch (err) {
        throw err;
      }
    }
  });
  var resultsContainer = document.getElementById('search-results');
  resultsContainer.addEventListener('click', function (event) {
    document.getElementById('command-value-input').classList.remove('hidden');
    document.getElementById('command-value-input').focus();
  }); // When People Click a Search Result

  var resultsForm = document.getElementById('search-form');
  resultsForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var bindCode = QueryState.getState();
    var formData = new FormData(event.target);
    var command = formData.get('result');
    var value = formData.get('value');

    if (bindCode !== "unbindable") {
      ConfigState.addBind(bindCode, {
        command: command,
        value: value
      });
      UIManagementTools.refreshBindCounter(bindCode);
      UIManagementTools.flashToast("".concat(command, " Has been bound to ").concat(bindCode));
      UIManagementTools.closeTray();
    }
  });
  /**
   * Event Handler for Search Activity.
   * @param {*} event 
   * @returns 
   */

  var searchHandle = function searchHandle(event) {
    var query = new FormData(resultsForm).get('search');
    var results = search(query);
    var q = QueryState.getState(); // The idea is to track what commands have already been bound, so that we can highlight these binds in the menu later.

    var BoundCommandSet = new Set();
    var binds = ConfigState.getBind(q);

    if (binds) {
      results.sort(function (a, b) {
        var aBindExists = binds.some(function (value) {
          return value.command === a;
        }); //.some(key => binds[key].command === a);

        var bBindExists = binds.some(function (value) {
          return value.command === b;
        });
        if (aBindExists) BoundCommandSet.add(a);
        if (bBindExists) BoundCommandSet.add(b);
        if (aBindExists && bBindExists) return a.localeCompare(b);else if (aBindExists) return -1;else if (bBindExists) return 1;else return 0;
      });
    }

    UIManagementTools.refreshSearchResults(results, function (result, element) {
      if (BoundCommandSet.has(result)) element.classList.add('bound');
    });

    if (results.length === 0) {
      UIManagementTools.closeTray();
    } else {
      UIManagementTools.openTray();
    }

    return false;
  };

  var searchInput = document.getElementById('main-search');
  var valueInput = document.getElementById('command-value-input');
  searchInput.addEventListener('input', searchHandle);
  searchInput.addEventListener('focusin', searchHandle);
  searchInput.addEventListener('focusout', function (event) {
    if (event.explicitOriginalTarget === body) {
      UIManagementTools.closeTray();
    }

    UIManagementTools.hintToast("Hit any key on your keyboard!");
  });
  valueInput.addEventListener('focusout', function (event) {
    if (event.explicitOriginalTarget === body) {
      UIManagementTools.closeTray();
    }

    UIManagementTools.hintToast("Hit any key on your keyboard!");
  });
};
},{"./components/Keyboard.js":"components/Keyboard.js","./utils/keyToBind.js":"utils/keyToBind.js","./constants/LAYOUTS.js":"constants/LAYOUTS.js","./utils/command-search":"utils/command-search.js","./state/query":"state/query.js","./state/config.js":"state/config.js","./state/ui.js":"state/ui.js","./utils/getKey.js":"utils/getKey.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51773" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/easy-config.e31bb0bc.js.map