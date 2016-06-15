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
  if (!(~mac.indexOf(':'))) {
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
