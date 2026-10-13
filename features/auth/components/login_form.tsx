"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { authClient } from "@/lib/auth_client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your admin email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your admin password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authClient.signIn.email({
        email: trimmedEmail,
        password,
      });

      if (response.error) {
        setErrorMessage(
          response.error.message || "Invalid credentials. Please verify your email and password.",
        );
        setIsSubmitting(false);
        return;
      }

      // Successful login -> route to protected internal admin page
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Authentication failed. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn("flex w-full max-w-md flex-col gap-6", className)}
      {...props}
    >
      <Card className="border-border/40 bg-card/80 backdrop-blur-md shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="size-6" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Admin Access
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Sign in with your super admin credentials to manage Q&amp;A submissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field data-invalid={Boolean(errorMessage)}>
                <FieldLabel htmlFor="admin-email">Email Address</FieldLabel>
                <div className="relative">
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@zerochirou.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errorMessage)}
                    className="pl-10"
                  />
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </Field>

              <Field data-invalid={Boolean(errorMessage)}>
                <FieldLabel htmlFor="admin-password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errorMessage)}
                    className="pl-10"
                  />
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>
              </Field>

              {errorMessage && (
                <FieldError errors={[{ message: errorMessage }]} />
              )}

              <Button
                type="submit"
                className="w-full min-h-[44px] cursor-pointer text-sm font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Admin"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
