import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { CURRENT_YEAR } from "@/constants/constants";
import WHENUSULogo from "@/assets/logo-whenusu.png";
import { authService } from "@/services/authService";
import { toast } from "sonner";

type FormState = "idle" | "loading" | "error";

export default function Register() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formState === "error") {
      setFormState("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage("");

    try {
      const response = await authService.register({
        last_name: formData.last_name,
        first_name: formData.first_name,
        phone_number: formData.phone_number,
        password: formData.password,
        email: formData.email || undefined,
      });

      // Succès
      setFormState("idle");
      toast.success(response.message || "Compte créé avec succès !");

      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate("/se-connecter");
      }, 1500);
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription"
      );
    }
  };

  const isFormValid =
    formData.last_name &&
    formData.first_name &&
    formData.phone_number &&
    formData.password;

  const isLoading = formState === "loading";

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
            Rejoignez notre communauté
          </h1>
          <p className="text-lg text-secondary/80">
            Contribuez à la préservation du patrimoine culturel africain.
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
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Inscription au back-office Whenusu
            </p>
          </div>

          {/* Error Message */}
          {formState === "error" && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Name fields - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="last_name">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Dupont"
                    className="pl-10 h-11 sm:h-12"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="Jean"
                    className="pl-10 h-11 sm:h-12"
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Email (optional) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@example.com"
                  className="pl-10 h-11 sm:h-12"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone_number">
                Numéro de téléphone <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  className="pl-10 h-11 sm:h-12"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 sm:h-12"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 text-base"
              size="lg"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Créer un compte
                </>
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/se-connecter"
              className="font-medium text-primary hover:underline"
            >
              Se connecter
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground">
            En créant un compte, vous acceptez nos{" "}
            <a href="#" className="underline hover:text-foreground">
              conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="underline hover:text-foreground">
              politique de confidentialité
            </a>
            .
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
