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
