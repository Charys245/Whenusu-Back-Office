import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WHENUSULogo from "@/assets/logo-whenusu.png";
import { CURRENT_YEAR } from "@/constants/constants";

// ============================================
// SCHÉMA DE VALIDATION
// ============================================
const registerSchema = z.object({
  last_name: z.string().min(1, "Le nom est requis"),
  first_name: z.string().min(1, "Le prénom est requis"),
  phone_number: z.string().min(1, "Le numéro de téléphone est requis"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  region_id: z.string().optional().or(z.literal("")),
  avatar_url: z.instanceof(File).optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================
// COMPOSANT REGISTER
// ============================================
export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      last_name: "",
      first_name: "",
      phone_number: "",
      password: "",
      email: "",
      region_id: "",
    },
  });

  const avatarFile = watch("avatar_url");

  // Gestion du fichier avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("avatar_url", file);
      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setValue("avatar_url", undefined);
    setAvatarPreview(null);
  };

  // Soumission du formulaire
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    try {
      const response = await authService.register(data);

      toast.success(response.message || "Inscription réussie !");

      setTimeout(() => {
        setLoading(false);
        navigate("/connexion");
      }, 1500);
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      setLoading(false);

      const errorMessage =
        error?.message || "Une erreur est survenue lors de l'inscription";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 bg-primary/20 lg:flex lg:flex-col lg:justify-between p-12">
        <div className="flex items-center gap-3">
          <img src={WHENUSULogo} alt="Logo WHENUSU" />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-secondary">
            Rejoignez la communauté WHENUSU
          </h1>
          <p className="text-lg text-secondary/80">
            Participez à la préservation de notre patrimoine culturel africain.
          </p>
        </div>

        <p className="text-sm text-secondary/60">
          © {CURRENT_YEAR} WHENUSU. Tous droits réservés.
        </p>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex w-full flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary">
              <span className="text-xl sm:text-2xl font-bold text-primary-foreground">
                W
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              WHENUSU
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Rejoignez-nous pour préserver notre culture
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Photo de profil (optionnel)</Label>
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-20 w-20 rounded-full object-cover border-2 border-primary"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="avatar"
                    className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </label>
                )}
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  JPG, PNG ou GIF (max. 5MB)
                </p>
              </div>
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom *</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Dupont"
                  className="pl-10 h-11"
                  {...register("last_name")}
                  disabled={loading}
                />
              </div>
              {errors.last_name && (
                <p className="text-sm text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            {/* Prénom */}
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom *</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="first_name"
                  type="text"
                  placeholder="Jean"
                  className="pl-10 h-11"
                  {...register("first_name")}
                  disabled={loading}
                />
              </div>
              {errors.first_name && (
                <p className="text-sm text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="phone_number">Numéro de téléphone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  className="pl-10 h-11"
                  {...register("phone_number")}
                  disabled={loading}
                />
              </div>
              {errors.phone_number && (
                <p className="text-sm text-red-500">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            {/* Email (optionnel) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (optionnel)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@example.com"
                  className="pl-10 h-11"
                  {...register("email")}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11"
                  {...register("password")}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/connexion"
              className="font-medium text-primary hover:underline"
            >
              Se connecter
            </Link>
          </p>

          {/* Mobile footer */}
          <p className="lg:hidden text-center text-xs text-muted-foreground/60 pt-4">
            © {CURRENT_YEAR} WHENUSU. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
