import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md text-center p-6">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <MailCheck className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Vérifiez votre boîte de réception !</CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            Nous vous avons envoyé un e-mail de confirmation. Veuillez cliquer sur le lien qu'il contient pour activer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Si vous ne voyez pas l'e-mail, vérifiez votre dossier de spam.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Retour à la connexion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 