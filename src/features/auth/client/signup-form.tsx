"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { magicLinkSignupSchema, type MagicLinkSignupInput } from "@datbuilds/auth/schemas";
import { Button } from "@datbuilds/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@datbuilds/ui/components/card";
import { Input } from "@datbuilds/ui/components/input";
import { Label } from "@datbuilds/ui/components/label";

import { appRoutes } from "@/config/routes";
import { signUpForProduct } from "../actions/signup";

export function SignupForm() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<MagicLinkSignupInput>({
    resolver: zodResolver(magicLinkSignupSchema),
    defaultValues: { email: "", fullName: "" },
  });

  async function onSubmit(values: MagicLinkSignupInput) {
    setStatusMessage(null);
    const result = await signUpForProduct(values);

    if (!result.success) {
      setError("root", { message: result.error });
      return;
    }

    reset({ email: values.email, fullName: values.fullName });
    setStatusMessage("Check your email for the magic link to finish creating the account.");
    router.replace(`${appRoutes.auth.login}?message=magic_link_sent`);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Enter your name and email to receive a magic link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          {statusMessage ? (
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              autoComplete="name"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending magic link..." : "Send magic link"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href={appRoutes.auth.login}
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
