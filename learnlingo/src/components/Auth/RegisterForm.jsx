import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/validation";
import { auth } from "../../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const RegisterForm = ({ closeModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      // 1. Kullanıcıyı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // 2. Kullanıcı ismini güncelle
      await updateProfile(userCredential.user, {
        displayName: data.name
      });

      alert("Kayıt başarılı!");
      closeModal(); // Form bir modal içindeyse kapat
    } catch (error) {
      console.error("Kayıt hatası:", error.message);
      alert("Hata: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>Registration</h2>
      <p>Thank you for your interest in our platform! Please fill out the form below.</p>
      
      <input {...register("name")} placeholder="Name" />
      <p className="error">{errors.name?.message}</p>

      <input {...register("email")} placeholder="Email" />
      <p className="error">{errors.email?.message}</p>

      <input {...register("password")} type="password" placeholder="Password" />
      <p className="error">{errors.password?.message}</p>

      <button type="submit">Sign Up</button>
    </form>
  );
};
export default RegisterForm;