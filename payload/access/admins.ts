import type { Access, FieldAccess } from 'payload';

export const isAdmin: Access = ({ req: { user } }) => Boolean(user);

export const isAdminField: FieldAccess = ({ req: { user } }) => Boolean(user);

export const publicRead: Access = () => true;

export const adminOnly: Access = ({ req: { user } }) => Boolean(user);
