"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formatBody = (values: z.infer<typeof changePasswordFormSchema>) => {
  return {
    user: {
      current_password: values.currentPassword,
      new_password: values.newPassword,
      new_password_confirmation: values.newPasswordConfirmation,
    },
  };
};

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    newPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    newPasswordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match.",
    path: ["newPasswordConfirmation"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  });

interface ChangePasswordModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { toast } = useToast();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof changePasswordFormSchema>) => {
    try {
      setButtonDisabled(true);
      const response = await fetchWithToken({
        url: API_ENDPOINTS.USER.CHANGE_PASSWORD,
        options: {
          method: "PUT",
          body: JSON.stringify(formatBody(values)),
        },
      });

      const data = await response.json();

      toast({
        description: data.data.message,
      });
      setIsOpen(false);
      setButtonDisabled(false);
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
      }
      console.log("Unable to change password", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-xl">Password</DialogTitle>
          <DialogDescription className="text-xs text-muted">
            Set a strong password to prevent unauthorized access to your
            account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className={cn(
                        "border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted",
                        {
                          "border-error focus:border-error focus:ring-error":
                            form.formState.errors.currentPassword,
                        }
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className={cn(
                        "border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted",
                        {
                          "border-error focus:border-error focus:ring-error":
                            form.formState.errors.newPassword,
                        }
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPasswordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className={cn(
                        "border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted",
                        {
                          "border-error focus:border-error focus:ring-error":
                            form.formState.errors.newPasswordConfirmation,
                        }
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button
                type="submit"
                className="bg-dark-green"
                disabled={buttonDisabled}
              >
                Change password
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
