import { UserType } from '../constants/enums.constants';

export function canSeeUsers(userType: string, queryType: string) {
  if (
    userType == UserType.ADMIN ||
    (userType == UserType.MOTOBOY && queryType == UserType.SHOPKEEPER) ||
    (userType == UserType.SHOPKEEPER && queryType == UserType.MOTOBOY)
  ) {
    return true;
  } else {
    return false;
  }
}

export function onlyForMotoboyOrAdmin(userType: string) {
  if (
    userType == UserType.ADMIN ||
    userType == UserType.MOTOBOY ||
    userType == UserType.SHOPKEEPERADMIN
  ) {
    return true;
  } else {
    return false;
  }
}

export function onlyForShopkeeperOrAdmin(userType: string) {
  if (
    userType == UserType.ADMIN ||
    userType == UserType.SHOPKEEPER ||
    userType == UserType.SHOPKEEPERADMIN
  ) {
    return true;
  } else {
    return false;
  }
}

export function onlyForAdmin(userType: string) {
  if (userType == UserType.ADMIN) {
    return true;
  } else {
    return false;
  }
}
