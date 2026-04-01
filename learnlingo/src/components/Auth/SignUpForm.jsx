// src/components/Auth/SignUpForm.jsx (Özet Mantık)
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase";

const schema = yup.object({
  name: yup.string().required("İsim zorunludur"),
  email: yup.string().email("Geçersiz email").required("Email zorunludur"),
  password: yup.string().min(6, "En az 6 karakter").required(),
}).required();

export const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      // Kullanıcı adını Firebase profiline ekleyelim
      await updateProfile(userCredential.user, { displayName: data.name });
      alert("Kayıt başarılı!");
    } catch (error) {
      console.error("Hata:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="İsim" />
      <p>{errors.name?.message}</p>
      
      <input {...register("email")} placeholder="Email" />
      <p>{errors.email?.message}</p>

      <input type="password" {...register("password")} placeholder="Şifre" />
      <button type="submit">Kayıt Ol</button>
    </form>
  );
};