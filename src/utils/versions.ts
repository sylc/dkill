// ** does not handee '- name'
export function assertMinVersion(version: string, minRequired: string) {
  const minArr = minRequired.split(".");
  return version.split(".").every((v, i) => {
    if (i < 3 && +v >= +minArr[i]) return true;
    return false;
  });
}
