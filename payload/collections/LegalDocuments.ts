import type { CollectionConfig } from 'payload';
import { isAdmin, publicRead } from '../access/admins';

export const LegalDocuments: CollectionConfig = {
  slug: 'legal-documents',
  admin: {
    hidden: true,
    useAsTitle: 'title',
    group: 'Юридичне',
    description: 'Юр.документи: оферта, privacy, cookie, terms. Усі AI-драфти потребують перевірки юристом.',
    defaultColumns: ['title', 'documentType', 'requiresLawyerReview', 'updatedAt'],
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true,
      admin: { description: 'oferta, polityka-konfidentsiynosti, cookie-policy, terms' } },
    {
      name: 'documentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Публічна оферта', value: 'offer' },
        { label: 'Політика конфіденційності', value: 'privacy' },
        { label: 'Cookie Policy', value: 'cookie' },
        { label: 'Terms of Service', value: 'terms' },
        { label: 'Інше', value: 'other' },
      ],
    },
    { name: 'content', type: 'richText', required: true },
    { name: 'effectiveDate', type: 'date', label: 'Дата набуття чинності' },
    { name: 'version', type: 'text', defaultValue: '1.0' },
    {
      name: 'requiresLawyerReview',
      type: 'checkbox',
      label: 'Потребує перевірки юристом',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Жовтий банер в адмінці. Зніміть після перевірки.',
      },
    },
    { name: 'lawyerReviewNotes', type: 'textarea' },
    { name: 'isAIDraft', type: 'checkbox', defaultValue: true,
      admin: { position: 'sidebar' } },
  ],
};
