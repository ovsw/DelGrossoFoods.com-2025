"use client";

import { Button } from "@workspace/ui/components/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import LogoSvg from "@/components/elements/logo";
import { announce } from "@/lib/a11y/announce";

const FORMSPARK_URL = "https://submit-form.com/YPNRQGkpq";

type FormState = "idle" | "submitting" | "success" | "error";

interface ContactFormData {
  name: string;
  email: string;
  brand: "la-famiglia" | "delgrosso-foods" | "";
  message: string;
}

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    watch,
    setValue,
  } = useForm<ContactFormData>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      brand: "",
      message: "",
    },
  });

  const watchedBrand = watch("brand");

  const onSubmit = async (data: ContactFormData) => {
    setFormState("submitting");

    try {
      const response = await fetch(FORMSPARK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setFormState("success");
      reset();
      announce(
        "Thank you for your message! We'll get back to you soon.",
        "polite",
      );
    } catch (error) {
      console.error("Form submission error:", error);
      setFormState("error");
      setError("root", {
        message:
          "Sorry, there was an error sending your message. Please try again.",
      });
      announce(
        "Sorry, there was an error sending your message. Please try again.",
        "assertive",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Name *
          </label>
          <input
            type="text"
            id="contact-name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
            aria-label="Your full name"
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.name ? "border-red-500" : "border-input"
            }`}
            placeholder="Your full name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="contact-email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email address",
              },
            })}
            aria-label="Your email address"
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.email ? "border-red-500" : "border-input"
            }`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Brand Selection */}
        <fieldset>
          <legend className="block text-sm font-medium text-foreground mb-3">
            Which brand are you contacting us about? *
          </legend>
          <RadioGroup
            value={watchedBrand}
            onValueChange={(value) => {
              // Set the form value directly
              setValue(
                "brand",
                value as "la-famiglia" | "delgrosso-foods" | "",
              );
            }}
            className="space-y-3"
            disabled={isSubmitting}
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="la-famiglia" id="la-famiglia" />
              <label
                htmlFor="la-famiglia"
                className="flex items-center space-x-3 cursor-pointer flex-1"
              >
                <div className="relative h-8 w-20 flex-shrink-0 bg-black rounded">
                  <Image
                    src="/images/logos/lfd-logo-light-short-p-500.png"
                    alt="La Famiglia DelGrosso logo"
                    fill
                    sizes="80px"
                    className="object-contain object-left"
                  />
                </div>
                <span className="text-sm font-medium">
                  La Famiglia DelGrosso
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="delgrosso-foods" id="delgrosso-foods" />
              <label
                htmlFor="delgrosso-foods"
                className="flex items-center space-x-3 cursor-pointer flex-1"
              >
                <div className="h-8 w-auto flex-shrink-0">
                  <LogoSvg className="h-8 w-auto" aria-hidden />
                </div>
                <span className="text-sm font-medium">DelGrosso Foods</span>
              </label>
            </div>
          </RadioGroup>

          {/* Hidden input for React Hook Form validation */}
          <input
            type="hidden"
            {...register("brand", { required: "Please select a brand" })}
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
          )}
        </fieldset>

        {/* Message Field */}
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Message *
          </label>
          <textarea
            id="contact-message"
            {...register("message", {
              required: "Message is required",
              minLength: {
                value: 10,
                message: "Message must be at least 10 characters",
              },
            })}
            aria-label="Your message"
            rows={5}
            className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.message ? "border-red-500" : "border-input"
            }`}
            placeholder="Tell us how we can help you..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Sending message..." : "Send message"}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                Sending Message...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {formState === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">
              ✅ Thank you for your message! We&apos;ll get back to you soon.
            </p>
          </div>
        )}

        {errors.root && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">❌ {errors.root.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
