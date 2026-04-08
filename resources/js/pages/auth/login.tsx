import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { request } from '@/routes/password';
import { store } from '@/routes/login';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk" />

            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Katalog Qoha</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Masuk untuk mengakses layanan manajemen.</p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5 bg-white p-8 rounded-2xl shadow-xl shadow-green-900/5 border border-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:shadow-none"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium dark:text-gray-300">Email Akses</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="admin@qoha.com"
                                    className="rounded-lg border-gray-200 focus:border-green-600 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-800"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-700 font-medium dark:text-gray-300">Kata Sandi</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs text-green-700 hover:text-green-800 font-medium"
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="rounded-lg border-gray-200 focus:border-green-600 focus:ring-green-600 dark:border-gray-700 dark:bg-gray-800"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-gray-300 data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                />
                                <Label htmlFor="remember" className="text-gray-600 font-normal dark:text-gray-400">Ingat saya</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg py-6 shadow-md transition-all active:scale-[0.98]"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2 h-4 w-4" />}
                                Masuk ke Sistem
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-700 bg-green-50 p-3 rounded-lg dark:bg-green-900/30 dark:text-green-400">
                    {status}
                </div>
            )}
            
            <div className="mt-8 text-center">
                <a href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    &larr; Kembali ke Katalog Utama
                </a>
            </div>
        </>
    );
}

Login.layout = null;
