import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/authService";

type RecoveryStep = "email" | "otp" | "reset" | "done";

// ============================================
// CUSTOM HOOK - usePasswordRecovery
// ============================================

export const usePasswordRecovery = () => {
  const [step, setStep] = useState<RecoveryStep>("email");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Étape 1: Vérifier l'utilisateur et envoyer OTP
  const verifyUser = async (userEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.verifyUser({ email: userEmail });
      setEmail(userEmail);
      setStep("otp");
      toast.success("Un code de vérification a été envoyé à votre email");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la vérification";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Vérifier le code OTP
  const verifyOtp = async (otpCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOtpCode({
        email,
        otpCode,
      });
      setUserId(response.userId);
      setStep("reset");
      toast.success("Code vérifié avec succès");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Code de vérification invalide";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Étape 3: Réinitialiser le mot de passe
  const resetPassword = async (newPassword: string, confirmPassword: string) => {
    if (!userId) {
      const errorMsg = "Session expirée, veuillez recommencer";
      setError(errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword({
        userId,
        newPassword,
        confirmPassword,
      });
      setStep("done");
      toast.success("Mot de passe réinitialisé avec succès !");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la réinitialisation";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Renvoyer le code OTP
  const resendOtp = async () => {
    if (!email) return;
    await verifyUser(email);
  };

  // Réinitialiser le processus
  const reset = () => {
    setStep("email");
    setEmail("");
    setUserId(null);
    setError(null);
  };

  return {
    step,
    email,
    loading,
    error,
    verifyUser,
    verifyOtp,
    resetPassword,
    resendOtp,
    reset,
  };
};
