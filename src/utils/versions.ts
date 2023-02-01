export function assertMinVersion(version: string, minRequired: string) {
  const minArr = minRequired.split(".").map((v) => +v);
  const versionArr = version.split(".").map((v) => +v);

  // compare major
  if (versionArr[0] < minArr[0]) return false;
  if (versionArr[0] > minArr[0]) return true;

  // compare minor
  if (versionArr[1] < minArr[1]) return false;
  if (versionArr[1] > minArr[1]) return true;

  // compare patch
  if (versionArr[2] < minArr[2]) return false;
  return true;
}
