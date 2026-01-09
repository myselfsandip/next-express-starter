"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { LoginFormData, loginSchema } from "@/lib/validations/auth"
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeIcon, Github, OctagonAlertIcon } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle } from "./ui/alert"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { login } = useAuth();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onsubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            await login(data.email, data.password);
            router.push('/dashboard');
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onsubmit)} className="p-6 md:p-8">
                            {/* Same form content as modal version */}
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Welcome back</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center">
                                                    <FormLabel>Password</FormLabel>
                                                    <a
                                                        href="forgot-password"
                                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </a>
                                                </div>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Enter Password"
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() => setShowPassword((prev) => !prev)}
                                                        >
                                                            {showPassword ? (
                                                                <EyeIcon className="size-4" aria-hidden="true" />
                                                            ) : (
                                                                <EyeClosedIcon className="size-4" aria-hidden="true" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>



                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 text-destructive!" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}

                                <Button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full"
                                >
                                    {isLoading ? "Signing in..." : "Login"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/user-form-banner.png"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
