import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().required("İsim alanı zorunludur").min(2, "En az 2 karakter olmalı"),
  email: yup.string().email("Geçerli bir e-posta giriniz").required("E-posta zorunludur"),
  password: yup.string().required("Şifre zorunludur").min(6, "Şifre en az 6 karakter olmalı"),
}).required();

export const loginSchema = yup.object({
  email: yup.string().email("Geçerli bir e-posta giriniz").required("E-posta zorunludur"),
  password: yup.string().required("Şifre zorunludur"),
}).required();