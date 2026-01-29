import { Mail, Phone, MapPin } from "lucide-react";

interface ContactInfoProps {
  email: string;
  phone: string;
  address: string;
}

export function ContactInfo({ email, phone, address }: ContactInfoProps) {
  return (
    <div className="space-y-2 text-sm text-gray-600 mb-4">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 flex-shrink-0" />
        <a href={`mailto:${email}`} className="hover:text-green-600 truncate">
          {email}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 flex-shrink-0" />
        <a href={`tel:${phone}`} className="hover:text-green-600">
          {phone}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{address}</span>
      </div>
    </div>
  );
}
