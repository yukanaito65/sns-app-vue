import { reactive } from "vue";
import validators from "@/components/molecules/validators";
const error: any = reactive({});

export default function formValidation() {
  const { isEmpty, minLength, isEmailType } = validators();

  const validateEmailField: (fieldName: string, fieldValue: string) => void = (
    fieldName,
    fieldValue
  ) => {
    error[fieldName] = !fieldValue
      ? isEmpty(fieldName, fieldValue)
      : isEmailType(fieldName, fieldValue);
  };

  const validateNameField: (fieldName: string, fieldValue: string) => void = (
    fieldName,
    fieldValue
  ) => {
    error[fieldName] = !fieldValue ? isEmpty(fieldName, fieldValue) : "";
  };

  const validateUserNameField: (
    fieldName: string,
    fieldValue: string
  ) => void = (fieldName, fieldValue) => {
    error[fieldName] = !fieldValue
      ? isEmpty(fieldName, fieldValue)
      : minLength(fieldName, fieldValue, 6);
  };

  const validatePasswordField: (
    fieldName: string,
    fieldValue: string
  ) => void = (fieldName, fieldValue) => {
    error[fieldName] = !fieldValue
      ? isEmpty(fieldName, fieldValue)
      : minLength(fieldName, fieldValue, 6);
  };

  const validateCPasswordField: (
    fieldName: string,
    fieldValue: string
  ) => void = (fieldName, fieldValue) => {
    error[fieldName] = !fieldValue
      ? isEmpty(fieldName, fieldValue)
      : minLength(fieldName, fieldValue, 6);
  };

  return {
    error,
    validateEmailField,
    validateNameField,
    validateUserNameField,
    validatePasswordField,
    validateCPasswordField,
  };
}
