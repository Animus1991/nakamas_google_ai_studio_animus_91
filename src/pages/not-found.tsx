import { Card, CardContent } from "../components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "../lib/i18n";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">{t('Σφάλμα 404', '404 Page Not Found')}</h1>
          </div>

          <p className="mt-4 text-sm text-gray-900">
            {t('Η σελίδα δεν βρέθηκε. Ελέγξτε τη διεύθυνση URL ή επιστρέψτε στην αρχική σελίδα.', 'The page was not found. Please check the URL or return to the home page.')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
