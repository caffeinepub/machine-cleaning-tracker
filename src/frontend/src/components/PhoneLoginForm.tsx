import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Phone } from "lucide-react";
import { useState } from "react";

interface PhoneLoginFormProps {
  onForgotPassword: () => void;
}

export function PhoneLoginForm({ onForgotPassword }: PhoneLoginFormProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/[\s\-().]/g, "");
    return /^\+?\d{7,15}$/.test(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    setPhoneError("");
    setPasswordError("");

    if (!phone.trim()) {
      setPhoneError("Phone number is required.");
      valid = false;
    } else if (!validatePhone(phone)) {
      setPhoneError("Enter a valid phone number (e.g. +1 555 000 1234).");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters.");
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);
    // Simulate async login
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 900);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 py-3 text-center">
        <CheckCircle2 className="w-10 h-10 text-primary" />
        <p className="font-semibold text-foreground text-sm">
          Logged in successfully!
        </p>
        <p className="text-xs text-muted-foreground">Welcome back.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="space-y-1">
        <Label htmlFor="phone-login-number" className="text-sm font-medium">
          Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="phone-login-number"
            type="tel"
            placeholder="+1 555 000 1234"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (phoneError) setPhoneError("");
            }}
            autoComplete="tel"
            disabled={isLoading}
            className="pl-9"
          />
        </div>
        {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone-login-password" className="text-sm font-medium">
          Password
        </Label>
        <Input
          id="phone-login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          autoComplete="current-password"
          disabled={isLoading}
        />
        {passwordError && (
          <p className="text-xs text-destructive">{passwordError}</p>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-primary hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full gap-1.5 font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <Phone className="w-4 h-4" />
            Login with Phone
          </>
        )}
      </Button>
    </form>
  );
}
