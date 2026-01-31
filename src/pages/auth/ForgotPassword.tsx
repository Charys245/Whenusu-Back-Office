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
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { CURRENT_YEAR } from "@/constants/constants";
import WHENUSULogo from "@/assets/logo-whenusu.png";
import { usePasswordRecovery } from "@/hooks/usePasswordRecovery";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    step,
    email,
    loading,
    error,
    verifyUser,
    verifyOtp,
    resetPassword,
    resendOtp,
    reset,
  } = usePasswordRecovery();

  // Form states
  const [emailInput, setEmailInput] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;

  // Step 1: Submit email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    try {
      await verifyUser(emailInput);
    } catch {
      // Error handled by hook
    }
  };

  // Step 2: Submit OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    try {
      await verifyOtp(otpCode);
    } catch {
      // Error handled by hook
    }
  };

  // Step 3: Submit new password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || !passwordsMatch) return;
    try {
      await resetPassword(newPassword, confirmPassword);
    } catch {
      // Error handled by hook
    }
  };

  // Redirect after success
  if (step === "done") {
    setTimeout(() => navigate("/se-connecter"), 2000);
  }

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Mot de passe oublié";
      case "otp":
        return "Vérification";
      case "reset":
        return "Nouveau mot de passe";
      case "done":
        return "Succès !";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Entrez votre adresse email pour recevoir un code de vérification";
      case "otp":
        return `Un code de vérification a été envoyé à ${email}`;
      case "reset":
        return "Créez votre nouveau mot de passe";
      case "done":
        return "Votre mot de passe a été réinitialisé avec succès";
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel - Branding */}
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

      {/* Right Panel - Form */}
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

          {/* Back Link */}
          {step === "email" ? (
            <Link
              to="/se-connecter"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          ) : step !== "done" ? (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Recommencer
            </button>
          ) : null}

          {/* Step indicator */}
          {step !== "done" && (
            <div className="flex items-center justify-center gap-2">
              {["email", "otp", "reset"].map((s, i) => (
                <div
                  key={s}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    step === s
                      ? "bg-primary"
                      : ["email", "otp", "reset"].indexOf(step) > i
                      ? "bg-primary/60"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {getStepTitle()}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {getStepDescription()}
            </p>
          </div>

          {/* Success Message for done step */}
          {step === "done" && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Mot de passe réinitialisé ! Redirection vers la connexion...
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Email Form */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Adresse email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    className="pl-10 h-11 sm:h-12"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-base"
                size="lg"
                disabled={!emailInput || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  "Envoyer le code"
                )}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp">
                  Code de vérification <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Entrez le code reçu"
                    className="pl-10 h-11 sm:h-12 text-center tracking-widest"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    disabled={loading}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-base"
                size="lg"
                disabled={!otpCode || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  "Vérifier le code"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Vous n'avez pas reçu le code ?{" "}
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading}
                  className="font-medium text-primary hover:underline disabled:opacity-50"
                >
                  Renvoyer
                </button>
              </p>
            </form>
          )}

          {/* Step 3: New Password Form */}
          {step === "reset" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-5">
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
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe <span className="text-destructive">*</span>
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
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
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

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-base"
                size="lg"
                disabled={!newPassword || !confirmPassword || !passwordsMatch || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </Button>
            </form>
          )}

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
