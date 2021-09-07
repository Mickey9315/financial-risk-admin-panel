export const EMAIL_ADDRESS_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const MOBILE_NUMBER_REGEX = /^([+0]?)(?:\d\s?){8,15}$/;
export const NUMBER_REGEX = /^\d+$/;
export const SPECIAL_CHARACTER_REGEX = /[^A-Za-z 0-9]/;
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
