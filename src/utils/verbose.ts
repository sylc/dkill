let isVerbose = false;

export function setVerbose(value: boolean | undefined) {
  isVerbose = !!value;
}

export function verbose(text: string) {
  isVerbose ? console.log(text) : null;
}

export function getVerbose() {
  return isVerbose;
}
