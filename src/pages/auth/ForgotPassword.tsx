import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { CURRENT_YEAR } from "@/constants/constants";
import WHENUSULogo from "@/assets/logo-whenusu.png";

type FormState = "idle" | "loading" | "success" | "error";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";
  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    userId && newPassword && confirmPassword && passwordsMatch && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Validate passwords match
    if (!passwordsMatch) {
      setFormState("error");
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    // Simulate API call - POST /api/auth/reset-password
    setTimeout(() => {
      // Simulate success (80% success rate for demo)
      const isSuccessful = Math.random() > 0.2;

      if (isSuccessful) {
        setFormState("success");
        setSuccessMessage(
          "Mot de passe réinitialisé avec succès ! Redirection..."
        );

        // Redirect to login after brief success message
        setTimeout(() => {
          navigate("/se-connecter");
        }, 1500);
      } else {
        setFormState("error");
        setErrorMessage(
          "Échec de la réinitialisation. Veuillez vérifier votre identifiant et réessayer."
        );
      }
    }, 1500);
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
          <h1 className="text-6xl font-bold text-secondary mr-40">
            Réinitialisez votre mot de passe
          </h1>
          <p className="text-lg text-secondary/80">
            Sécurisez votre compte avec un nouveau mot de passe.
          </p>
        </div>

        <p className="text-sm text-secondary/80">
          © {CURRENT_YEAR} WHENUSU. Tous droits réservés.
        </p>
      </div>

      {/* Right Panel - Reset Form */}
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

          {/* Back to Login Link */}
          <Link
            to="/se-connecter"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Mot de passe oublié
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Entrez votre identifiant et créez un nouveau mot de passe
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && successMessage && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {formState === "error" && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* User ID Field */}
            <div className="space-y-2">
              <Label htmlFor="userId">
                Identifiant utilisateur{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="userId"
                  type="text"
                  placeholder="Votre identifiant"
                  className="pl-10 h-11 sm:h-12"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={isLoading || isSuccess}
                  required
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">
                Nouveau mot de passe <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 sm:h-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading || isSuccess}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading || isSuccess}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmer le mot de passe{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 h-11 sm:h-12 ${
                    confirmPassword && !passwordsMatch
                      ? "border-destructive focus-visible:ring-destructive"
                      : confirmPassword && passwordsMatch
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading || isSuccess}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading || isSuccess}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {/* Password match indicator */}
              {confirmPassword && (
                <p
                  className={`text-xs ${
                    passwordsMatch ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {passwordsMatch ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Les mots de passe correspondent
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Les mots de passe ne correspondent pas
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 text-base"
              size="lg"
              disabled={!canSubmit || isSuccess}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réinitialisation en cours...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Réinitialisé !
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </form>

          {/* Back to login link */}
          <p className="text-center text-sm text-muted-foreground">
            Vous vous souvenez de votre mot de passe ?{" "}
            <Link
              to="/se-connecter"
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
