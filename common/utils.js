export function getMethodArguments(model, methodName, methodIsStatic = true, args) {
  let sharedMethod = model.sharedClass.find(methodName, methodIsStatic);
  if (sharedMethod) {
    const result = {};
    const acceptArgs = sharedMethod.accepts;
    acceptArgs.forEach((arg, index) => {
      if (args[index]) result[arg.arg] = args[index];
    });
    return result;
  } else {
    return false;
  }
}

export function standardizeMacAddress(mac) {
  if (!mac) return null;
  mac = mac.replace(/-/g, ':').toUpperCase();
  if (mac.indexOf(':') == -1) {
    mac = mac.match(/[\s\S]{1,3}/g).join(':');
  }
  mac = mac.substr(0, 17);
  return mac;
}

export function standardizeGender(gender) {
  if (!gender) return null;
  gender = gender.toLowerCase();
  if (gender != 'male' && gender != 'female') {
    return null;
  }
  return gender;
}

export function standardizeAgeAndIncome(value) {
  if (!value) return null;
  return value.replace(/[\s]+/g, '').replace(/-/g, '_to_').replace(/</g, 'under_').replace(/>/g, 'higher_').replace(/^\$/, '_$');
}

export function standardizeOs(os) {
  if (!os) {
    return null;
  } else if (os.match(/android/i)) {
    return 'android';
  } else if (os.match(/ios/i)) {
    return 'ios';
  } else if (os.match(/windows phone/i)) {
    return 'windows_phone';
  } else if (os.match(/windows/i)) {
    return 'windows';
  } else if (os.match(/(osx|os x|macos|mac os)/i)) {
    return 'mac';
  } else if (os.match(/(linux|ubuntu)/i)) {
    return 'linux';
  } else {
    return 'other';
  }
}

export function standardizeDevice(device) {
  if (!device) {
    return null;
  } else if (device.match(/mobile/i)) {
    return 'mobile';
  } else if (device.match(/tablet/i)) {
    return 'tablet';
  } else if (device.match(/(pc|laptop|desktop)/i)) {
    return 'pc';
  } else {
    return 'other';
  }
}
