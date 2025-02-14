"use client";

import type { UserType } from "@/types/base";
import type { ScopedMutator } from "swr";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { useToast } from "@/hooks/use-toast";
import BirthdayPicker from "@/components/shared/birthday-picker";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { fetchWithToken } from "@/lib/fetch";

interface BasicInfoFormProps {
  user: UserType | null;
  mutate: ScopedMutator;
  setDisplayName: React.Dispatch<React.SetStateAction<string>>;
}

const userInfoFormSchema = z.object({
  name: z.string(),
  birthday: z.string(),
});

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  user,
  mutate,
  setDisplayName,
}) => {
  const [selectedBirthday, setSelectedBirthday] = useState<Date | undefined>(
    undefined
  );
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valueChangeDetected, setValueChangeDetected] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof userInfoFormSchema>>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      name: "",
      birthday: "",
    },
  });

  const [name, birthday] = useWatch({
    control: form.control,
    name: ["name", "birthday"],
  });

  useEffect(() => {
    const isNameChanged = name && name !== user?.name;
    const isBirthdayChanged =
      birthday &&
      (!user?.birthday ||
        new Date(birthday).getTime() !== new Date(user.birthday).getTime());

    const isFormIncomplete = !name || !birthday;

    setValueChangeDetected(!!(isNameChanged || isBirthdayChanged));
    setButtonDisabled(isFormIncomplete);
  }, [name, birthday, user]);

  useEffect(() => {
    setDisplayName(name);
  }, [name, setDisplayName]);

  useEffect(() => {
    if (!selectedBirthday) return;

    form.setValue("birthday", selectedBirthday.toISOString() || "");
  }, [selectedBirthday, form]);

  useEffect(() => {
    if (!user) return;

    if (!form.getValues("name")) {
      form.setValue("name", user.name);
    }

    if (user.birthday && !form.getValues("birthday")) {
      setSelectedBirthday(new Date(user.birthday));
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof userInfoFormSchema>) => {
    try {
      setButtonDisabled(true);
      const response = await fetchWithToken({
        url: API_ENDPOINTS.USER.UPDATE,

        options: {
          method: "PUT",
          body: JSON.stringify({
            user: {
              name: values.name,
              birthday: values.birthday,
            },
          }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update user information.");
      }

      mutate(API_ENDPOINTS.USER.SHOW);

      toast({
        description: "User information updated successfully.",
      });

      setValueChangeDetected(false);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <p className="text-lg font-semibold text-text-muted mb-3">Name</p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    className={cn(
                      "p-6 border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted",
                      {
                        "border-error focus:border-error focus:ring-error":
                          form.formState.errors.name,
                      }
                    )}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <p className="text-lg font-semibold text-text-muted mb-3">Birthday</p>
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <BirthdayPicker
            setSelectedBirthday={setSelectedBirthday}
            selectedBirthday={selectedBirthday}
          />
        </div>

        <div className="flex justify-end">
          <Button
            disabled={buttonDisabled || !valueChangeDetected}
            type="submit"
            className="p-2 bg-dark-green w-40"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BasicInfoForm;
