const submit = (event) => {
  event.preventDefault();

  const keyElement = event.submitter;

  /**
   * Perform click animation.
   */
  keyElement.classList.add('clicked');
  setTimeout(() => keyElement.classList.remove('clicked'), 300);

  console.log(keyElement.value);
}

/**
 * TODO: Create an object containing all the mappings and access that object like bindings[key]
 * @param {*} key 
 */
const keyToBind = (key, keyCode) => {
  const keyString = key.toLowerCase();

  switch (keyCode) {
    case 173:
      return 'kp_minus';
    case 61:
      return 'kp_plus';
    case 32:
      return 'space';
    case 17:
      return 'ctrl';
    case 18:
      return 'rctrl';
    case 191:
      return '\/';
    case 220:
      return '\\\\';
    default:
      if (keys[keyString]) return keyString;
      throw new Error(`${keyString} is not a bindable key`);
  }
}

const keyPress = ({key, keyCode}) => {
  let bindCode;
  try {
    bindCode = keyToBind(key, keyCode);
  } catch (err) {
    throw err;
    return;
  }

  const query = `.key[data-bindcode="${bindCode}"]`;
  console.log(query)
  const keyElement = document.querySelector(query);
  keyElement.click();
}

const keyboard = document.getElementById('keyboard');
keyboard.addEventListener('submit', submit);

/**
 * Generates a key element.
 * @param {*} keyString the key to be displayed on the key.
 */
const generateKey = (bindCode) => {
  const key = Object.freeze(document.createElement('button'));
  key.type = 'submit';

  const keyName = keys[bindCode];
  if (/!.+/.test(bindCode)) {
    key.innerHTML = bindCode.slice(1);
    key.value = bindCode;
    key.setAttribute('data-bindcode', 'unbindable');
  } else {
    const bindCodes = bindCode.split(/~/);
    console.log(bindCodes);
    key.innerHTML = keys[bindCode];
    key.value = bindCode;
    key.setAttribute('data-bindcode', bindCodes[0]);
    if (bindCodes[1]) {
      key.setAttribute('data-bindcode2', bindCodes[1]);
    }
  }

  key.classList.add('key');

  return key;
}

/**
 * Generates a keyboard with standard UK-QWERTY layout.
 * @param {*} event the onload event.
 */
const generateKeyboard = (event) => void Object.keys(qwerty).forEach(index => keyboard.appendChild(generateKey(qwerty[index])));

//var rawKeys = "{\"5\":\"kp_5\",\"1 / End\":\"kp_end\",\"2 / Down Arrow\":\"kp_downarrow\",\"3 / Page Down\":\"kp_pgdn\",\"4 / Left Arrow\":\"kp_leftarrow\",\"6 / Right Arrow\":\"kp_rightarrow\",\"7 / Home\":\"kp_home\",\"8 / Up Arrow\":\"kp_uparrow\",\"9 / Page Up\":\"kp_pgup\",\"0 / Insert\":\"kp_ins\",\". / Delete\":\"kp_del\",\"/ (Slash)\":\"kp_slash\",\"* (Multiply)\":\"kp_multiply\",\"- (Minus)\":\"kp_minus\",\"+ (Plus)\":\"kp_plus\",\"Insert\":\"ins\",\"Delete\":\"del\",\"Home\":\"home\",\"End\":\"end\",\"Page Up\":\"pgup\",\"Page Down\":\"pgdn\",\"Up Arrow\":\"uparrow\",\"Left Arrow\":\"leftarrow\",\"Down Arrow\":\"downarrow\",\"Right Arrow\":\"rightarrow\",\"F1\":\"f1\",\"F2\":\"f2\",\"F3\":\"f3\",\"F4\":\"f4\",\"F5\":\"f5\",\"F6\":\"f6\",\"F7\":\"f7\",\"F8\":\"f8\",\"F9\":\"f9\",\"F10\":\"f10\",\"F11\":\"f11\",\"F12\":\"f12\",\"1 / ! (Exclamation Mark)\":\"1\",\"2 / @ (At Sign)\":\"2\",\"3 / # (Number Sign)\":\"3\",\"4 / $ (Dollar Sign)\":\"4\",\"5 / % (Percent Sign)\":\"5\",\"6 / ^ (Caret)\":\"6\",\"7 / &amp; (Ampersand)\":\"7\",\"8 / * (Asterisk)\":\"8\",\"9 / ( (Parenthesis Left)\":\"9\",\"0 / ) (Parenthesis Right)\":\"0\",\"A\":\"a\",\"B\":\"b\",\"C\":\"c\",\"D\":\"d\",\"E\":\"e\",\"F\":\"f\",\"G\":\"g\",\"H\":\"h\",\"I\":\"i\",\"J\":\"j\",\"K\":\"k\",\"L\":\"l\",\"M\":\"m\",\"N\":\"n\",\"O\":\"o\",\"P\":\"p\",\"Q\":\"q\",\"R\":\"r\",\"S\":\"s\",\"T\":\"t\",\"U\":\"u\",\"V\":\"v\",\"W\":\"w\",\"X\":\"x\",\"Y\":\"y\",\"Z\":\"z\",\"Enter\":\"enter\",\"Space Bar\":\"space\",\"- (Hyphen) / _ (Underscore)\":\"-\",\"= (Equals Sign) / + (Plus Sign)\":\"=\",\"[ (Bracket Left) / { (Brace Left)\":\"[\",\"] (Bracket Right) / } (Brace Right)\":\"]\",\"\\\\ (Backslash) / | (Pipe)\":\"\\\\\",\"; (Semicolon) / : (Colon)\":\"semicolon\",\"' (Apostraphe) / \\\" (Quotation Marks)\":\"'\",\", (Comma) / &lt; (Pointy Bracket Left)\":\",\",\". (Period) / &gt; (Pointy Bracket Right)\":\".\",\"/ (Slash) / ? (Question Mark)\":\"/\",\"Backspace\":\"backspace\",\"Tab\":\"tab\",\"Caps Lock\":\"capslock\",\"Shift Left\":\"shift\",\"Shift Right\":\"rshift\",\"Control Left\":\"ctrl\",\"Control Right\":\"rctrl\",\"Alt Left\":\"alt\",\"Alt Right\":\"ralt\",\"Left Mouse\":\"mouse1\",\"Right Mouse\":\"mouse2\",\"Middle Mouse\":\"mouse3\",\"Side Mouse 1\":\"mouse4\",\"Side Mouse 2\":\"mouse5\",\"Mouse Wheel Down\":\"mwheeldown\",\"Mouse Wheel Up\":\"mwheelup\"}"

const keys = {"0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9","kp_5":"5","kp_end":"1 / End","kp_downarrow":"2 / Down Arrow","kp_pgdn":"3 / Page Down","kp_leftarrow":"4 / Left Arrow","kp_rightarrow":"6 / Right Arrow","kp_home":"7 / Home","kp_uparrow":"8 / Up Arrow","kp_pgup":"9 / Page Up","kp_ins":"0 / Insert","kp_del":". / Delete","kp_slash":"/","kp_multiply":"*","kp_minus":"-","kp_plus":"+","ins":"Insert","del":"Delete","home":"Home","end":"End","pgup":"Page Up","pgdn":"Page Down","uparrow":"Up Arrow","leftarrow":"Left Arrow","downarrow":"Down Arrow","rightarrow":"Right Arrow","F1":"F1","F2":"F2","F3":"F3","F4":"F4","F5":"F5","F6":"F6","F7":"F7","F8":"F8","F9":"F9","F10":"F10","F11":"F11","F12":"F12","a":"A","b":"B","c":"C","d":"D","e":"E","f":"F","g":"G","h":"H","i":"I","j":"J","k":"K","l":"L","m":"M","n":"N","o":"O","p":"P","q":"Q","r":"R","s":"S","t":"T","u":"U","v":"V","w":"W","x":"X","y":"Y","z":"Z","enter":"Enter","space":"Space Bar","[":"[","]":"]","\\":"\\",";":";","'":"'",",":",",".":".","/":"/","backspace":"Backspace","tab":"Tab","capslock":"Caps Lock","shift":"Shift Left","rshift":"Shift Right","ctrl":"Control Left","rctrl":"Control Right","alt":"Alt Left","ralt":"Alt Right","mouse1":"Left Mouse","mouse2":"Right Mouse","mouse3":"Middle Mouse","mouse4":"Side Mouse 1","mouse5":"Side Mouse 2","mwheeldown":"Mouse Wheel Down","mwheelup":"Mouse Wheel Up"}

const remove = (from, filter) => {
  Object.keys(from).forEach(key => {
    if (key.match(filter)) {
      delete from[key];
    }
  });
}

// we use the pattern keyA~keyB for multi character keys.
const qwerty = [
   "!esc","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","!💾",
  "1","2","3","4","5","6","7","8","9","0","kp_minus","kp_plus",
  "backspace","tab","q","w","e","r","t","y","u","i","o","p","[","]","/",
  "capslock","a","s","d","f","g","h","j","k","l",";","'","enter",
  "shift","\\","z","x","c","v","b","n","m",",",".","rshift","ctrl","alt","space","ralt","rctrl"
];

generateKeyboard();

document.body.addEventListener('keydown', keyPress);
