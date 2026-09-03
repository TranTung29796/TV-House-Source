"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { sendLoginMagicLink } from "@datbuilds/auth/actions";
import { magicLinkLoginSchema, type MagicLinkLoginInput } from "@datbuilds/auth/schemas";
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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<MagicLinkLoginInput>({
    resolver: zodResolver(magicLinkLoginSchema),
    defaultValues: { email: "" },
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(
    searchParams.get("message") === "magic_link_sent" ? "Check your email for the magic link." : null,
  );

  async function onSubmit(values: MagicLinkLoginInput) {
    setStatusMessage(null);
    const result = await sendLoginMagicLink({ ...values, redirectTo: redirect });

    if (!result.success) {
      setError("root", { message: result.error });
      return;
    }

    if (result.completed) {
      router.push(redirect);
      router.refresh();
      return;
    }

    reset({ email: values.email });
    setStatusMessage("Check your email for the magic link.");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email and we will send you a magic link.</CardDescription>
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
          No account?{" "}
          <a
            href="/signup"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
