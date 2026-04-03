"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Account Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated!");
    }
    setIsUpdatingProfile(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password too short");
      return;
    }
    
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated!");
      setPassword("");
      setConfirmPassword("");
    }
    setIsUpdatingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("You must type DELETE to confirm.");
      return;
    }
    setIsDeleting(true);
    
    // Deleting via Edge functions or standard RPC if allowed by Supabase, 
    // usually requires backend or custom RPC for hard delete.
    // Assuming custom RPC or just fail gracefully with message for client
    const { error } = await supabase.rpc('delete_user_account'); // Placeholder for actual rpc
    
    if (error) {
      // Due to RLS, users can't delete auth.users directly. 
      toast.error("Account deletion requires admin privileges or custom RPC in Supabase. Please ask administrator.");
    } else {
      toast.success("Account deleted.");
      await supabase.auth.signOut();
    }
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 fade-in">
      <div>
        <h2 className="text-3xl font-heading font-bold text-white">Settings</h2>
        <p className="text-white/60 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <h3 className="text-xl font-heading font-bold text-white mb-6">Profile Settings</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-sm">
          <Input 
            label="Email Address" 
            type="email" 
            value={user?.email || ""}
            disabled 
            className="opacity-50"
          />
          <Input 
            label="Display Name" 
            type="text" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button type="submit" isLoading={isUpdatingProfile} size="sm">
            Save Profile
          </Button>
        </form>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <h3 className="text-xl font-heading font-bold text-white mb-6">Security</h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
          <Input 
            label="New Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input 
            label="Confirm New Password" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" isLoading={isUpdatingPassword} size="sm">
            Update Password
          </Button>
        </form>
      </div>

      <div className="glass-card p-6 sm:p-8 border-red-500/20">
        <h3 className="text-xl font-heading font-bold text-red-500 mb-2">Danger Zone</h3>
        <p className="text-white/60 text-sm mb-6">
          Once you delete your account, there is no going back. All your history and processed files will be permanently removed.
        </p>
        <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
          Delete Account
        </Button>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
        message="This action is irreversible. All your data will be cleared."
        isDanger
        confirmText="Permanently Delete"
        onConfirm={handleDeleteAccount}
        isConfirmLoading={isDeleting}
      >
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-sm text-white/80 font-medium mb-2">Type &quot;DELETE&quot; to confirm:</p>
          <Input 
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
          />
        </div>
      </Modal>
    </div>
  );
}
