import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Bell,
  Shield,
  Palette,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

export default function Settings() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);
  const { loading, updateProfile, updatePassword, deleteAccount, toggleNotification } = useProfile();

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendNotif, setSendNotif] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Pré-remplir les champs quand les données utilisateur sont chargées
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || "");
      setLastName(currentUser.last_name || "");
      setEmail(currentUser.email || "");
      setPhoneNumber(currentUser.phone_number || "");
      setSendNotif(currentUser.send_notif ?? true);
    }
  }, [currentUser]);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
      });
    } catch {
      // Error handled by hook
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setPasswordLoading(true);
    try {
      await updatePassword({
        password: currentPassword,
        newPassWord: newPassword,
      });
      // Déconnecter et rediriger vers la page de connexion
      logout();
      navigate("/se-connecter");
    } catch {
      // Error handled by hook
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = async () => {
    const previousValue = sendNotif;
    setSendNotif(!sendNotif); // Optimistic update
    try {
      await toggleNotification();
    } catch {
      setSendNotif(previousValue); // Revert on error
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch {
      // Error handled by hook
    }
  };

  if (loading && !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Paramètres"
        subtitle="Configuration de la plateforme"
      />

      <div className="p-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Apparence
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={profileLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={profileLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={profileLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={profileLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      defaultValue={currentUser?.role || "Utilisateur"}
                      disabled
                    />
                  </div>
                  <Button type="submit" disabled={profileLoading}>
                    {profileLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      "Sauvegarder les modifications"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Gérez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Recevoir les notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Activer ou désactiver toutes les notifications
                    </p>
                  </div>
                  <Switch
                    checked={sendNotif}
                    onCheckedChange={handleNotificationToggle}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouvelles traditions</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification lors de l'ajout d'une tradition
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!sendNotif} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouveaux informateurs</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification lors de l'inscription d'un
                      informateur
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!sendNotif} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Éléments en modération</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification pour les contenus en attente
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!sendNotif} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Change Password Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Changer le mot de passe</CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe pour sécuriser votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          disabled={passwordLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-muted-foreground hover:text-foreground"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={passwordLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmer le mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={passwordLoading}
                          className={`pr-10 ${
                            confirmPassword && !passwordsMatch
                              ? "border-destructive"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && !passwordsMatch && (
                        <p className="text-xs text-destructive">
                          Les mots de passe ne correspondent pas
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword ||
                        !passwordsMatch ||
                        passwordLoading
                      }
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Modification...
                        </>
                      ) : (
                        "Modifier le mot de passe"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Delete Account Card */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Supprimer le compte
                  </CardTitle>
                  <CardDescription>
                    Cette action est irréversible. Toutes vos données seront
                    supprimées.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer mon compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Êtes-vous absolument sûr ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Votre compte et toutes vos
                          données seront définitivement supprimés de nos serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer définitivement
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode compact</p>
                    <p className="text-sm text-muted-foreground">
                      Réduire l'espacement entre les éléments
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sidebar réduite</p>
                    <p className="text-sm text-muted-foreground">
                      Afficher uniquement les icônes dans la sidebar
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
