import { redirect } from "next/navigation";

import { appRoutes } from "@/config/routes";

export default function SignupPage() {
  redirect(appRoutes.auth.login);
}
