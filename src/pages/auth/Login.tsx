import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CURRENT_YEAR } from "@/constants/constants";
import WHENUSULogo from "@/assets/logo-whenusu.png";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { authService } from "@/services/authService";

const loginSchema = z
  .object({
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    phone_number: z.string().optional().or(z.literal("")),
    password: z.string().min(3, "Le mot de passe est requis"),
  })
  .refine((data) => data.email || data.phone_number, {
    message: "Email ou numéro de téléphone requis",
    path: ["email"],
  });

type LoginState = "idle" | "loading" | "error";
type GoogleLoginState = "idle" | "loading" | "success" | "error";
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { setCredentials } = useAuthStore();

  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "phone_number">("email");

  const [errorMessage, setErrorMessage] = useState("");
  // setErrorMessage("");

  // Google OAuth specific states
  const [googleLoginState, setGoogleLoginState] =
    useState<GoogleLoginState>("idle");
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");
  const [googleSuccessMessage, setGoogleSuccessMessage] = useState("");

  const isLoading = loginState === "loading";
  const isGoogleLoading = googleLoginState === "loading";
  const isGoogleSuccess = googleLoginState === "success";
  const isGoogleError = googleLoginState === "error";
  const isAnyLoading = isLoading || isGoogleLoading;

  // React Hook Form avec Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      phone_number: "",
      password: "",
    },
  });

  // ============================================
  // HANDLER DE SOUMISSION
  // ============================================
  const onSubmit = async (data: LoginFormData) => {
    setLoginState("loading");

    try {
      // Préparation des credentials selon l'onglet actif
      const credentials =
        activeTab === "email"
          ? { email: data.email!, password: data.password }
          : { phone_number: data.phone_number!, password: data.password };

      // Appel du service d'authentification
      const response = await authService.login(credentials);

      // Sauvegarde dans le store (token + user)
      setCredentials(response.user, response.token, ""); // Pas de refresh token dans ta réponse

      // Notification de succès
      toast.success(response.message || "Connexion réussie !");

      // Redirection après un court délai
      setTimeout(() => {
        setLoginState("idle");
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Erreur de connexion:", error);

      setLoginState("error");
      setErrorMessage(error?.message || "Informations de connexion invalides");

      // Affichage de l'erreur
      // const errorMessage =
      //   error?.message || "Informations de connexion invalides";
      toast.error(errorMessage);

      // Reset après quelques secondes
      setTimeout(() => {
        setLoginState("idle");
      }, 2000);
    }
  };

  const handleGoogleLogin = () => {
    if (isAnyLoading) return;

    // Reset states
    setGoogleErrorMessage("");
    setGoogleSuccessMessage("");
    setGoogleLoginState("loading");

    // Simulate Google OAuth - POST /api/auth/google with id_token
    setTimeout(() => {
      // Randomly simulate success or error for demo
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo

      if (isSuccess) {
        setGoogleLoginState("success");
        setGoogleSuccessMessage("Connexion réussie ! Redirection...");

        // Redirect to dashboard after brief success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setGoogleLoginState("error");
        setGoogleErrorMessage(
          "Échec de la connexion avec Google. Veuillez réessayer."
        );
      }
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden w-1/2 bg-primary/20 lg:flex lg:flex-col lg:justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-32 items-center justify-center rounded-xl mt-12">
            <img src={WHENUSULogo} alt="Logo WHENUSU" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-secondary mr-4">
            Préservons notre patrimoine culturel
          </h1>
          <p className="text-lg text-secondary/80">
            Plateforme de gestion des traditions, langues et cultures
            africaines.
          </p>
        </div>

        <p className="text-sm text-secondary/60">
          © {CURRENT_YEAR} WHENUSU. Tous droits réservés.
        </p>
      </div>

      {/* Right Panel - Login Form */}
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
              Connexion Admin
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Accédez au back-office de gestion
            </p>
          </div>

          {/* Form Error Message */}
          {loginState === "error" && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Google Success Message */}
          {isGoogleSuccess && googleSuccessMessage && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {googleSuccessMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Google Error Message */}
          {isGoogleError && googleErrorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{googleErrorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Provider Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "email" | "phone_number");
              reset(); // Reset le formulaire lors du changement d'onglet
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="email"
                className="text-sm"
                disabled={isAnyLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger
                value="phone_number"
                className="text-sm"
                disabled={isAnyLoading}
              >
                <Phone className="mr-2 h-4 w-4" />
                Téléphone
              </TabsTrigger>
            </TabsList>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4 sm:space-y-5"
            >
              <TabsContent value="email" className="mt-0 space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@whenusu.com"
                      className="pl-10 h-11 sm:h-12"
                      // value={email}
                      {...register("email")}
                      // onChange={(e) => setEmail(e.target.value)}
                      disabled={isAnyLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 sm:h-12"
                      // value={password}
                      // onChange={(e) => setPassword(e.target.value)}
                      {...register("password")}
                      disabled={isAnyLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isAnyLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="phone_number" className="mt-0 space-y-4">
                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Numéro de téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="+229 XX XX XX XX"
                      className="pl-10 h-11 sm:h-12"
                      {...register("phone_number")}
                      // value={phoneNumber}
                      // onChange={(e) => setPhoneNumber(e.target.value)}
                      // disabled={isAnyLoading}
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="text-sm text-red-500">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 sm:h-12"
                      // value={password}
                      // onChange={(e) => setPassword(e.target.value)}
                      {...register("password")}
                      disabled={isAnyLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isAnyLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Remember me & Forgot password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-border h-4 w-4 accent-secondary cursor-pointer"
                    disabled={isAnyLoading}
                  />
                  <span className="text-muted-foreground">
                    Se souvenir de moi
                  </span>
                </label>
                {/* <Link
                  to="/mot-de-passe-oublie"
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  <button disabled={isAnyLoading}>Mot de passe oublié ?</button>
                  Mot de passe oublié ?
                </Link> */}

                <Link
                  to="/mot-de-passe-oublie"
                  className={`text-sm text-primary hover:underline ${
                    isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={isAnyLoading ? (e) => e.preventDefault() : undefined}
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-base"
                size="lg"
                disabled={isAnyLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 sm:h-12 text-base"
                onClick={handleGoogleLogin}
                disabled={isAnyLoading || isGoogleSuccess}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion avec Google en cours…
                  </>
                ) : isGoogleSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                    Connecté !
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Se connecter avec Google
                  </>
                )}
              </Button>
            </form>
          </Tabs>

          {/* Create account link */}
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              to="/s-inscrire"
              className="font-medium text-primary hover:underline"
            >
              Créer un compte
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
