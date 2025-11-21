import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod/v4";

export const Route = createFileRoute("/register-email")({
  component: RouteComponent,
});

function RouteComponent() {
 return <div>Hello "/_sign-on-layout/register-email"!</div>
}
