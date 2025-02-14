"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Logo from "@/components/shared/logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { useToast } from "@/hooks/use-toast";

const formatBody = (values: z.infer<typeof signinFormSchema>) => {
  return {
    user: {
      email: values.email,
      password: values.password,
    },
  };
};

const signinFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(100, {
      message: "Password must be at most 100 characters.",
    }),
});

type SigninPageProps = object;

const SigninPage: React.FC<SigninPageProps> = () => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signinFormSchema>) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatBody(values)),
      });

      const data = await response.json();

      if (!response.ok)
        return toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.error,
        });

      toast({
        description: data.data.message,
      });
      Cookies.set("token", data.data.token);
      Cookies.set("userId", data.data.user_id);

      router.push("/chat/inbox");
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[460px] md:bg-gray-200 md:p-12 p-6 flex flex-col gap-6 rounded-lg"
      >
        <Logo />
        <h3 className="font-bold text-xl">Sign in</h3>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email Address"
                  {...field}
                  className={cn(
                    "p-6 border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted",
                    {
                      "border-error focus:border-error focus:ring-error":
                        form.formState.errors.email,
                    },
                  )}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  {...field}
                  className={cn(
                    "p-6 border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted",
                    {
                      "border-error focus:border-error focus:ring-error":
                        form.formState.errors.password,
                    },
                  )}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="p-6 bg-dark-green">
          Signin
        </Button>

        <div className="text-sm">
          <span>Don&apos;t have a chat account? </span>
          <Link href="/register" className="font-medium text-light-green">
            Register now
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SigninPage;
